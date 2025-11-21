import { useState, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import FilesList from "@/components/FilesList";
import CombineSection from "@/components/CombineSection";
import DownloadDialog from "@/components/DownloadDialog";
import { PDFFile, combinePDFs, downloadPDF } from "@/utils/pdfUtils";
import { toast } from "sonner";

const Index = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mergedPdfBytes, setMergedPdfBytes] = useState<Uint8Array | null>(null);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    // Validate file types and sizes
    const invalidFiles = newFiles.filter(f => f.type !== "application/pdf");
    const oversizedFiles = newFiles.filter(f => f.size > 50 * 1024 * 1024);
    
    if (invalidFiles.length > 0) {
      toast.error("Only PDF files are supported.");
      return;
    }
    
    if (oversizedFiles.length > 0) {
      toast.error("Some files exceed the 50MB size limit.");
      return;
    }

    const pdfFiles: PDFFile[] = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
    }));

    setFiles((prev) => [...prev, ...pdfFiles]);
    setIsComplete(false);
    setMergedPdfBytes(null);
    
    toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added`);
  }, []);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setIsComplete(false);
    setMergedPdfBytes(null);
  }, []);

  const handleReorder = useCallback((reorderedFiles: PDFFile[]) => {
    setFiles(reorderedFiles);
  }, []);

  const handleCombine = async () => {
    if (files.length < 2) {
      toast.error("Please add at least 2 PDF files to combine");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBytes = await combinePDFs(files);
      setMergedPdfBytes(pdfBytes);
      setIsComplete(true);
      toast.success("PDFs combined successfully!");
    } catch (error) {
      console.error("Error combining PDFs:", error);
      toast.error("Failed to combine PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const handleDownload = (filename: string) => {
    if (mergedPdfBytes) {
      downloadPDF(mergedPdfBytes, `${filename}.pdf`);
      toast.success("Download started!");
    }
  };

  const handleReset = () => {
    setFiles([]);
    setIsComplete(false);
    setMergedPdfBytes(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {/* Hero Section with Instructions */}
          {files.length === 0 && (
            <>
              <HeroSection />
              
              {/* Upload Zone */}
              <div className="animate-fade-in">
                <UploadZone
                  onFilesSelected={handleFilesSelected}
                  isDragging={isDragging}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                />
              </div>
            </>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Your PDFs
                </h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>

              <FilesList
                files={files}
                onReorder={handleReorder}
                onRemove={handleRemoveFile}
              />

              {/* Add More Files */}
              {!isComplete && (
                <div className="rounded-lg border-2 border-dashed border-border p-4 text-center hover:border-primary/50 transition-colors">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files) {
                          const newFiles = Array.from(e.target.files);
                          handleFilesSelected(newFiles);
                        }
                      }}
                      className="hidden"
                    />
                    <p className="text-sm text-muted-foreground">
                      + Add more PDFs
                    </p>
                  </label>
                </div>
              )}

              {/* Combine Section */}
              <CombineSection
                isProcessing={isProcessing}
                isComplete={isComplete}
                onCombine={handleCombine}
                onDownload={handleDownloadClick}
                fileCount={files.length}
              />
            </div>
          )}

        </div>
      </main>

      {/* Download Dialog */}
      <DownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        onDownload={handleDownload}
      />

      <footer className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 MR PDF. All rights reserved. | www.mrpdf.co.za
        </p>
      </footer>
    </div>
  );
};

export default Index;
