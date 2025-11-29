const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to home page
  await page.goto('http://localhost:3004', { waitUntil: 'networkidle' });
  
  // Screenshot 1: Hero section (top of page - should be dark)
  await page.screenshot({ path: 'hero-dark.png', fullPage: false });
  console.log('✓ Hero section screenshot taken');
  
  // Scroll to stats section (should still be dark)
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'stats-section.png', fullPage: false });
  console.log('✓ Stats section screenshot taken');
  
  // Scroll to features section (should be light)
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'features-light.png', fullPage: false });
  console.log('✓ Features section screenshot taken');
  
  // Scroll back to top to check hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  // Check hero background color
  const heroColor = await page.evaluate(() => {
    const hero = document.querySelector('[data-section="hero"]') || document.querySelector('section:first-of-type');
    if (hero) {
      return window.getComputedStyle(hero).backgroundColor;
    }
    return 'not found';
  });
  console.log(`Hero background color: ${heroColor}`);
  
  // Check header text color when at top
  const headerTextColor = await page.evaluate(() => {
    const header = document.querySelector('header');
    if (header) {
      return window.getComputedStyle(header).color;
    }
    return 'not found';
  });
  console.log(`Header text color (at top): ${headerTextColor}`);
  
  await browser.close();
  console.log('\n✓ Theme transition test complete');
})();
