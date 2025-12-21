import { useState } from "react";
import { Link } from "react-router-dom";
import { FileImage, FileText, Trash2, FileDown, X } from "lucide-react";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import DownloadDialog from "@/components/DownloadDialog";
import ImageUploadZone from "@/components/ImageUploadZone";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { imagesToPDF, textToPDF, downloadPDF, fileToBase64, convertImageToPng } from "@/utils/pdfUtils";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

const Converter = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [textContent, setTextContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [activeTab, setActiveTab] = useState("jpg");

  const handleImagesSelected = async (files: File[], requiresConversion: boolean = false) => {
    const newImages: UploadedImage[] = [];
    
    for (const file of files) {
      try {
        let preview: string;
        if (requiresConversion) {
          preview = await convertImageToPng(file);
        } else {
          preview = await fileToBase64(file);
        }
        
        newImages.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          preview,
        });
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(`Failed to process ${file.name}`);
      }
    }
    
    setImages((prev) => [...prev, ...newImages]);
    if (newImages.length > 0) {
      toast.success(`${newImages.length} image(s) added`);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearImages = () => {
    setImages([]);
    setPdfBytes(null);
  };

  const handleTextFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      setTextContent(text);
      toast.success("Text file loaded");
    }
  };

  const handleConvertImages = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsProcessing(true);
    try {
      const base64Images = images.map((img) => img.preview);
      const bytes = await imagesToPDF(base64Images);
      setPdfBytes(bytes);
      setShowDownloadDialog(true);
      toast.success("PDF created successfully!");
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertText = async () => {
    if (!textContent.trim()) {
      toast.error("Please enter or upload some text");
      return;
    }

    setIsProcessing(true);
    try {
      const bytes = await textToPDF(textContent);
      setPdfBytes(bytes);
      setShowDownloadDialog(true);
      toast.success("PDF created successfully!");
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create PDF");
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

  const renderImageConverter = (
    acceptedTypes: string[],
    acceptLabel: string,
    requiresConversion: boolean = false
  ) => (
    <div className="space-y-6">
      <ImageUploadZone
        onFilesSelected={(files) => handleImagesSelected(files, requiresConversion)}
        acceptedTypes={acceptedTypes}
        acceptLabel={acceptLabel}
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Images ({images.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={clearImages}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="w-full h-32 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {img.file.name}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleConvertImages}
              disabled={isProcessing}
              className="gap-2"
            >
              <FileDown className="h-5 w-5" />
              {isProcessing ? "Converting..." : "Convert to PDF"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#F59E0B]/15">
                <FileImage className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">File Converter</h1>
                <p className="text-muted-foreground">Convert images and text files to PDF format</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="mx-auto max-w-4xl space-y-8">
            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); clearImages(); setTextContent(""); }}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="jpg">JPG</TabsTrigger>
                <TabsTrigger value="png">PNG</TabsTrigger>
                <TabsTrigger value="bmp">BMP</TabsTrigger>
                <TabsTrigger value="webp">WebP</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
              </TabsList>

              <div className="mt-6 p-6 rounded-lg border border-border bg-card">
                <TabsContent value="jpg" className="mt-0">
                  <h3 className="text-xl font-semibold mb-4">JPG to PDF</h3>
                  {renderImageConverter(["image/jpeg", ".jpg", ".jpeg"], "JPG")}
                </TabsContent>

                <TabsContent value="png" className="mt-0">
                  <h3 className="text-xl font-semibold mb-4">PNG to PDF</h3>
                  {renderImageConverter(["image/png", ".png"], "PNG")}
                </TabsContent>

                <TabsContent value="bmp" className="mt-0">
                  <h3 className="text-xl font-semibold mb-4">BMP to PDF</h3>
                  {renderImageConverter(["image/bmp", ".bmp"], "BMP", true)}
                </TabsContent>

                <TabsContent value="webp" className="mt-0">
                  <h3 className="text-xl font-semibold mb-4">WebP to PDF</h3>
                  {renderImageConverter(["image/webp", ".webp"], "WebP", true)}
                </TabsContent>

                <TabsContent value="text" className="mt-0">
                  <h3 className="text-xl font-semibold mb-4">Text to PDF</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".txt"
                          onChange={handleTextFileUpload}
                          className="hidden"
                        />
                        <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                          <FileText className="h-4 w-4" />
                          Upload .txt file
                        </span>
                      </label>
                      <span className="text-muted-foreground">or type below</span>
                    </div>

                    <Textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Enter your text here..."
                      className="min-h-[200px] resize-y"
                    />

                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {textContent.length} characters
                      </p>
                      <Button
                        size="lg"
                        onClick={handleConvertText}
                        disabled={!textContent.trim() || isProcessing}
                        className="gap-2"
                      >
                        <FileDown className="h-5 w-5" />
                        {isProcessing ? "Converting..." : "Convert to PDF"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
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

export default Converter;
