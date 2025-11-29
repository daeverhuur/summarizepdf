'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FileText } from 'lucide-react';

// Singleton to ensure PDF.js is only initialized once
let pdfjsLibPromise: Promise<any> | null = null;
let workerConfigured = false;

const loadPdfJs = async () => {
  // Only create the promise once
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = (async () => {
      // Ensure we're in the browser
      if (typeof window === 'undefined') {
        throw new Error('PDF.js can only be loaded in browser');
      }

      // Use CDN worker URL
      const workerUrl = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/legacy/build/pdf.worker.min.mjs';
      
      let pdfjsLib;
      
      // Try importing PDF.js - wrap in try-catch to handle initialization errors
      try {
        // Attempt to import - this may fail with Object.defineProperty error
        pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');
      } catch (importError: any) {
        // If import fails, try loading from CDN instead
        console.warn('Local PDF.js import failed, trying CDN:', importError?.message);
        
        try {
          // Load from CDN as fallback
          const cdnModule = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/legacy/build/pdf.mjs' as any);
          pdfjsLib = cdnModule;
        } catch (cdnError) {
          console.error('Both local and CDN imports failed:', cdnError);
          throw new Error('Failed to load PDF.js library');
        }
      }
      
      // Configure worker immediately after import
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions && !workerConfigured) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        workerConfigured = true;
      }
      
      return pdfjsLib;
    })();
  }
  
  return await pdfjsLibPromise;
};

type PdfPagePreviewProps = {
  storageId: Id<'_storage'>;
  title?: string;
  className?: string;
};

export function PdfPagePreview({
  storageId,
  title,
  className = '',
}: PdfPagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle',
  );
  const fileUrl = useQuery(api.uploads.getFileUrl, { storageId });

  useEffect(() => {
    let cancelled = false;
    let pdfDoc: { destroy: () => void } | null = null;

    if (!fileUrl || !canvasRef.current) {
      setStatus('idle');
      return;
    }

    const renderPreview = async () => {
      setStatus('loading');

      try {
        // Load PDF.js library
        const pdfjsLib = await loadPdfJs();

        // Fetch PDF as blob to avoid CORS issues
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }

        const pdfBlob = await response.blob();
        const arrayBuffer = await pdfBlob.arrayBuffer();

        // Load PDF from array buffer instead of URL
        pdfDoc = await pdfjsLib
          .getDocument({
            data: arrayBuffer,
          })
          .promise;

        if (cancelled || !pdfDoc) {
          return;
        }

        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;

        if (!canvas) {
          return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Unable to access canvas context');
        }

        const targetWidth = 360;
        const scale = Math.min(targetWidth / viewport.width, 1.6);
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        await page
          .render({
            canvasContext: context,
            viewport: scaledViewport,
            background: '#ffffff',
          })
          .promise;

        if (!cancelled) {
          setStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
          // Better error handling - log all error types
          const errorDetails: Record<string, unknown> = {
            errorType: typeof error,
            errorString: String(error),
            fileUrl: fileUrl?.substring(0, 100),
          };
          
          if (error instanceof Error) {
            errorDetails.message = error.message;
            errorDetails.stack = error.stack;
            errorDetails.name = error.name;
          } else if (error && typeof error === 'object') {
            try {
              errorDetails.errorObject = JSON.stringify(error, Object.getOwnPropertyNames(error));
            } catch {
              errorDetails.errorObject = 'Could not stringify error object';
            }
          }
          
          console.error('Failed to render PDF preview:', errorDetails);
          setStatus('error');
        }
      }
    };

    renderPreview();

    return () => {
      cancelled = true;
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [fileUrl]);

  const showPlaceholder = status !== 'ready';

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        }`}
        role="img"
        aria-label={title ? `Preview of ${title}` : 'PDF preview'}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#0b0d16] via-transparent to-[#0b0d16] text-center text-xs text-white/60">
          <FileText className="h-8 w-8 text-white/30" />
          <span>
            {status === 'error' ? 'Preview unavailable' : 'Rendering preview'}
          </span>
        </div>
      )}
    </div>
  );
}

