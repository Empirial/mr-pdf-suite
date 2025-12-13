import { ArrowRight, Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/mr-pdf-logo.jpg";

const SaaSHero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              100% Private • No Upload Required
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display mb-8 animate-fade-in-up leading-tight">
            Professional PDF Tools{" "}
            <span className="text-gradient-gold">Made Simple</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Merge, sign, and convert PDFs instantly in your browser. No uploads, no signups, no compromises. Trusted by thousands of South African professionals.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Link to="/tools">
              <Button
                size="lg"
                className="bg-gradient-gold hover:shadow-gold text-primary-foreground font-semibold px-8 h-14 text-lg group"
              >
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="font-semibold px-8 h-14 text-lg group"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-12 border-t border-border animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by professionals across South Africa
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display text-foreground">50K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="w-px h-12 bg-border hidden md:block" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display text-foreground">2M+</p>
                <p className="text-sm text-muted-foreground">PDFs Processed</p>
              </div>
              <div className="w-px h-12 bg-border hidden md:block" />
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-display text-foreground">4.9★</p>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaaSHero;