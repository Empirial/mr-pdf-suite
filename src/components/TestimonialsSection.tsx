import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah van der Berg",
    role: "Legal Consultant, Cape Town",
    content: "MR PDF has revolutionized how I handle legal documents. The privacy features are essential for my practice.",
    rating: 5,
  },
  {
    name: "Thabo Molefe",
    role: "Financial Advisor, Johannesburg",
    content: "Fast, secure, and incredibly easy to use. I merge client reports daily and it saves me hours every week.",
    rating: 5,
  },
  {
    name: "Priya Naidoo",
    role: "HR Manager, Durban",
    content: "Finally a PDF tool that works in Rands! The team collaboration features are perfect for our HR department.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display mb-6">
            Trusted by <span className="text-gradient-gold">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what South African businesses are saying about MR PDF.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;