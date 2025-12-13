import { Shield, Zap, Globe, Lock, Smartphone, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your files never leave your device. All processing happens locally in your browser.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Merge hundreds of PDFs in seconds with our optimized processing engine.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Access from any device, any browser. No downloads or installations required.",
  },
  {
    icon: Lock,
    title: "POPIA Compliant",
    description: "Fully compliant with South African data protection regulations.",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Perfect experience on phones and tablets. Work on the go.",
  },
  {
    icon: Clock,
    title: "24/7 Available",
    description: "No downtime, no maintenance windows. Always ready when you are.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6">
            Built for <span className="text-gradient-gold">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade PDF tools designed with simplicity and security in mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-display mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;