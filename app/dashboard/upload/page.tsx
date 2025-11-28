'use client';

import { useState } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { DropZone } from '@/components/upload/DropZone';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const router = useRouter();

  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);
  const extractText = useAction(api.ai.extract.extractText);
  const generateSummary = useAction(api.ai.summarize.generateSummary);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);
    setStatusText('Preparing upload...');

    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      setProgress(20);
      setStatusText('Uploading PDF...');

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = await result.json();
      setProgress(40);
      setStatusText('Creating document...');

      // Create document record
      const documentId = await createDocument({
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        fileSize: file.size,
        pageCount: 0, // Will be updated after processing
        storageId,
      });

      setProgress(50);
      setStatusText('Extracting text from PDF...');

      // Extract text from PDF (this updates status to "processing" then "ready")
      await extractText({ documentId });

      setProgress(70);
      setStatusText('Generating AI summary...');

      // Generate summary using AI
      await generateSummary({
        documentId,
        format: 'paragraph',
        length: 'medium',
      });

      setProgress(100);
      setStatusText('Complete!');

      // Redirect to document page
      setTimeout(() => {
        router.push(`/dashboard/documents/${documentId}`);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
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
            <ProgressBar value={progress} max={100} />
            <p className="text-center text-white/60 mt-4">{statusText || 'Processing...'}</p>
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
