import { MarketingDetailPage, MarketingPageContent } from '@/components/marketing/MarketingDetailPage';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

async function getPageData(slug: string): Promise<MarketingPageContent | null> {
  try {
    const filePath = path.join(process.cwd(), 'landing-pages', 'features', `${slug}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

interface PageProps {
  params: { slug: string };
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = params;
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  return <MarketingDetailPage pageData={pageData} />;
}
