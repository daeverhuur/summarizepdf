import { MetadataRoute } from 'next';
import * as fs from 'fs';
import * as path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://summarizepdf.com';

  const routes = [
    '',
    '/pricing',
    '/sign-in',
    '/sign-up',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add landing pages
  const landingPagesDir = path.join(process.cwd(), 'landing-pages');
  const categories = ['features', 'use-cases', 'industries', 'vs', 'solutions'];

  const landingPages: MetadataRoute.Sitemap = [];

  categories.forEach((category) => {
    const categoryDir = path.join(landingPagesDir, category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));
      files.forEach((file) => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(categoryDir, file), 'utf8'));
          if (data.slug) {
            landingPages.push({
              url: `${baseUrl}/${category}/${data.slug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        } catch (error) {
          console.error(`Skipping invalid JSON in ${category}/${file}:`, error);
        }
      });
    }
  });

  return [...routes, ...landingPages];
}
