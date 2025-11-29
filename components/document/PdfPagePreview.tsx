'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { FileText } from 'lucide-react';

type PdfJsModule = typeof import('pdfjs-dist/legacy/build/pdf');

let pdfjsLibPromise: Promise<PdfJsModule> | null = null;
let workerConfigured = false;

const loadPdfJs = async (): Promise<PdfJsModule> => {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist/legacy/build/pdf');
  }

  const pdfjsLib = await pdfjsLibPromise;

  if (!workerConfigured) {
    // Use local worker file from public folder (most reliable for Next.js)
    // Falls back to CDN if local file is not available
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    } else {
      // Fallback to CDN for SSR
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs`;
    }
    workerConfigured = true;
  }

  return pdfjsLib;
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
        const pdfjsLib = await loadPdfJs();

        pdfDoc = await pdfjsLib
          .getDocument({
            url: fileUrl,
            withCredentials: true,
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
          console.error('Failed to render PDF preview', error);
          // Log more details for debugging
          if (error instanceof Error) {
            console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              fileUrl: fileUrl?.substring(0, 50) + '...',
            });
          }
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

