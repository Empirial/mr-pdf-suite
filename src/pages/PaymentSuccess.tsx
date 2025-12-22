import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Gift, Calendar, Sparkles } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);

  // Calculate trial end date (3 days from now)
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 3);

  useEffect(() => {
    // Give a moment for webhook to process
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF Logo" className="h-12 w-auto rounded-lg" />
              <div>
                <h1 className="text-xl font-bold text-foreground">MR PDF</h1>
                <p className="text-xs text-muted-foreground">Professional PDF Suite</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-24 px-4">
        <div className="max-w-md text-center">
          {/* Success Icon with Animation */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-green-500/20 animate-ping" />
            </div>
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Trial Activated! 🎉
          </h1>
          
          <p className="text-lg text-primary font-semibold mb-4">
            Your 3-day free trial has started
          </p>

          <p className="text-muted-foreground mb-8">
            You now have full access to all premium PDF tools. Enjoy!
          </p>

          {/* Trial Info Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Your Free Trial</h3>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>Trial ends: {trialEndDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              After your trial, your subscription continues automatically.
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">What you can do now:</h3>
            </div>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Unlimited PDF conversions
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                No file size limits
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Priority processing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                All 21 premium tools
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                3 days free + 30 days subscription
              </li>
            </ul>
          </div>

          <Link to="/dashboard">
            <Button className="w-full h-12 text-base font-semibold" size="lg">
              Start Using MR PDF Pro
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          
          <p className="text-xs text-muted-foreground mt-4">
            Questions? Contact support@mrpdf.co.za
          </p>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
