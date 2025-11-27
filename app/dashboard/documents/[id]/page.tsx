'use client';

import { use } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, MessageSquare, Download } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const document = useQuery(api.documents.get, { documentId: id as Id<'documents'> });
  const summaries = useQuery(api.summaries.listByDocument, { documentId: id as Id<'documents'> });
  const summary = summaries && summaries.length > 0 ? summaries[0] : null;

  if (document === undefined) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{document.title}</h1>
            <p className="text-slate-600">
              {document.pageCount} pages • Uploaded {new Date(document._creationTime).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/documents/${id}/chat`}>
              <Button variant="outline">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="w-5 h-5 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Summary</h2>

            {summary ? (
              <div className="prose max-w-none">
                <div className="mb-6 whitespace-pre-wrap text-slate-700">
                  {summary.content}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Generating summary...</p>
              </div>
            )}
          </Card>
        </div>

        {/* Document Info */}
        <div>
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Document Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Pages</p>
                <p className="font-semibold text-slate-900">{document.pageCount}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <p className="font-semibold text-slate-900">{document.status}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Created</p>
                <p className="font-semibold text-slate-900">
                  {new Date(document._creationTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
