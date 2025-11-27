'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { FileText, TrendingUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrentUser);
  const documents = useQuery(api.documents.list, {});

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-slate-600">Here&apos;s what&apos;s happening with your documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900">{documents?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Summaries Created</p>
              <p className="text-2xl font-bold text-slate-900">{documents?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-xl">
              <MessageSquare className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Chat Messages</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Documents</h2>
          <Link href="/dashboard/upload">
            <Button>Upload PDF</Button>
          </Link>
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {documents.map((doc: any) => (
              <Link key={doc._id} href={`/dashboard/documents/${doc._id}`}>
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                    <p className="text-sm text-slate-600">
                      {doc.pageCount} pages • {new Date(doc._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No documents yet</p>
            <Link href="/dashboard/upload">
              <Button>Upload Your First PDF</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
