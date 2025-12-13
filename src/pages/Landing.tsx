import { Link } from "react-router-dom";
import { ArrowRight, Combine, Camera, PenTool, FileImage, Check } from "lucide-react";
import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const tools = [
    {
      title: "Merge PDFs",
      description: "Combine multiple PDF files into one document instantly",
      icon: Combine,
      href: "/tools",
      color: "bg-[#B8935C]",
    },
    {
      title: "Camera Scanner",
      description: "Capture photos and convert them to PDF documents",
      icon: Camera,
      href: "/scan",
      color: "bg-[#2C2C2C]",
    },
    {
      title: "Sign PDF",
      description: "Add your digital signature to any PDF file",
      icon: PenTool,
      href: "/sign",
      color: "bg-[#B8935C]",
    },
    {
      title: "File Converter",
      description: "Convert images and text files to PDF format",
      icon: FileImage,
      href: "/convert",
      color: "bg-[#2C2C2C]",
    },
  ];

  const features = [
    "100% Private - No uploads to servers",
    "Lightning fast processing",
    "No file size limits",
    "Unlimited conversions",
    "Works on all devices",
    "POPIA compliant",
  ];

  return (
    <div className="min-h-screen bg-white">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B8935C]/10 border border-[#B8935C]/20 mb-8">
                <div className="h-2 w-2 rounded-full bg-[#B8935C] animate-pulse" />
                <span className="text-sm font-medium text-[#2C2C2C]">
                  100% Private • No Upload Required
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#2C2C2C] mb-6 leading-tight">
                Professional PDF Tools
                <br />
                <span className="text-[#B8935C]">Made Simple</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                Merge, sign, and convert PDFs instantly in your browser. No uploads, no signups, 
                no compromises. Trusted by South African professionals.
              </p>

              <Link to="/tools">
                <Button
                  size="lg"
                  className="bg-[#B8935C] hover:bg-[#A07D4A] text-white font-semibold px-8 h-14 text-lg group shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                No credit card required • Free forever
              </p>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8935C]/10 text-[#B8935C] text-sm font-medium mb-4">
                  Our Tools
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
                  Everything You Need for PDFs
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  All the essential PDF tools in one place, working right in your browser
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {tools.map((tool, index) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-xl hover:border-[#B8935C]/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative z-10">
                      <div
                        className={`inline-flex p-4 rounded-xl ${tool.color} text-white mb-6 group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#2C2C2C] mb-3 group-hover:text-[#B8935C] transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-[#B8935C] font-medium">
                        Try it now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

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
                      <span className="text-5xl font-bold text-[#2C2C2C]">R3</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                    <p className="text-gray-600">
                      Everything you need for professional PDF work
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-[#B8935C]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-4 w-4 text-[#B8935C]" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-[#B8935C] hover:bg-[#A07D4A] text-white font-semibold h-12 text-lg shadow-lg"
                  >
                    Start Free Trial
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    No credit card required • Cancel anytime
                  </p>
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
                <ul className="space-y-2">
                  <li className="text-gray-400 flex items-center gap-2">
                    <span>📱</span>
                    <a href="tel:+27079-862-9246" className="hover:text-white transition-colors">
                      (+27)79-862-9246
                    </a>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <span>📘</span>
                    <a href="#" className="hover:text-white transition-colors">
                      @Empirial Designs
                    </a>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <span>📷</span>
                    <a href="#" className="hover:text-white transition-colors">
                      @Empirial Designs
                    </a>
                  </li>
                  <li className="text-gray-400 flex items-center gap-2">
                    <span>💼</span>
                    <a href="#" className="hover:text-white transition-colors">
                      @Lufuno Mphela
                    </a>
                  </li>
                </ul>
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
    </div>
  );
};

export default Landing;
