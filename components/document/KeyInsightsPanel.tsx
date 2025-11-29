'use client';

import { Lightbulb, TrendingUp, AlertTriangle, BarChart3, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeyInsight {
  text: string;
  type: 'finding' | 'recommendation' | 'warning' | 'statistic' | 'conclusion';
}

interface KeyInsightsPanelProps {
  insights: KeyInsight[];
}

const insightConfig = {
  finding: {
    icon: Lightbulb,
    color: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    iconColor: 'text-amber-400',
    label: 'Finding',
  },
  recommendation: {
    icon: TrendingUp,
    color: 'bg-[#009de0]/10 border-[#009de0]/30 text-[#00d4ff]',
    iconColor: 'text-[#00d4ff]',
    label: 'Recommendation',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-red-500/10 border-red-500/30 text-red-300',
    iconColor: 'text-red-400',
    label: 'Warning',
  },
  statistic: {
    icon: BarChart3,
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    iconColor: 'text-purple-400',
    label: 'Statistic',
  },
  conclusion: {
    icon: CheckCircle,
    color: 'bg-green-500/10 border-green-500/30 text-green-300',
    iconColor: 'text-green-400',
    label: 'Conclusion',
  },
};

export function KeyInsightsPanel({ insights }: KeyInsightsPanelProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        Key Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const config = insightConfig[insight.type] || insightConfig.finding;
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${config.color} backdrop-blur-sm transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-slate-100 ${config.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                    {config.label}
                  </span>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-900">
                    {insight.text}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
