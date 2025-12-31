import { useState, useEffect } from "react";

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
    isLoading: false,
    isSubscribed: true, // Everyone has access now
    isTrialActive: false,
    trialDaysRemaining: 0,
    expiresAt: null,
    plan: "free",
    needsPayment: false,
  });

  // Always grant access - website is free
  const hasAccess = true;

  return { ...status, hasAccess };
};
