import { PDFDocument } from "pdf-lib";

export interface PDFFile {
  id: string;
  file: File;
}

export const combinePDFs = async (files: PDFFile[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const { file } of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

export const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
  // Create a new typed array to ensure compatibility
  const bytes = new Uint8Array(pdfBytes);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
