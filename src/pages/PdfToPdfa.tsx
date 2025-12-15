import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileCheck, Download, Loader2, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PdfToPdfa = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  }, []);

  const convertFile = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversionType", "pdf-to-pdfa");

      const { data, error } = await supabase.functions.invoke("convert-document", {
        body: formData,
      });

      if (error) throw error;

      const blob = new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(".pdf", "_pdfa.pdf");
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF converted to PDF/A successfully!" });
    } catch (error: any) {
      console.error("Conversion error:", error);
      toast({
        title: "Error",
        description: error.message || "Conversion failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <FileCheck className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">PDF to PDF/A</h1>
                <p className="text-sm text-muted-foreground">Convert for long-term archiving</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground font-medium">What is PDF/A?</p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF/A is an ISO-standardized version of PDF specialized for digital preservation of electronic documents.
                It ensures documents will render exactly the same way in the future.
              </p>
            </div>
          </div>

          {!file ? (
            <UploadZone
              onFilesSelected={handleFilesSelected}
              isDragging={isDragging}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            />
          ) : (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setFile(null)}>
                  Change File
                </Button>
              </div>

              <Button
                onClick={convertFile}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Convert to PDF/A
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PdfToPdfa;
