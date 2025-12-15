import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import CameraScanner from "./pages/CameraScanner";
import SignPdf from "./pages/SignPdf";
import Converter from "./pages/Converter";
import Auth from "./pages/Auth";
import PaymentSuccess from "./pages/PaymentSuccess";
import SplitPdf from "./pages/SplitPdf";
import RotatePdf from "./pages/RotatePdf";
import CompressPdf from "./pages/CompressPdf";
import WatermarkPdf from "./pages/WatermarkPdf";
import PageNumbers from "./pages/PageNumbers";
import ProtectPdf from "./pages/ProtectPdf";
import NotFound from "./pages/NotFound";
import OcrPdf from "./pages/OcrPdf";
import PdfToJpg from "./pages/PdfToJpg";
import CropPdf from "./pages/CropPdf";
import RedactPdf from "./pages/RedactPdf";
import PdfToWord from "./pages/PdfToWord";
import PdfToExcel from "./pages/PdfToExcel";
import PdfToPowerpoint from "./pages/PdfToPowerpoint";
import WordToPdf from "./pages/WordToPdf";
import ExcelToPdf from "./pages/ExcelToPdf";
import PowerpointToPdf from "./pages/PowerpointToPdf";
import HtmlToPdf from "./pages/HtmlToPdf";
import PdfToPdfa from "./pages/PdfToPdfa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/tools" element={<Index />} />
          <Route path="/scan" element={<CameraScanner />} />
          <Route path="/sign" element={<SignPdf />} />
          <Route path="/convert" element={<Converter />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/split" element={<SplitPdf />} />
          <Route path="/rotate" element={<RotatePdf />} />
          <Route path="/compress" element={<CompressPdf />} />
          <Route path="/watermark" element={<WatermarkPdf />} />
          <Route path="/page-numbers" element={<PageNumbers />} />
          <Route path="/protect" element={<ProtectPdf />} />
          <Route path="/ocr" element={<OcrPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/crop" element={<CropPdf />} />
          <Route path="/redact" element={<RedactPdf />} />
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/pdf-to-excel" element={<PdfToExcel />} />
          <Route path="/pdf-to-powerpoint" element={<PdfToPowerpoint />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="/powerpoint-to-pdf" element={<PowerpointToPdf />} />
          <Route path="/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/pdf-to-pdfa" element={<PdfToPdfa />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
