import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:3009', { waitUntil: 'networkidle' });
  
  console.log('\n=== FUNCTIONAL & ACCESSIBILITY TESTS ===\n');
  
  const docElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const has3D = all.filter(el => {
      const transform = window.getComputedStyle(el).transform;
      return transform && transform.includes('matrix3d');
    });
    return has3D.length;
  });
  console.log('[TEST] 3D Transforms:', docElements > 0 ? `FOUND (${docElements})` : 'NOT FOUND');
  
  const animations = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const animated = all.filter(el => {
      const anim = window.getComputedStyle(el).animation;
      return anim && anim !== 'none';
    });
    return animated.length;
  });
  console.log('[TEST] CSS Animations:', animations > 0 ? `YES (${animations})` : 'NO');
  
  const hasDiagonalGradient = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all.some(el => {
      const bg = window.getComputedStyle(el).background;
      return bg && bg.includes('gradient');
    });
  });
  console.log('[TEST] Gradient Effects:', hasDiagonalGradient ? 'FOUND' : 'NOT FOUND');
  
  const ariaCount = await page.evaluate(() => {
    return document.querySelectorAll('[aria-label], [aria-labelledby], [role]').length;
  });
  console.log('[TEST] ARIA Attributes:', ariaCount, 'elements');
  
  const images = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    const withAlt = imgs.filter(img => img.alt && img.alt.trim() !== '');
    return { total: imgs.length, withAlt: withAlt.length };
  });
  console.log('[TEST] Image Alt Text:', `${images.withAlt}/${images.total}`);
  
  const buttons = await page.evaluate(() => {
    return document.querySelectorAll('button, a[href]').length;
  });
  console.log('[TEST] Interactive Elements:', buttons);
  
  const primaryBtn = await page.locator('a:has-text("Start Free"), button:has-text("Start Free")').first();
  if (await primaryBtn.count() > 0) {
    const href = await primaryBtn.getAttribute('href');
    console.log('[TEST] Primary CTA:', href || 'onClick handler');
  }
  
  const perf = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint');
    return {
      fcp: fcp ? Math.round(fcp.startTime) : null,
      domComplete: Math.round(performance.timing.domComplete - performance.timing.navigationStart)
    };
  });
  console.log('[TEST] First Contentful Paint:', perf.fcp + 'ms');
  console.log('[TEST] DOM Complete:', perf.domComplete + 'ms');
  
  await browser.close();
  console.log('\n=== COMPLETE ===\n');
})();
