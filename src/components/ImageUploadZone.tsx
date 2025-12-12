import { Upload, Image as ImageIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

interface ImageUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string[];
  acceptLabel: string;
  multiple?: boolean;
}

const ImageUploadZone = ({ 
  onFilesSelected, 
  acceptedTypes, 
  acceptLabel,
  multiple = true 
}: ImageUploadZoneProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      const validFiles = droppedFiles.filter((file) => 
        acceptedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type))
      );
      
      const invalidCount = droppedFiles.length - validFiles.length;
      if (invalidCount > 0) {
        toast.error(`${invalidCount} file(s) skipped. Only ${acceptLabel} files are supported.`);
      }

      if (validFiles.length > 0) {
        onFilesSelected(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [onFilesSelected, acceptedTypes, acceptLabel, multiple]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(multiple ? files : [files[0]]);
    }
  };

  const acceptString = acceptedTypes.map(t => t.startsWith('.') ? t : `.${t}`).join(',');

  return (
    <div
      className="relative rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-4">
          <ImageIcon className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Drop {acceptLabel} files here
        </h3>
        
        <p className="mb-4 text-sm text-muted-foreground">
          or click to browse
        </p>
        
        <label className="cursor-pointer">
          <input
            type="file"
            multiple={multiple}
            accept={acceptString}
            onChange={handleFileInput}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
            <Upload className="h-4 w-4" />
            Browse Files
          </span>
        </label>
      </div>
    </div>
  );
};

export default ImageUploadZone;
