import logo from "@/assets/mr-pdf-logo.jpg";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <img 
            src={logo} 
            alt="MR PDF Logo" 
            className="h-16 w-auto"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              MR PDF – PDF Combiner
            </h1>
            <p className="text-sm text-muted-foreground">
              Fast. Private. Professional.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
