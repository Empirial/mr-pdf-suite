import { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Trash2, Download, X, Loader2 } from "lucide-react";
import ToolsNavHeader from "@/components/ToolsNavHeader";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import ImageUploadZone from "@/components/ImageUploadZone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import JSZip from "jszip";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  webpBlob?: Blob;
  webpUrl?: string;
  converted: boolean;
}

const JpgToWebp = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState([85]);

  const handleImagesSelected = async (files: File[]) => {
    const newImages: UploadedImage[] = [];
    
    for (const file of files) {
      const preview = URL.createObjectURL(file);
      newImages.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        preview,
        converted: false,
      });
    }
    
    setImages((prev) => [...prev, ...newImages]);
    if (newImages.length > 0) {
      toast.success(`${newImages.length} image(s) added`);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find(i => i.id === id);
      if (img?.webpUrl) URL.revokeObjectURL(img.webpUrl);
      if (img?.preview) URL.revokeObjectURL(img.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach(img => {
      if (img.webpUrl) URL.revokeObjectURL(img.webpUrl);
      if (img.preview) URL.revokeObjectURL(img.preview);
    });
    setImages([]);
  };

  const convertToWebp = (file: File, qualityValue: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert to WebP"));
            }
          },
          "image/webp",
          qualityValue / 100
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsProcessing(true);
    
    try {
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          if (img.converted && img.webpBlob) return img;
          
          try {
            const webpBlob = await convertToWebp(img.file, quality[0]);
            const webpUrl = URL.createObjectURL(webpBlob);
            return { ...img, webpBlob, webpUrl, converted: true };
          } catch (error) {
            console.error(`Failed to convert ${img.file.name}:`, error);
            toast.error(`Failed to convert ${img.file.name}`);
            return img;
          }
        })
      );
      
      setImages(updatedImages);
      const convertedCount = updatedImages.filter(img => img.converted).length;
      toast.success(`${convertedCount} image(s) converted to WebP!`);
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Failed to convert images");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (img: UploadedImage) => {
    if (!img.webpBlob) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.webpBlob);
    link.download = img.file.name.replace(/\.(jpg|jpeg|png|bmp|gif)$/i, ".webp");
    link.click();
    toast.success("Download started!");
  };

  const downloadAll = async () => {
    const convertedImages = images.filter(img => img.webpBlob);
    if (convertedImages.length === 0) {
      toast.error("No converted images to download");
      return;
    }

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0]);
      return;
    }

    const zip = new JSZip();
    
    convertedImages.forEach((img) => {
      const filename = img.file.name.replace(/\.(jpg|jpeg|png|bmp|gif)$/i, ".webp");
      zip.file(filename, img.webpBlob!);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "webp-images.zip";
    link.click();
    toast.success("Download started!");
  };

  const hasConverted = images.some(img => img.converted);
  const allConverted = images.length > 0 && images.every(img => img.converted);

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <ToolsNavHeader />

        {/* Tool Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#10B981]/15">
                <Image className="h-6 w-6 text-[#10B981]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">JPG to WebP</h1>
                <p className="text-muted-foreground">Convert JPG images to WebP format for smaller file sizes</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 flex-1">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="p-6 rounded-lg border border-border bg-card space-y-6">
              <ImageUploadZone
                onFilesSelected={handleImagesSelected}
                acceptedTypes={["image/jpeg", "image/png", "image/bmp", "image/gif", ".jpg", ".jpeg", ".png", ".bmp", ".gif"]}
                acceptLabel="JPG, PNG, BMP, GIF"
              />

              {images.length > 0 && (
                <>
                  {/* Quality slider */}
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">WebP Quality</Label>
                      <span className="text-sm font-semibold text-primary">{quality[0]}%</span>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower quality = smaller file size. 80-90% is recommended for most uses.
                    </p>
                  </div>

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
                          src={img.converted && img.webpUrl ? img.webpUrl : img.preview}
                          alt={img.file.name}
                          className="w-full h-32 object-cover rounded-lg border border-border"
                        />
                        {img.converted && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                            WebP
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            {img.file.name}
                          </p>
                          {img.converted && img.webpBlob && (
                            <button
                              onClick={() => downloadSingle(img)}
                              className="ml-1 text-primary hover:text-primary/80"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(img.file.size / 1024).toFixed(1)} KB
                          {img.webpBlob && (
                            <span className="text-green-500 ml-1">
                              → {(img.webpBlob.size / 1024).toFixed(1)} KB
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    {!allConverted && (
                      <Button
                        size="lg"
                        onClick={handleConvert}
                        disabled={isProcessing}
                        className="gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Converting...
                          </>
                        ) : (
                          <>
                            <Image className="h-5 w-5" />
                            Convert to WebP
                          </>
                        )}
                      </Button>
                    )}
                    
                    {hasConverted && (
                      <Button
                        size="lg"
                        variant={allConverted ? "default" : "outline"}
                        onClick={downloadAll}
                        className="gap-2"
                      >
                        <Download className="h-5 w-5" />
                        {images.filter(i => i.converted).length > 1 ? "Download All (ZIP)" : "Download WebP"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Info section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Why WebP?</h3>
                <p className="text-sm text-muted-foreground">
                  WebP images are 25-35% smaller than JPEGs at equivalent quality, 
                  which means faster page loads and less bandwidth usage.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Browser Support</h3>
                <p className="text-sm text-muted-foreground">
                  WebP is supported by all modern browsers including Chrome, Firefox, 
                  Safari, Edge, and Opera. Perfect for web use.
                </p>
              </div>
            </div>
          </div>
        </main>

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

export default JpgToWebp;
