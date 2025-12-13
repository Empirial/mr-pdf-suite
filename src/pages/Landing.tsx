import { Link } from "react-router-dom";
import { ArrowRight, Combine, Camera, PenTool, FileImage, Check } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const Landing = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const tools = [{
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one document instantly",
    icon: Combine,
    href: "/tools",
    color: "bg-[#B8935C]"
  }, {
    title: "Camera Scanner",
    description: "Capture photos and convert them to PDF documents",
    icon: Camera,
    href: "/scan",
    color: "bg-[#2C2C2C]"
  }, {
    title: "Sign PDF",
    description: "Add your digital signature to any PDF file",
    icon: PenTool,
    href: "/sign",
    color: "bg-[#B8935C]"
  }, {
    title: "File Converter",
    description: "Convert images and text files to PDF format",
    icon: FileImage,
    href: "/convert",
    color: "bg-[#2C2C2C]"
  }];
  const features = ["100% Private - No uploads to servers", "Lightning fast processing", "No file size limits", "Unlimited conversions", "Works on all devices", "All Features included"];

  useEffect(() => {
    const container = toolsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const slideHeight = window.innerHeight;
      const newActiveSlide = Math.round(scrollTop / slideHeight);
      setActiveSlide(newActiveSlide);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="MR PDF Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-[#2C2C2C]">MR PDF</h1>
                <p className="text-xs text-gray-600">Professional PDF Suite</p>
              </div>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2C2C2C] mb-6 leading-tight">The PDF Toolkit In
Made Simple<br />
                <span className="text-[#B8935C]">Made Simple</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">Merge, sign, and convert PDFs instantly in your browser.</p>

              <Link to="/tools">
                <Button size="lg" className="bg-[#B8935C] hover:bg-[#A07D4A] text-white font-semibold px-8 h-14 text-lg group shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-6">3 Days Free Trial - Unlimited Access</p>
            </div>
          </div>
        </section>

        {/* Full-Screen Tools Section */}
        <div 
          ref={toolsContainerRef}
          className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          {tools.map((tool, index) => (
            <section
              key={tool.href}
              className="h-screen w-full flex items-center justify-center snap-start snap-always relative overflow-hidden"
              style={{ 
                scrollSnapAlign: 'start',
                background: index % 2 === 0 
                  ? 'linear-gradient(135deg, #FAFAFA 0%, #F5F0E8 100%)' 
                  : 'linear-gradient(135deg, #2C2C2C 0%, #1a1a1a 100%)'
              }}
            >
              {/* Background decoration */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 70%, ${index % 2 === 0 ? '#B8935C' : '#fff'} 0%, transparent 50%)`
                }}
              />
              
              {/* Navigation dots */}
              <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
                {tools.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => {
                      const container = toolsContainerRef.current;
                      if (container) {
                        container.scrollTo({
                          top: dotIndex * window.innerHeight,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeSlide === dotIndex 
                        ? 'bg-[#B8935C] scale-125' 
                        : index % 2 === 0 ? 'bg-gray-400 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>

              {/* Tool content */}
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                  <div 
                    className={`inline-flex p-8 rounded-3xl ${tool.color} text-white mb-10 shadow-2xl transform transition-transform duration-500 hover:scale-110`}
                  >
                    <tool.icon className="h-16 w-16 md:h-24 md:w-24" />
                  </div>
                  
                  <h2 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 ${
                    index % 2 === 0 ? 'text-[#2C2C2C]' : 'text-white'
                  }`}>
                    {tool.title}
                  </h2>
                  
                  <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${
                    index % 2 === 0 ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {tool.description}
                  </p>
                  
                  <Link to={tool.href}>
                    <Button 
                      size="lg" 
                      className={`${
                        index % 2 === 0 
                          ? 'bg-[#B8935C] hover:bg-[#A07D4A] text-white' 
                          : 'bg-white hover:bg-gray-100 text-[#2C2C2C]'
                      } font-semibold px-12 h-16 text-xl group shadow-xl`}
                    >
                      Try {tool.title}
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Scroll indicator for first slide */}
              {index === 0 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                  <span className="text-sm text-gray-500">Scroll to explore</span>
                  <div className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-2">
                    <div className="w-1.5 h-3 bg-gray-400 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8935C]/10 text-[#B8935C] text-sm font-medium mb-4">
                  Simple Pricing
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
                  One Price. Everything Included.
                </h2>
                <p className="text-lg text-gray-600">
                  No hidden fees. Cancel anytime. All prices in South African Rand.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative rounded-3xl border-2 border-[#B8935C] bg-white p-8 shadow-2xl">
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#B8935C] px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[#2C2C2C] mb-4">Pro Plan</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-[#2C2C2C]">$3</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <p className="text-gray-600">
                      Everything you need for professional PDF work
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map(feature => <li key={feature} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8935C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-[#B8935C]" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>)}
                  </ul>

                  <Button className="w-full bg-[#B8935C] hover:bg-[#A07D4A] text-white font-semibold h-12 text-lg shadow-lg">
                    Start Free Trial
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">3 Days Trial - Unlimited Acces</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src={logo} alt="MR PDF Logo" className="h-10 w-auto" />
                  <span className="text-xl font-bold">MR PDF</span>
                </div>
                <p className="text-gray-400 mb-4">
                  Professional PDF tools for South African businesses. Fast, secure, and completely private.
                </p>
                <p className="text-gray-400">🇿🇦 Made in South Africa</p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4 text-[#B8935C]">Tools</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/tools" className="text-gray-400 hover:text-white transition-colors">
                      Merge PDFs
                    </Link>
                  </li>
                  <li>
                    <Link to="/scan" className="text-gray-400 hover:text-white transition-colors">
                      Scanner
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign" className="text-gray-400 hover:text-white transition-colors">
                      Sign PDF
                    </Link>
                  </li>
                  <li>
                    <Link to="/convert" className="text-gray-400 hover:text-white transition-colors">
                      Convert
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4 text-[#B8935C]">Contact</h4>
                
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  POPIA Compliance
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;