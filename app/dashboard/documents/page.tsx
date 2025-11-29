'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { FileText, Upload as UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PdfPagePreview } from '@/components/document/PdfPagePreview';
import { Doc } from '@/convex/_generated/dataModel';

export default function DocumentsPage() {
  const documents = useQuery(api.documents.list, {}) as
    | Doc<'documents'>[]
    | undefined;
  const isLoading = documents === undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Documents</h1>
          <p className="text-slate-600">All your summarized PDFs in one place</p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload PDF</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex flex-col gap-3 p-4 animate-pulse">
              <div
                className="bg-slate-200 rounded-lg"
                style={{
                  aspectRatio: '3 / 4',
                  maxHeight: '240px',
                }}
              />
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 rounded flex-1"></div>
                  <div className="h-8 bg-slate-200 rounded flex-1"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <Link key={doc._id} href={`/dashboard/documents/${doc._id}`}>
              <Card hover className="group flex flex-col gap-3 p-4 transition-all hover:shadow-xl">
                <div
                  className="relative overflow-hidden rounded-lg"
                  style={{
                    aspectRatio: '3 / 4',
                    maxHeight: '240px',
                  }}
                >
                  <PdfPagePreview
                    storageId={doc.storageId}
                    title={doc.title}
                    className="h-full w-full transition-transform group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-white/80">
                    <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur">
                      {doc.pageCount} pages
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 backdrop-blur text-xs ${
                        doc.status === 'ready'
                          ? 'bg-emerald-500/30 text-emerald-100'
                          : doc.status === 'processing'
                            ? 'bg-amber-500/30 text-amber-100'
                            : doc.status === 'error'
                              ? 'bg-rose-500/30 text-rose-100'
                              : 'bg-slate-500/30 text-slate-100'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  {/* Action buttons on hover */}
                  <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="text-xs px-3 py-1.5 bg-white/90 backdrop-blur flex-1">
                      View Summary
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs px-3 py-1.5 bg-white/90 backdrop-blur flex-1">
                      Chat
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(doc._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center">
          <div className="inline-flex p-4 bg-gradient-to-br from-[#009de0]/10 to-[#00d4ff]/10 rounded-2xl mb-4">
            <UploadIcon className="w-20 h-20 text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Upload your first PDF to get started with AI-powered summaries
          </p>
          <Link href="/dashboard/upload">
            <Button variant="glow" size="lg">Upload Your First PDF</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
