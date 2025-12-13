import SaaSHeader from "@/components/SaaSHeader";
import SaaSHero from "@/components/SaaSHero";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import SaaSFooter from "@/components/SaaSFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <SaaSHeader />
      
      <main className="pt-20">
        <SaaSHero />
        
        <div id="features">
          <FeaturesSection />
        </div>
        
        <div id="pricing">
          <PricingSection />
        </div>
        
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        
        <CTASection />
      </main>
      
      <SaaSFooter />
    </div>
  );
};

export default Landing;