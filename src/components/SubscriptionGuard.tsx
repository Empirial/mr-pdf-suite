import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Crown, Loader2 } from "lucide-react";
import mrPdfLogo from "@/assets/mr-pdf-logo.jpg";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoading: subLoading, hasAccess, isTrialActive, trialDaysRemaining } = useSubscription(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading while checking auth and subscription
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <img 
            src={mrPdfLogo} 
            alt="MR PDF" 
            className="h-16 w-16 rounded-xl mx-auto mb-4 shadow-lg"
          />
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  // User not logged in (shouldn't reach here due to redirect, but just in case)
  if (!user) {
    return null;
  }

  // User has no access - show upgrade prompt
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Subscription Required
            </h1>
            <p className="text-muted-foreground">
              Your trial has expired. Subscribe to continue using all PDF tools.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-lg text-foreground mb-2">Pro Plan</h2>
            <div className="mb-4">
              <span className="text-4xl font-bold text-foreground">$5</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2 text-left mb-6">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                All 21 PDF tools
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Unlimited conversions
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                No file size limits
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Priority support
              </li>
            </ul>
            <Link to="/subscribe">
              <Button className="w-full" size="lg">
                <Crown className="h-4 w-4 mr-2" />
                Subscribe Now
              </Button>
            </Link>
          </div>

          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Show trial banner if on trial
  if (isTrialActive) {
    return (
      <>
        <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-sm">
          <span className="text-primary font-medium">
            🎉 Trial Active: {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} remaining
          </span>
          {" · "}
          <Link to="/subscribe" className="text-primary underline hover:no-underline">
            Subscribe now
          </Link>
        </div>
        {children}
      </>
    );
  }

  // User has access
  return <>{children}</>;
};

export default SubscriptionGuard;
