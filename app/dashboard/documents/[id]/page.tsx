'use client';

import { use, useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Download,
  Share2,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { KeyInsightsPanel } from '@/components/document/KeyInsightsPanel';
import { SummaryViewer } from '@/components/document/SummaryViewer';
import { QuickChat } from '@/components/document/QuickChat';
import { DocumentStats } from '@/components/document/DocumentStats';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const document = useQuery(api.documents.get, { documentId: id as Id<'documents'> });
  const summaries = useQuery(api.summaries.listByDocument, { documentId: id as Id<'documents'> });
  const summary = summaries && summaries.length > 0 ? summaries[0] : null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'bullet' | 'paragraph' | 'detailed'>('paragraph');
  const [selectedLength, setSelectedLength] = useState<'short' | 'medium' | 'detailed'>('medium');

  const generateSummary = useAction(api.ai.summarize.generateSummary);

  if (document === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#00d4ff] animate-spin" />
      </div>
    );
  }

  if (document === null) {
    notFound();
  }

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      await generateSummary({
        documentId: id as Id<'documents'>,
        format: selectedFormat,
        length: selectedLength,
      });
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate word count from extracted text
  const wordCount = document.extractedText?.reduce((acc: number, page: any) => {
    return acc + (page.content?.split(/\s+/).length || 0);
  }, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard/documents"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Documents</span>
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              {document.title}
            </h1>
            <DocumentStats
              pageCount={document.pageCount}
              fileSize={document.fileSize}
              createdAt={document.createdAt}
              status={document.status}
              wordCount={wordCount}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Processing / Error States */}
      {document.status === 'processing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#009de0]/10 border border-[#009de0]/30 rounded-2xl p-8 text-center mb-8"
        >
          <Loader2 className="w-12 h-12 text-[#00d4ff] mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Processing Document</h2>
          <p className="text-slate-600">Extracting text and preparing your document...</p>
        </motion.div>
      )}

      {document.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center mb-8"
        >
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-300 mb-2">Processing Error</h2>
          <p className="text-red-400/80">{document.errorMessage || 'An error occurred while processing your document.'}</p>
        </motion.div>
      )}

      {/* Main Content */}
      {document.status === 'ready' && (
        <>
          {/* Key Insights */}
          {summary?.keyInsights && summary.keyInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <KeyInsightsPanel insights={summary.keyInsights as any} />
            </motion.div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              {summary ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">Document Summary</h2>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <SummaryViewer
                    content={summary.content}
                    sections={summary.sections as any}
                    format={summary.format}
                  />

                  {/* Summary metadata */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span>Generated with {summary.model || 'AI'}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{summary.tokensUsed?.toLocaleString() || 0} tokens used</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{new Date(summary.createdAt).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#009de0]/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-[#00d4ff]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                    Generate AI Summary
                  </h2>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Get instant insights from your document with AI-powered summarization.
                    Choose your preferred format and detail level.
                  </p>

                  {/* Format Selection */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Summary Format
                    </label>
                    <div className="flex justify-center gap-2">
                      {(['bullet', 'paragraph', 'detailed'] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => setSelectedFormat(format)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedFormat === format
                              ? 'bg-[#009de0] text-white shadow-lg shadow-[#009de0]/20'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Length Selection */}
                  <div className="mb-8">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Summary Length
                    </label>
                    <div className="flex justify-center gap-2">
                      {(['short', 'medium', 'detailed'] as const).map((length) => (
                        <button
                          key={length}
                          onClick={() => setSelectedLength(length)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedLength === length
                              ? 'bg-[#009de0] text-white shadow-lg shadow-[#009de0]/20'
                              : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {length.charAt(0).toUpperCase() + length.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Summary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Right Column - Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <QuickChat
                documentId={id as Id<'documents'>}
                suggestedQuestions={summary?.suggestedQuestions as string[] | undefined}
              />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
