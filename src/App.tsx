import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
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
import PdfToWord from "./pages/PdfToWord";
import PdfToExcel from "./pages/PdfToExcel";
import PdfToPowerpoint from "./pages/PdfToPowerpoint";
import WordToPdf from "./pages/WordToPdf";
import ExcelToPdf from "./pages/ExcelToPdf";
import PowerpointToPdf from "./pages/PowerpointToPdf";
import HtmlToPdf from "./pages/HtmlToPdf";
import PdfToPdfa from "./pages/PdfToPdfa";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Subscribe from "./pages/Subscribe";

// Lazy load heavy pages that use pdfjs-dist and tesseract.js
const OcrPdf = lazy(() => import("./pages/OcrPdf"));
const PdfToJpg = lazy(() => import("./pages/PdfToJpg"));
const CropPdf = lazy(() => import("./pages/CropPdf"));
const RedactPdf = lazy(() => import("./pages/RedactPdf"));

const queryClient = new QueryClient();

// Loading fallback for lazy loaded pages
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          {/* Lazy loaded routes for heavy libraries */}
          <Route path="/ocr" element={<Suspense fallback={<PageLoader />}><OcrPdf /></Suspense>} />
          <Route path="/pdf-to-jpg" element={<Suspense fallback={<PageLoader />}><PdfToJpg /></Suspense>} />
          <Route path="/crop" element={<Suspense fallback={<PageLoader />}><CropPdf /></Suspense>} />
          <Route path="/redact" element={<Suspense fallback={<PageLoader />}><RedactPdf /></Suspense>} />
          {/* Regular routes */}
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/pdf-to-excel" element={<PdfToExcel />} />
          <Route path="/pdf-to-powerpoint" element={<PdfToPowerpoint />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="/powerpoint-to-pdf" element={<PowerpointToPdf />} />
          <Route path="/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/pdf-to-pdfa" element={<PdfToPdfa />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
