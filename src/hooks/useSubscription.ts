import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  isLoading: boolean;
  isSubscribed: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
  plan: string | null;
}

export const useSubscription = (userId: string | undefined) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isLoading: true,
    isSubscribed: false,
    isTrialActive: false,
    trialDaysRemaining: 0,
    expiresAt: null,
    plan: null,
  });

  useEffect(() => {
    if (!userId) {
      setStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkSubscription = async () => {
      try {
        // Check for active subscription
        const { data: subscription, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching subscription:", error);
          setStatus(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Check if subscription is still valid
        if (subscription && subscription.expires_at) {
          const expiresAt = new Date(subscription.expires_at);
          const now = new Date();
          
          if (expiresAt > now) {
            setStatus({
              isLoading: false,
              isSubscribed: true,
              isTrialActive: false,
              trialDaysRemaining: 0,
              expiresAt: subscription.expires_at,
              plan: subscription.plan,
            });
            return;
          }
        }

        // Check for trial period (1 day from profile creation)
        const { data: profile } = await supabase
          .from("profiles")
          .select("created_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (profile) {
          const createdAt = new Date(profile.created_at);
          const trialEndDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // 1 day trial
          const now = new Date();
          
          if (trialEndDate > now) {
            const remainingMs = trialEndDate.getTime() - now.getTime();
            const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
            
            setStatus({
              isLoading: false,
              isSubscribed: false,
              isTrialActive: true,
              trialDaysRemaining: remainingHours <= 24 ? 1 : 0,
              expiresAt: trialEndDate.toISOString(),
              plan: "trial",
            });
            return;
          }
        }

        // No subscription and trial expired
        setStatus({
          isLoading: false,
          isSubscribed: false,
          isTrialActive: false,
          trialDaysRemaining: 0,
          expiresAt: null,
          plan: null,
        });
      } catch (err) {
        console.error("Error checking subscription:", err);
        setStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSubscription();
  }, [userId]);

  const hasAccess = status.isSubscribed || status.isTrialActive;

  return { ...status, hasAccess };
};
