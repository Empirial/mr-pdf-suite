import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ArrowRight } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/tools", label: "Tools" },
];

const SaaSHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="MR PDF Logo" 
              className="h-10 md:h-12 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-display text-foreground">
                MR PDF
              </h1>
              <p className="text-xs text-muted-foreground">
                Professional PDF Suite
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("#") ? (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" className="font-medium">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-gold hover:shadow-gold text-primary-foreground font-medium group">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    link.href.startsWith("#") ? (
                      <button
                        key={link.href}
                        onClick={() => scrollToSection(link.href)}
                        className="text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                  <div className="border-t border-border my-4" />
                  <Button variant="ghost" className="justify-start">
                    Sign In
                  </Button>
                  <Button className="bg-gradient-gold text-primary-foreground">
                    Get Started
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SaaSHeader;