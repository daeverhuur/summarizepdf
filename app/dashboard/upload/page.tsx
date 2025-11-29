'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DropZone } from '@/components/upload/DropZone';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';

type StepOptions<T> = {
  label: string;
  target: number;
  duration?: number;
  action?: () => Promise<T> | T;
  holdBuffer?: number;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [showProgressHeartbeat, setShowProgressHeartbeat] = useState(false);
  const router = useRouter();

  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);
  const extractText = useAction(api.ai.extract.extractText);
  const generateSummary = useAction(api.ai.summarize.generateSummary);

  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const progressDripRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastProgressUpdateRef = useRef(Date.now());

  useEffect(() => {
    progressRef.current = progress;
    lastProgressUpdateRef.current = Date.now();
    if (showProgressHeartbeat) {
      setShowProgressHeartbeat(false);
    }
  }, [progress, showProgressHeartbeat]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (progressDripRef.current) {
        clearInterval(progressDripRef.current);
      }
    };
  }, []);

  const smoothProgressTo = useCallback(
    (target: number, duration = 800) => {
      const cappedTarget = Math.min(target, 100);

      return new Promise<void>((resolve) => {
        const start = progressRef.current;
        const delta = cappedTarget - start;

        if (delta <= 0) {
          setProgress(cappedTarget);
          resolve();
          return;
        }

        let startTime: number | null = null;

        const tick = (timestamp: number) => {
          if (startTime === null) {
            startTime = timestamp;
          }

          const elapsed = timestamp - startTime;
          const ratio = Math.min(elapsed / duration, 1);
          const nextValue = start + delta * ratio;
          setProgress(parseFloat(nextValue.toFixed(2)));

          if (ratio < 1) {
            animationFrameRef.current = requestAnimationFrame(tick);
          } else {
            animationFrameRef.current = null;
            resolve();
          }
        };

        animationFrameRef.current = requestAnimationFrame(tick);
      });
    },
    [],
  );

  const stopProgressDrip = useCallback(() => {
    if (progressDripRef.current) {
      clearInterval(progressDripRef.current);
      progressDripRef.current = null;
    }
  }, []);

  const startProgressDrip = useCallback(
    (target: number, tickDuration = 180, holdBuffer = 2) => {
      stopProgressDrip();
      const current = progressRef.current;
      const softTarget = Math.max(Math.min(target - holdBuffer, 100), current);

      if (softTarget <= current) {
        return;
      }

      progressDripRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= softTarget) {
            stopProgressDrip();
            return prev;
          }

          const increment = Math.max((softTarget - prev) * 0.08, 0.15);
          const nextValue = Math.min(prev + increment, softTarget);
          return parseFloat(nextValue.toFixed(2));
        });
      }, tickDuration);
    },
    [stopProgressDrip],
  );

  const runStep = useCallback(
    async <T,>({
      label,
      target,
      duration = 1000,
      action,
      holdBuffer = 2,
    }: StepOptions<T>) => {
      setStatusText(label);

      if (action) {
        startProgressDrip(target, Math.max(duration / 25, 120), holdBuffer);
        try {
          const result = await action();
          stopProgressDrip();
          await smoothProgressTo(target, 400);
          return result;
        } catch (error) {
          stopProgressDrip();
          throw error;
        }
      }

      await smoothProgressTo(target, duration);
      return undefined;
    },
    [smoothProgressTo, startProgressDrip, stopProgressDrip],
  );

  useEffect(() => {
    if (!uploading) {
      setShowProgressHeartbeat(false);
      return;
    }

    lastProgressUpdateRef.current = Date.now();
    const interval = window.setInterval(() => {
      if (Date.now() - lastProgressUpdateRef.current >= 2000) {
        setShowProgressHeartbeat(true);
      }
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, [uploading]);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setShowProgressHeartbeat(false);
    lastProgressUpdateRef.current = Date.now();

    try {
      await runStep({ label: 'Preparing upload...', target: 8, duration: 400 });

      const uploadUrl = await runStep({
        label: 'Creating secure upload session...',
        target: 20,
        duration: 700,
        action: () => generateUploadUrl(),
      });

      if (!uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      const storageId = await runStep({
        label: 'Uploading PDF to encrypted storage...',
        target: 42,
        duration: 1600,
        action: async () => {
          const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          if (!response.ok) {
            throw new Error('Upload to storage failed');
          }

          const { storageId: id } = await response.json();
          if (!id) {
            throw new Error('Storage ID missing from response');
          }
          return id as string;
        },
      });

      const documentId = await runStep({
        label: 'Saving document details...',
        target: 60,
        duration: 700,
        action: () =>
          createDocument({
            title: file.name.replace(/\.pdf$/i, ''),
            fileName: file.name,
            fileSize: file.size,
            pageCount: 0,
            storageId,
          }),
      });

      await runStep({
        label: 'Extracting text from PDF...',
        target: 78,
        duration: 3200,
        action: () => extractText({ documentId }),
      });

      await runStep({
        label: 'Analyzing sections & metadata...',
        target: 86,
        duration: 1200,
      });

      await runStep({
        label: 'Generating AI summary...',
        target: 97,
        duration: 3600,
        holdBuffer: 4,
        action: () =>
          generateSummary({
            documentId,
            format: 'paragraph',
            length: 'medium',
          }),
      });

      await runStep({
        label: 'Finalizing insights...',
        target: 100,
        duration: 600,
      });

      setStatusText('Complete! Opening your summary...');

      setTimeout(() => {
        router.push(`/dashboard/documents/${documentId}`);
      }, 600);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      stopProgressDrip();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setUploading(false);
      setProgress(0);
      setStatusText('');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-3">Upload PDF</h1>
        <p className="text-white/60 text-lg">Upload a PDF to generate an AI summary</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <DropZone onFileSelect={setFile} disabled={uploading} />

        {uploading && (
          <div className="mt-8">
            <ProgressBar value={Math.min(progress, 100)} max={100} />
            <p className="text-center text-white/60 mt-4">{statusText || 'Processing...'}</p>
            {showProgressHeartbeat && (
              <p className="mt-2 text-center text-xs text-[#83e8ff] flex items-center justify-center gap-2">
                <span className="inline-flex">
                  <span className="h-2 w-2 rounded-full bg-[#009de0] animate-pulse" />
                </span>
                Still working—this step sometimes takes a little longer.
              </p>
            )}
          </div>
        )}

        {file && !uploading && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={handleUpload}>
              Generate Summary
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
