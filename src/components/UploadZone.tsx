import { Upload } from "lucide-react";
import { useCallback } from "react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

const UploadZone = ({ onFilesSelected, isDragging, onDragEnter, onDragLeave }: UploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDragLeave();
      
      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected, onDragLeave]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      onFilesSelected(files);
    }
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 border-dashed transition-all duration-300
        ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
        }
      `}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-6">
          <Upload className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Drop PDF files here
        </h3>
        
        <p className="mb-6 text-sm text-muted-foreground">
          or click to browse from your computer
        </p>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
            Browse Files
          </span>
        </label>
      </div>
    </div>
  );
};

export default UploadZone;
