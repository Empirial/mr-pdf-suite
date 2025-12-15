import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOTENBERG_URL = Deno.env.get('GOTENBERG_URL');
    if (!GOTENBERG_URL) {
      throw new Error('GOTENBERG_URL not configured');
    }

    const formData = await req.formData();
    const conversionType = formData.get('conversionType') as string;
    const file = formData.get('file') as File;

    if (!conversionType || !file) {
      throw new Error('Missing conversionType or file');
    }

    console.log(`Converting: ${file.name}, Type: ${conversionType}`);

    let gotenbergEndpoint: string;
    const gotenbergFormData = new FormData();

    switch (conversionType) {
      case 'word-to-pdf':
      case 'excel-to-pdf':
      case 'powerpoint-to-pdf':
        // LibreOffice conversion
        gotenbergEndpoint = `${GOTENBERG_URL}/forms/libreoffice/convert`;
        gotenbergFormData.append('files', file, file.name);
        break;

      case 'html-to-pdf':
        // HTML/URL to PDF
        gotenbergEndpoint = `${GOTENBERG_URL}/forms/chromium/convert/html`;
        gotenbergFormData.append('files', file, 'index.html');
        break;

      case 'url-to-pdf':
        // URL to PDF
        const url = formData.get('url') as string;
        if (!url) throw new Error('URL required for url-to-pdf conversion');
        gotenbergEndpoint = `${GOTENBERG_URL}/forms/chromium/convert/url`;
        gotenbergFormData.append('url', url);
        break;

      case 'pdf-to-pdfa':
        // PDF to PDF/A
        gotenbergEndpoint = `${GOTENBERG_URL}/forms/pdfengines/convert`;
        gotenbergFormData.append('files', file, file.name);
        gotenbergFormData.append('pdfa', 'PDF/A-2b');
        break;

      case 'pdf-to-word':
      case 'pdf-to-excel':
      case 'pdf-to-powerpoint':
        // These require LibreOffice - convert PDF back to office formats
        gotenbergEndpoint = `${GOTENBERG_URL}/forms/libreoffice/convert`;
        gotenbergFormData.append('files', file, file.name);
        // Set native output format
        if (conversionType === 'pdf-to-word') {
          gotenbergFormData.append('nativeOfficeFormats', 'docx');
        } else if (conversionType === 'pdf-to-excel') {
          gotenbergFormData.append('nativeOfficeFormats', 'xlsx');
        } else if (conversionType === 'pdf-to-powerpoint') {
          gotenbergFormData.append('nativeOfficeFormats', 'pptx');
        }
        break;

      default:
        throw new Error(`Unsupported conversion type: ${conversionType}`);
    }

    console.log(`Calling Gotenberg: ${gotenbergEndpoint}`);

    const response = await fetch(gotenbergEndpoint, {
      method: 'POST',
      body: gotenbergFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gotenberg error: ${response.status} - ${errorText}`);
      throw new Error(`Conversion failed: ${errorText}`);
    }

    const resultBuffer = await response.arrayBuffer();
    
    // Determine output content type and filename
    let contentType = 'application/pdf';
    let filename = 'converted.pdf';
    
    if (conversionType === 'pdf-to-word') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename = file.name.replace('.pdf', '.docx');
    } else if (conversionType === 'pdf-to-excel') {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      filename = file.name.replace('.pdf', '.xlsx');
    } else if (conversionType === 'pdf-to-powerpoint') {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      filename = file.name.replace('.pdf', '.pptx');
    } else {
      filename = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
    }

    console.log(`Conversion successful: ${filename}`);

    return new Response(resultBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Conversion error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
