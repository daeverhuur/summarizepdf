const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const landingPagesDir = path.join(projectRoot, 'landing-pages');
const appDir = path.join(projectRoot, 'app', '(marketing)');

// Template for landing page component
const landingPageTemplate = (data) => `'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ${data.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Page() {
  const pageData = ${JSON.stringify(data, null, 2)};

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-violet-50 to-cyan-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6"
            >
              {pageData.hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 mb-10"
            >
              {pageData.hero.subheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
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
            </motion.div>
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
            {pageData.benefits.map((benefit, i) => (
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
              {pageData.socialProof.map((proof, i) => (
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
              {pageData.faq.map((item, i) => (
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
`;

// Generate landing pages
const categories = ['features', 'use-cases', 'industries', 'vs', 'solutions'];
let totalPages = 0;

categories.forEach(category => {
  const categoryDir = path.join(landingPagesDir, category);
  if (!fs.existsSync(categoryDir)) return;

  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const jsonPath = path.join(categoryDir, file);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const pageDir = path.join(appDir, category, '[slug]');
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }

    const pageContent = landingPageTemplate(data);
    const pagePath = path.join(pageDir, 'page.tsx');

    // Only write if it doesn't exist yet
    if (!fs.existsSync(pagePath)) {
      fs.writeFileSync(pagePath, pageContent);
      console.log(`Created: ${category}/[slug]/page.tsx`);
      totalPages++;
    }
  });
});

// Generate generateStaticParams for each category
categories.forEach(category => {
  const categoryDir = path.join(landingPagesDir, category);
  if (!fs.existsSync(categoryDir)) return;

  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
  const slugs = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(categoryDir, f), 'utf8'));
    return data.slug;
  });

  const paramsPath = path.join(appDir, category, '[slug]', 'generate-static-params.ts');
  const paramsContent = `export async function generateStaticParams() {
  return ${JSON.stringify(slugs.map(slug => ({ slug })), null, 2)};
}
`;
  fs.writeFileSync(paramsPath, paramsContent);
  console.log(`Created: ${category}/[slug]/generate-static-params.ts`);
});

console.log(`\nTotal pages created: ${totalPages}`);
console.log('Landing page generation complete!');
