import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import PDFFileCard from "./PDFFileCard";

interface PDFFile {
  id: string;
  file: File;
}

interface FilesListProps {
  files: PDFFile[];
  onReorder: (files: PDFFile[]) => void;
  onRemove: (id: string) => void;
}

const FilesList = ({ files, onReorder, onRemove }: FilesListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  };

  const totalSize = files.reduce((sum, { file }) => sum + file.size, 0);
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm font-medium text-foreground">
          {files.length} {files.length === 1 ? "file" : "files"} selected
        </p>
        <p className="text-sm text-muted-foreground">
          Total: {formatFileSize(totalSize)}
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {files.map((pdfFile) => (
              <PDFFileCard
                key={pdfFile.id}
                id={pdfFile.id}
                file={pdfFile.file}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default FilesList;
