import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import { Camera, Trash2, FileDown, RotateCcw, X } from "lucide-react";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import DownloadDialog from "@/components/DownloadDialog";
import { Button } from "@/components/ui/button";
import { imagesToPDF, downloadPDF } from "@/utils/pdfUtils";
import { toast } from "sonner";

const CameraScanner = () => {
  const webcamRef = useRef<Webcam>(null);
  const [captures, setCaptures] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCaptures((prev) => [...prev, imageSrc]);
        toast.success("Photo captured!");
      }
    }
  }, []);

  const removeCapture = (index: number) => {
    setCaptures((prev) => prev.filter((_, i) => i !== index));
    toast.success("Photo removed");
  };

  const clearAll = () => {
    setCaptures([]);
    setPdfBytes(null);
    toast.success("All photos cleared");
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleSaveAsPDF = async () => {
    if (captures.length === 0) {
      toast.error("Please capture at least one photo");
      return;
    }

    setIsProcessing(true);
    try {
      const bytes = await imagesToPDF(captures);
      setPdfBytes(bytes);
      setShowDownloadDialog(true);
      toast.success("PDF created successfully!");
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (filename: string) => {
    if (pdfBytes) {
      downloadPDF(pdfBytes, `${filename}.pdf`);
      toast.success("Download started!");
    }
  };

  const handleCameraError = () => {
    setCameraError("Unable to access camera. Please ensure you have granted camera permissions.");
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode,
  };

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#DC2626]/15">
                <Camera className="h-6 w-6 text-[#DC2626]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Camera Scanner</h1>
                <p className="text-muted-foreground">Capture photos with your camera and save them as a PDF document</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Camera Feed */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {cameraError ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{cameraError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCameraError(null)}
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMediaError={handleCameraError}
                    className="w-full aspect-video object-cover"
                  />
                  
                  {/* Camera Controls Overlay */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleCamera}
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={capture}
                      className="h-16 w-16 rounded-full shadow-lg"
                    >
                      <Camera className="h-8 w-8" />
                    </Button>
                    
                    <div className="w-10" />
                  </div>
                </div>
              )}
            </div>

            {/* Captured Photos Filmstrip */}
            {captures.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Captured Photos ({captures.length})
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {captures.map((src, index) => (
                    <div key={index} className="relative shrink-0 group">
                      <img
                        src={src}
                        alt={`Capture ${index + 1}`}
                        className="h-24 w-32 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removeCapture(index)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-1 left-1 text-xs bg-background/80 px-1.5 py-0.5 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save as PDF Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleSaveAsPDF}
                disabled={captures.length === 0 || isProcessing}
                className="gap-2"
              >
                <FileDown className="h-5 w-5" />
                {isProcessing ? "Creating PDF..." : "Save as PDF"}
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

export default CameraScanner;
