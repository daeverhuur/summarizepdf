'use client';

import { FileText, Clock, Calendar, Hash } from 'lucide-react';

interface DocumentStatsProps {
  pageCount: number;
  fileSize: number;
  createdAt: number;
  status: string;
  wordCount?: number;
}

export function DocumentStats({
  pageCount,
  fileSize,
  createdAt,
  status,
  wordCount,
}: DocumentStatsProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Estimate reading time (200 words per minute average)
  const estimatedReadingTime = wordCount ? Math.ceil(wordCount / 200) : Math.ceil(pageCount * 1.5);

  const stats = [
    {
      label: 'Pages',
      value: pageCount,
      icon: FileText,
    },
    {
      label: 'Reading time',
      value: `${estimatedReadingTime} min`,
      icon: Clock,
    },
    {
      label: 'Size',
      value: formatFileSize(fileSize),
      icon: Hash,
    },
    {
      label: 'Uploaded',
      value: formatDate(createdAt),
      icon: Calendar,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2">
          <stat.icon className="w-4 h-4 text-white/40" />
          <span>
            <span className="font-medium text-white">{stat.value}</span>{' '}
            <span className="text-white/60">{stat.label}</span>
          </span>
        </div>
      ))}

      {/* Status badge */}
      <div
        className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
          status === 'ready'
            ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30'
            : status === 'processing'
            ? 'bg-[#009de0]/10 text-[#009de0] border-[#009de0]/30'
            : status === 'error'
            ? 'bg-red-500/10 text-red-400 border-red-500/30'
            : 'bg-white/10 text-white/80 border-white/20'
        }`}
      >
        {status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : status === 'error' ? 'Error' : 'Uploading'}
      </div>
    </div>
  );
}
