import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import { toast } from "sonner";
import { Crown, Check, ArrowLeft, Calendar, CreditCard, Loader2 } from "lucide-react";

const Subscribe = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoading, isSubscribed, isTrialActive, trialDaysRemaining, expiresAt, plan } = useSubscription(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-yoco-checkout", {
        body: {
          planId: "pro",
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/subscribe`,
        },
      });

      if (error) throw error;

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create checkout");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "All 21 PDF tools included",
    "Unlimited conversions",
    "No file size limits",
    "100% secure & private",
    "Works on all devices",
    "Priority support",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ToolsNavHeader />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ToolsNavHeader />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription</h1>
          <p className="text-muted-foreground mb-8">Manage your MR PDF subscription</p>

          {/* Current Status */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-lg text-foreground mb-4">Current Status</h2>
            
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                isSubscribed ? "bg-primary/10" : isTrialActive ? "bg-amber-500/10" : "bg-muted"
              }`}>
                <Crown className={`h-6 w-6 ${
                  isSubscribed ? "text-primary" : isTrialActive ? "text-amber-500" : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {isSubscribed ? "Pro Plan" : isTrialActive ? "Trial Active" : "No Active Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSubscribed 
                    ? "Full access to all tools" 
                    : isTrialActive 
                      ? `${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} remaining`
                      : "Subscribe to access all tools"
                  }
                </p>
              </div>
            </div>

            {expiresAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
                <Calendar className="h-4 w-4" />
                <span>
                  {isSubscribed ? "Expires" : "Trial ends"}: {new Date(expiresAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Pricing Card */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-primary px-4 py-1.5 rounded-full text-xs font-semibold text-primary-foreground shadow-lg">
                {isSubscribed ? "Current Plan" : "Recommended"}
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">Pro Plan</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold text-foreground">$5</span>
                <span className="text-lg text-muted-foreground ml-2">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Billed monthly • Cancel anytime
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {isSubscribed ? (
              <div className="text-center">
                <div className="bg-muted rounded-lg px-4 py-3 mb-4">
                  <p className="text-sm text-muted-foreground">
                    You're all set! Enjoy all PDF tools.
                  </p>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Currently Subscribed
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isTrialActive ? "Subscribe Now" : "Start Subscription"}
                  </>
                )}
              </Button>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secure payment via Yoco
            </p>
          </div>

          {/* Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Questions? Contact us at support@mrpdf.co.za</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 MR PDF. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Subscribe;
