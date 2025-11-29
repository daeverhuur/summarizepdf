'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card } from '@/components/ui/Card';
import { FileText, TrendingUp, MessageSquare, ArrowUp, Upload as UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const user = useQuery(api.users.getCurrentUser);
  const documents = useQuery(api.documents.list, {});
  const isLoading = documents === undefined;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-slate-600 text-lg">Here&apos;s what&apos;s happening with your documents</p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <div className="flex items-center gap-4 animate-pulse">
                <div className="p-3 bg-slate-200 rounded-xl w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card hover className="transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#009de0]/20 rounded-xl">
                <FileText className="w-6 h-6 text-[#009de0]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Total Documents</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-900">{documents?.length || 0}</p>
                  {documents && documents.length > 0 && (
                    <span className="flex items-center text-xs text-emerald-600 font-medium mb-1">
                      <ArrowUp className="w-3 h-3" />
                      +{documents.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card hover className="transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00d4ff]/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Summaries Created</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-900">{documents?.length || 0}</p>
                  {documents && documents.length > 0 && (
                    <span className="flex items-center text-xs text-emerald-600 font-medium mb-1">
                      <ArrowUp className="w-3 h-3" />
                      +{documents.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card hover className="transition-shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#7c3aed]/20 rounded-xl">
                <MessageSquare className="w-6 h-6 text-[#a855f7]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Chat Messages</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Documents */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Documents</h2>
          <Link href="/dashboard/upload">
            <Button>Upload PDF</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {documents.map((doc: any) => (
              <Link key={doc._id} href={`/dashboard/documents/${doc._id}`}>
                <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 hover:border-slate-300">
                  <FileText className="w-8 h-8 text-[#009de0]" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{doc.title}</h3>
                    <p className="text-sm text-slate-600">
                      {doc.pageCount} pages • {new Date(doc._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gradient-to-br from-[#009de0]/10 to-[#00d4ff]/10 rounded-2xl mb-4">
              <UploadIcon className="w-20 h-20 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No documents yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Start by uploading your first PDF to generate AI-powered summaries
            </p>
            <Link href="/dashboard/upload">
              <Button variant="glow" size="lg">Upload Your First PDF</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
