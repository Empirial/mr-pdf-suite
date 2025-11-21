import { useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (filename: string) => void;
}

const DownloadDialog = ({ open, onOpenChange, onDownload }: DownloadDialogProps) => {
  const [filename, setFilename] = useState(() => {
    const timestamp = new Date().toISOString().split("T")[0];
    return `merged-pdf-${timestamp}`;
  });

  const handleDownload = () => {
    if (filename.trim()) {
      // Remove .pdf extension if user added it, we'll add it ourselves
      const cleanFilename = filename.trim().replace(/\.pdf$/i, "");
      onDownload(cleanFilename);
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDownload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Your Merged PDF</DialogTitle>
          <DialogDescription>
            Enter a name for your combined PDF file. The .pdf extension will be added automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="my-document"
              autoFocus
              className="col-span-3"
            />
            <p className="text-xs text-muted-foreground">
              Will be saved as: <strong>{filename || "filename"}.pdf</strong>
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={!filename.trim()}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;
