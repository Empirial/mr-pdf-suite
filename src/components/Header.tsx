import logo from "@/assets/mr-pdf-logo.jpg";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={logo} 
              alt="MR PDF Logo" 
              className="h-12 md:h-16 w-auto"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                MR PDF – PDF Combiner
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Fast. Private. Professional.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
