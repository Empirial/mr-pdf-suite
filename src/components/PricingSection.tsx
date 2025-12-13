import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "R0",
    period: "forever",
    description: "Perfect for occasional use",
    icon: Zap,
    features: [
      "Merge up to 5 PDFs",
      "Basic file conversion",
      "Camera scanner",
      "5MB file limit",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "R149",
    period: "per month",
    description: "For professionals who need more",
    icon: Sparkles,
    features: [
      "Unlimited PDF merging",
      "Advanced file conversion",
      "Digital signatures",
      "50MB file limit",
      "Priority processing",
      "No watermarks",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "R499",
    period: "per month",
    description: "For teams and businesses",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited file size",
      "API access",
      "Team collaboration",
      "Custom branding",
      "Dedicated support",
      "SSO integration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6">
            Choose Your <span className="text-gradient-gold">Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. Cancel anytime. All prices in South African Rand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-dark text-primary-foreground shadow-luxury scale-105 z-10"
                  : "bg-card border border-border hover:shadow-lg hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-gold px-4 py-1.5 rounded-full text-sm font-semibold text-primary-foreground shadow-gold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  plan.popular ? "bg-primary/20" : "bg-primary/10"
                }`}>
                  <plan.icon className={`h-6 w-6 ${plan.popular ? "text-primary-glow" : "text-primary"}`} />
                </div>
                <h3 className={`text-2xl font-display mb-2 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl md:text-5xl font-display ${plan.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ml-2 ${plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      plan.popular ? "text-primary-glow" : "text-primary"
                    }`} />
                    <span className={`text-sm ${plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-semibold ${
                  plan.popular
                    ? "bg-gradient-gold hover:shadow-gold text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          All plans include SSL encryption and POPIA compliance. VAT excluded.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;