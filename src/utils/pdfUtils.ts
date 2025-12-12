import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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

// Convert base64 data URL to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const base64Data = base64.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Determine image type from base64 data URL
const getImageType = (base64: string): "png" | "jpg" => {
  if (base64.includes("data:image/png")) return "png";
  return "jpg";
};

// Convert images (base64) to PDF
export const imagesToPDF = async (images: string[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const imageData of images) {
    const imageBytes = base64ToUint8Array(imageData);
    const imageType = getImageType(imageData);

    let image;
    if (imageType === "png") {
      image = await pdfDoc.embedPng(imageBytes);
    } else {
      image = await pdfDoc.embedJpg(imageBytes);
    }

    const { width, height } = image.scale(1);
    
    // Create a page that fits the image (max A4 size, scaled proportionally)
    const maxWidth = 595; // A4 width in points
    const maxHeight = 842; // A4 height in points
    
    let pageWidth = width;
    let pageHeight = height;
    
    if (width > maxWidth || height > maxHeight) {
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const ratio = Math.min(widthRatio, heightRatio);
      pageWidth = width * ratio;
      pageHeight = height * ratio;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  return await pdfDoc.save();
};

// Convert text content to PDF
export const textToPDF = async (textContent: string): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const fontSize = 12;
  const margin = 50;
  const pageWidth = 595; // A4 width
  const pageHeight = 842; // A4 height
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * 1.5;
  
  // Split text into lines that fit the page width
  const words = textContent.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (textWidth <= maxLineWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Handle explicit line breaks
  const allLines: string[] = [];
  for (const line of lines) {
    const splitLines = line.split(/\n/);
    allLines.push(...splitLines);
  }
  
  // Create pages with text
  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  let lineIndex = 0;
  
  while (lineIndex < allLines.length) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;
    
    for (let i = 0; i < linesPerPage && lineIndex < allLines.length; i++) {
      page.drawText(allLines[lineIndex], {
        x: margin,
        y: y - lineHeight,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
      lineIndex++;
    }
  }

  return await pdfDoc.save();
};

// Embed signature on existing PDF
export interface SignaturePosition {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  page?: number; // 0-indexed
}

export const embedSignature = async (
  pdfBytes: Uint8Array,
  signatureImage: string,
  position?: SignaturePosition
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  
  const pageIndex = position?.page ?? 0;
  const page = pages[Math.min(pageIndex, pages.length - 1)];
  const { width: pageWidth, height: pageHeight } = page.getSize();
  
  // Embed the signature image
  const signatureBytes = base64ToUint8Array(signatureImage);
  const imageType = getImageType(signatureImage);
  
  let sigImage;
  if (imageType === "png") {
    sigImage = await pdfDoc.embedPng(signatureBytes);
  } else {
    sigImage = await pdfDoc.embedJpg(signatureBytes);
  }
  
  // Default signature size and position (bottom right)
  const sigWidth = position?.width ?? 150;
  const sigHeight = position?.height ?? 50;
  const sigX = position?.x ?? pageWidth - sigWidth - 50;
  const sigY = position?.y ?? 50;
  
  page.drawImage(sigImage, {
    x: sigX,
    y: sigY,
    width: sigWidth,
    height: sigHeight,
  });

  return await pdfDoc.save();
};

// Helper: Convert image file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper: Convert image to PNG via canvas (for BMP, WebP, etc.)
export const convertImageToPng = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngDataUrl = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
        resolve(pngDataUrl);
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    
    img.src = url;
  });
};
