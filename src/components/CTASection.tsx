import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-primary-foreground mb-6">
            Ready to Transform Your{" "}
            <span className="text-gradient-gold">PDF Workflow?</span>
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
            Join thousands of South African professionals who trust MR PDF for their document needs. Start free, upgrade when you're ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools">
              <Button
                size="lg"
                className="bg-gradient-gold hover:shadow-gold text-primary-foreground font-semibold px-8 group"
              >
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8"
            >
              View Pricing
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/50 mt-8">
            No credit card required • Free plan available forever
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;