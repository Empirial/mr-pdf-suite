import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionStatus {
  isLoading: boolean;
  isSubscribed: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  expiresAt: string | null;
  plan: string | null;
  needsPayment: boolean;
}

export const useSubscription = (userId: string | undefined) => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isLoading: true,
    isSubscribed: false,
    isTrialActive: false,
    trialDaysRemaining: 0,
    expiresAt: null,
    plan: null,
    needsPayment: false,
  });

  useEffect(() => {
    if (!userId) {
      setStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkSubscription = async () => {
      try {
        // Check for subscription with trial or active status
        const { data: subscription, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .in("status", ["active", "trial"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching subscription:", error);
          setStatus(prev => ({ ...prev, isLoading: false, needsPayment: true }));
          return;
        }

        const now = new Date();

        // Check if user is in trial period (paid but within 3 days)
        if (subscription?.status === "trial" && subscription.trial_ends_at) {
          const trialEndsAt = new Date(subscription.trial_ends_at);
          
          if (trialEndsAt > now) {
            const remainingMs = trialEndsAt.getTime() - now.getTime();
            const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
            
            setStatus({
              isLoading: false,
              isSubscribed: false,
              isTrialActive: true,
              trialDaysRemaining: remainingDays,
              expiresAt: subscription.trial_ends_at,
              plan: "trial",
              needsPayment: false,
            });
            return;
          }
        }

        // Check if subscription is active and not expired
        if (subscription?.status === "active" && subscription.expires_at) {
          const expiresAt = new Date(subscription.expires_at);
          
          if (expiresAt > now) {
            setStatus({
              isLoading: false,
              isSubscribed: true,
              isTrialActive: false,
              trialDaysRemaining: 0,
              expiresAt: subscription.expires_at,
              plan: subscription.plan,
              needsPayment: false,
            });
            return;
          }
        }

        // Check if trial ended but subscription still active
        if (subscription?.status === "trial" && subscription.expires_at) {
          const expiresAt = new Date(subscription.expires_at);
          
          if (expiresAt > now) {
            // Trial ended, transition to active subscription
            setStatus({
              isLoading: false,
              isSubscribed: true,
              isTrialActive: false,
              trialDaysRemaining: 0,
              expiresAt: subscription.expires_at,
              plan: subscription.plan,
              needsPayment: false,
            });
            return;
          }
        }

        // No valid subscription - user needs to pay to start trial
        setStatus({
          isLoading: false,
          isSubscribed: false,
          isTrialActive: false,
          trialDaysRemaining: 0,
          expiresAt: null,
          plan: null,
          needsPayment: true,
        });
      } catch (err) {
        console.error("Error checking subscription:", err);
        setStatus(prev => ({ ...prev, isLoading: false, needsPayment: true }));
      }
    };

    checkSubscription();
  }, [userId]);

  const hasAccess = status.isSubscribed || status.isTrialActive;

  return { ...status, hasAccess };
};
