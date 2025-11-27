'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DocumentsPage() {
  const documents = useQuery(api.documents.list, {});

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {documents.map((doc: any) => (
            <Link key={doc._id} href={`/dashboard/documents/${doc._id}`}>
              <Card hover className="p-6">
                <FileText className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="font-bold text-slate-900 text-lg mb-2">{doc.title}</h3>
                <p className="text-sm text-slate-600 mb-4">
                  {doc.pageCount} pages • {new Date(doc._creationTime).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Summary</Button>
                  <Button size="sm" variant="ghost">Chat</Button>
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
