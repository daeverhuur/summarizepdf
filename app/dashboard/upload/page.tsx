'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
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
  const router = useRouter();

  const generateUploadUrl = useMutation(api.uploads.generateUploadUrl);
  const createDocument = useMutation(api.documents.create);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(10);

    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();
      setProgress(30);

      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      const { storageId } = await result.json();
      setProgress(60);

      // Create document record
      const documentId = await createDocument({
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        fileSize: file.size,
        pageCount: 0, // Will be updated after processing
        storageId,
      });

      setProgress(100);

      // Redirect to document page
      setTimeout(() => {
        router.push(`/dashboard/documents/${documentId}`);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Upload PDF</h1>
        <p className="text-slate-600">Upload a PDF to generate an AI summary</p>
      </div>

      <Card className="p-8 max-w-3xl mx-auto">
        <DropZone onFileSelect={setFile} disabled={uploading} />

        {uploading && (
          <div className="mt-8">
            <ProgressBar value={progress} max={100} />
            <p className="text-center text-slate-600 mt-4">Uploading and processing...</p>
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
