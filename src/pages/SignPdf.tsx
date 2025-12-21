import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, Trash2, FileDown, FileText } from "lucide-react";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import DownloadDialog from "@/components/DownloadDialog";
import { Button } from "@/components/ui/button";
import { embedSignature, downloadPDF } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SignPdf = () => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [signedPdfBytes, setSignedPdfBytes] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(new Uint8Array(arrayBuffer));
      setSignedPdfBytes(null);
      toast.success("PDF uploaded successfully!");
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  const handleApplySignature = async () => {
    if (!pdfBytes) {
      toast.error("Please upload a PDF first");
      return;
    }

    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error("Please draw your signature");
      return;
    }

    setIsProcessing(true);
    try {
      const signatureDataUrl = signatureRef.current.toDataURL("image/png");
      const signedBytes = await embedSignature(pdfBytes, signatureDataUrl);
      setSignedPdfBytes(signedBytes);
      setShowDownloadDialog(true);
      toast.success("Signature applied successfully!");
    } catch (error) {
      console.error("Error applying signature:", error);
      toast.error("Failed to apply signature. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (signedPdfBytes) {
      downloadPDF(signedPdfBytes, `${filename}.pdf`);
      toast.success("Download started!");
    }
  };

  const resetAll = () => {
    setPdfFile(null);
    setPdfBytes(null);
    setSignedPdfBytes(null);
    clearSignature();
  };

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#B8935C]/15">
                <PenTool className="h-6 w-6 text-[#B8935C]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sign PDF</h1>
                <p className="text-muted-foreground">Upload a PDF and add your digital signature</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload PDF Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">1. Upload PDF</h3>
                
                {!pdfFile ? (
                  <label className="block">
                    <div className="rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all cursor-pointer p-8 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-foreground font-medium mb-1">Click to upload PDF</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{pdfFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={resetAll}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Signature Pad Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">2. Draw Signature</h3>
                
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <div className="bg-white">
                    <SignatureCanvas
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{
                        className: "w-full h-48",
                        style: { width: "100%", height: "192px" },
                      }}
                      onEnd={handleSignatureEnd}
                    />
                  </div>
                  <div className="p-3 border-t border-border flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {hasSignature ? "Signature ready" : "Draw your signature above"}
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearSignature}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply & Download */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleApplySignature}
                disabled={!pdfFile || !hasSignature || isProcessing}
                className="gap-2"
              >
                <FileDown className="h-5 w-5" />
                {isProcessing ? "Applying..." : "Apply Signature & Download"}
              </Button>
            </div>
          </div>
        </main>

        <DownloadDialog
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          onDownload={handleDownload}
        />

        <footer className="border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">© 2025 MR PDF. All rights reserved.</p>
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SubscriptionGuard>
  );
};

export default SignPdf;
