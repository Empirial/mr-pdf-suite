import { Upload, ArrowDownUp, Download } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="text-center space-y-6 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">
        Free PDF Merger – Combine PDFs Online
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Fast, secure, and completely private. <strong>Merge multiple PDF files</strong> into one
        professional document without uploading to any server. The best <strong>free PDF combiner tool</strong> for instant results.
      </p>

      {/* Step-by-step instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">1. Upload Files</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your PDF files or click to browse. Add as many as you need.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowDownUp className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">2. Arrange Order</h3>
          <p className="text-sm text-muted-foreground">
            Drag files to reorder them exactly how you want in the final PDF.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 p-6 rounded-lg bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">3. Download</h3>
          <p className="text-sm text-muted-foreground">
            Click combine, wait a moment, and download your merged PDF instantly.
          </p>
        </div>
      </div>

      {/* Privacy badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="text-sm font-medium text-primary">
          100% Private - All processing happens in your browser
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
