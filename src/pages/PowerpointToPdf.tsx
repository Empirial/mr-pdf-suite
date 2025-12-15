import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Presentation, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PowerpointToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = useCallback((files: File[]) => {
    const validFiles = files.filter(
      (f) =>
        f.type === "application/vnd.ms-powerpoint" ||
        f.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );
    if (validFiles.length > 0) {
      setFile(validFiles[0]);
    } else {
      toast({ title: "Invalid file", description: "Please upload a PowerPoint file (.ppt or .pptx)", variant: "destructive" });
    }
  }, [toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFilesSelected(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesSelected(Array.from(e.target.files));
    }
  };

  const convertFile = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversionType", "powerpoint-to-pdf");

      const { data, error } = await supabase.functions.invoke("convert-document", {
        body: formData,
      });

      if (error) throw error;

      const blob = new Blob([data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.(ppt|pptx)$/i, ".pdf");
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PowerPoint converted to PDF successfully!" });
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
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">PowerPoint to PDF</h1>
                <p className="text-sm text-muted-foreground">Convert PPTX to PDF</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            >
              <Presentation className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Drop your PowerPoint file here
              </h3>
              <p className="text-muted-foreground mb-4">or click to browse</p>
              <input
                type="file"
                accept=".ppt,.pptx"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Presentation className="h-10 w-10 text-red-500" />
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
                    Convert to PDF
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

export default PowerpointToPdf;
