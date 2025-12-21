import { useState, useCallback } from "react";
import { FileType, Download, Loader2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ToolPageLayout from "@/components/ToolPageLayout";

const PdfToWord = () => {
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
      formData.append("conversionType", "pdf-to-word");

      const { data, error } = await supabase.functions.invoke("convert-document", {
        body: formData,
      });

      if (error) throw error;

      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(".pdf", ".docx");
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Success", description: "PDF converted to Word successfully!" });
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
    <ToolPageLayout
      title="PDF to Word"
      description="Convert PDF to editable DOCX"
      icon={FileType}
      iconColor="#2563EB"
    >
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground font-medium">Note about PDF to Word conversion</p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF to Word conversion works best with text-based PDFs. Complex layouts, images, and scanned documents may not convert perfectly.
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
                Convert to Word
              </>
            )}
          </Button>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default PdfToWord;
