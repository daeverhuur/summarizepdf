import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Check, Star } from 'lucide-react';

export type MarketingPageContent = {
  hero: {
    headline: string;
    subheadline: string;
  };
  cta?: {
    primary?: { text: string; link: string };
    secondary?: { text: string; link: string };
  };
  benefits: Array<{ title: string; description: string }>;
  socialProof?: Array<{ quote: string; author: string; role: string }>;
  faq?: Array<{ question: string; answer: string }>;
};

type Props = {
  pageData: MarketingPageContent;
};

export function MarketingDetailPage({ pageData }: Props) {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#009de0]/15 blur-[170px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#7c3aed]/15 blur-[140px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <p className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-100 text-sm text-slate-600 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff]" />
            Powered by SummarizePDF
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
            {pageData.hero.headline}
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            {pageData.hero.subheadline}
          </p>
          {pageData.cta?.primary && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={pageData.cta.primary.link}>
                <Button size="lg">
                  {pageData.cta.primary.text}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              {pageData.cta.secondary && (
                <Link href={pageData.cta.secondary.link}>
                  <Button size="lg" variant="secondary">
                    {pageData.cta.secondary.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
        <div className="container-custom relative z-10">
          <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pageData.benefits.map((benefit, i) => (
              <Card key={benefit.title + i} variant="glass" hover className="p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-[#009de0]/20 border border-slate-200 flex items-center justify-center mb-5">
                  <Check className="w-6 h-6 text-[#00d4ff]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {pageData.socialProof && pageData.socialProof.length > 0 && (
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100 to-transparent opacity-60" />
          <div className="container-custom relative z-10">
            <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
              Loved by teams everywhere
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pageData.socialProof.map((proof, i) => (
                <Card key={proof.author + i} variant="glass" className="p-8 h-full flex flex-col">
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="w-5 h-5" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-800 mb-4 flex-1">&ldquo;{proof.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-slate-900">{proof.author}</p>
                    <p className="text-sm text-slate-600">{proof.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-10 relative">
          <div className="container-custom">
            <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {pageData.faq.map((item, i) => (
                <Card key={item.question + i} variant="glass" className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-[#009de0]/20 via-transparent to-transparent blur-[160px]" />
        </div>
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Get started today</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Ready to experience AI-native document workflows?
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Join thousands of professionals using SummarizePDF to understand complex PDFs in seconds.
          </p>
          {pageData.cta?.primary && (
            <Link href={pageData.cta.primary.link}>
              <Button size="lg" className="min-w-[220px]">
                {pageData.cta.primary.text}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
