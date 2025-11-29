'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PdfPagePreview } from '@/components/document/PdfPagePreview';
import { Doc } from '@/convex/_generated/dataModel';

export default function DocumentsPage() {
  const documents = useQuery(api.documents.list, {}) as
    | Doc<'documents'>[]
    | undefined;

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

      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Link key={doc._id} href={`/dashboard/documents/${doc._id}`}>
              <Card hover className="flex flex-col gap-3 p-4">
                <div
                  className="relative"
                  style={{
                    aspectRatio: '3 / 4',
                    maxHeight: '240px',
                  }}
                >
                  <PdfPagePreview
                    storageId={doc.storageId}
                    title={doc.title}
                    className="h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-white/80">
                    <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur">
                      {doc.pageCount} pages
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 backdrop-blur ${
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs px-3 py-1.5">
                      View Summary
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs px-3 py-1.5">
                      Chat
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-600 mb-6">Upload your first PDF to get started</p>
          <Link href="/dashboard/upload">
            <Button>Upload PDF</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
