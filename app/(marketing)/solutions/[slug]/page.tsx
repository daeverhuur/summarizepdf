import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

async function getPageData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'landing-pages', 'solutions', `${slug}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
              {pageData.hero.headline}
            </h1>
            <p className="text-xl text-slate-600 mb-10">
              {pageData.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={pageData.cta.primary.link}>
                <Button size="lg">
                  {pageData.cta.primary.text}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {pageData.cta.secondary && (
                <Link href={pageData.cta.secondary.link}>
                  <Button variant="outline" size="lg">
                    {pageData.cta.secondary.text}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {pageData.benefits.map((benefit: any, i: number) => (
              <Card key={i} hover className="p-6">
                <Check className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      {pageData.socialProof && pageData.socialProof.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {pageData.socialProof.map((proof: any, i: number) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">&ldquo;{proof.quote}&rdquo;</p>
                  <p className="font-semibold text-slate-900">{proof.author}</p>
                  <p className="text-sm text-slate-600">{proof.role}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {pageData.faq.map((item: any, i: number) => (
                <Card key={i} className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.question}</h3>
                  <p className="text-slate-600">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">
            Ready to get started?
          </h2>
          <Link href={pageData.cta.primary.link}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              {pageData.cta.primary.text}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
