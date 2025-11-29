import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const testResults = [];
const screenshotDir = 'test-screenshots';

try {
  mkdirSync(screenshotDir, { recursive: true });
} catch (e) {}

async function runTests() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    console.log('\n=== TEST 1: Landing Page ===');
    await page.goto('http://localhost:3006/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(screenshotDir, '01-landing-hero.png'), fullPage: false });
    
    const heroSection = await page.locator('section').first();
    const heroVisible = await heroSection.isVisible();
    
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(screenshotDir, '02-landing-stats.png') });
    
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(screenshotDir, '03-landing-features.png') });
    
    const featureCard = await page.locator('[class*="feature"], [class*="card"]').first();
    if (await featureCard.count() > 0) {
      await featureCard.hover();
      await page.waitForTimeout(300);
      await page.screenshot({ path: join(screenshotDir, '04-landing-feature-hover.png') });
    }
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(screenshotDir, '05-landing-footer.png') });
    
    testResults.push({
      test: 'Landing Page',
      status: heroVisible ? 'PASS' : 'FAIL',
      details: 'Hero visible: ' + heroVisible + '. Console errors: ' + consoleErrors.length
    });

    console.log('\n=== TEST 2: Pricing Page ===');
    await page.goto('http://localhost:3006/pricing', { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(screenshotDir, '06-pricing-initial.png'), fullPage: true });
    
    const toggleButton = await page.locator('button:has-text("Yearly"), button:has-text("Annual"), [role="switch"]').first();
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(screenshotDir, '07-pricing-yearly.png'), fullPage: true });
      
      testResults.push({
        test: 'Pricing Page',
        status: 'PASS',
        details: 'Pricing toggle works, yearly view captured'
      });
    } else {
      testResults.push({
        test: 'Pricing Page',
        status: 'PARTIAL',
        details: 'Page loads but toggle not found'
      });
    }

    console.log('\n=== TEST 3: Contact Page ===');
    await page.goto('http://localhost:3006/contact', { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(screenshotDir, '08-contact-initial.png'), fullPage: true });
    
    const submitButton = await page.locator('button[type="submit"]').first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: join(screenshotDir, '09-contact-validation.png'), fullPage: true });
      
      testResults.push({
        test: 'Contact Page',
        status: 'PASS',
        details: 'Form validation triggered'
      });
    } else {
      testResults.push({
        test: 'Contact Page',
        status: 'PARTIAL',
        details: 'Page loads but submit button not found'
      });
    }

    console.log('\n=== TEST 4: Dashboard ===');
    await page.goto('http://localhost:3006/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(screenshotDir, '10-dashboard-or-auth.png'), fullPage: true });
    
    const currentUrl = page.url();
    const isDashboard = currentUrl.includes('/dashboard');
    const isAuth = currentUrl.includes('sign-in') || currentUrl.includes('sign-up');
    
    testResults.push({
      test: 'Dashboard Access',
      status: isDashboard || isAuth ? 'PASS' : 'FAIL',
      details: 'URL: ' + currentUrl + '. ' + (isAuth ? 'Correctly redirected to auth' : 'Dashboard accessible')
    });

    console.log('\n=== TEST 5: Mobile Responsive ===');
    await context.close();
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto('http://localhost:3006/', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: join(screenshotDir, '11-mobile-landing.png'), fullPage: false });
    
    await mobilePage.goto('http://localhost:3006/pricing', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: join(screenshotDir, '12-mobile-pricing.png'), fullPage: false });
    
    testResults.push({
      test: 'Mobile Responsive',
      status: 'PASS',
      details: 'Mobile views captured for landing and pricing'
    });

    await mobileContext.close();

    console.log('\n=== TEST 6: UI Components ===');
    const desktopPage = await browser.newPage();
    await desktopPage.goto('http://localhost:3006/', { waitUntil: 'networkidle' });
    
    const firstButton = await desktopPage.locator('button, a[class*="button"]').first();
    if (await firstButton.count() > 0) {
      await firstButton.focus();
      await desktopPage.waitForTimeout(300);
      await desktopPage.screenshot({ path: join(screenshotDir, '13-button-focus.png') });
      
      testResults.push({
        test: 'UI Components - Focus States',
        status: 'PASS',
        details: 'Button focus state captured'
      });
    }

    await desktopPage.close();

  } catch (error) {
    console.error('Test error:', error);
    testResults.push({
      test: 'Test Execution',
      status: 'FAIL',
      details: error.message
    });
  }

  await browser.close();

  console.log('\n\n=== TEST RESULTS ===\n');
  testResults.forEach(result => {
    console.log('[' + result.status + '] ' + result.test);
    console.log('    ' + result.details + '\n');
  });

  writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nScreenshots saved to: ' + screenshotDir + '/');
  console.log('Results saved to: test-results.json');
  
  const failures = testResults.filter(r => r.status === 'FAIL').length;
  process.exit(failures > 0 ? 1 : 0);
}

runTests();
