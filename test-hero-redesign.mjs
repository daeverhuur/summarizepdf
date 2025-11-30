import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import path from 'path';

const testUrl = 'http://localhost:3001';
const screenshotsDir = path.join(process.cwd(), 'test-screenshots');

async function testHeroRedesign() {
  const browser = await chromium.launch();
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  try {
    // Test 1: Desktop View (1920x1080)
    console.log('Testing Desktop View (1920x1080)...');
    const desktopPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await desktopPage.goto(testUrl, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000);
    
    await desktopPage.screenshot({ 
      path: path.join(screenshotsDir, 'hero-desktop-1920.png'),
      fullPage: false
    });
    
    // Check headline visibility
    const headline = await desktopPage.locator('text=Read Less. Know More.').first();
    const headlineVisible = await headline.isVisible();
    
    // Check CTAs
    const uploadCTA = await desktopPage.locator('text=Upload Your First PDF').first();
    const uploadVisible = await uploadCTA.isVisible();
    
    results.tests.push({
      name: 'Desktop View',
      viewport: '1920x1080',
      headlineVisible,
      uploadCTAVisible: uploadVisible,
      screenshot: 'hero-desktop-1920.png'
    });
    
    await desktopPage.close();

    // Test 2: Tablet View (768px)
    console.log('Testing Tablet View (768px)...');
    const tabletPage = await browser.newPage({ viewport: { width: 768, height: 1024 } });
    await tabletPage.goto(testUrl, { waitUntil: 'networkidle' });
    await tabletPage.waitForTimeout(2000);
    
    await tabletPage.screenshot({ 
      path: path.join(screenshotsDir, 'hero-tablet-768.png'),
      fullPage: false
    });
    
    const tabletHeadline = await tabletPage.locator('text=Read Less. Know More.').first();
    const tabletHeadlineVisible = await tabletHeadline.isVisible();
    
    results.tests.push({
      name: 'Tablet View',
      viewport: '768x1024',
      headlineVisible: tabletHeadlineVisible,
      screenshot: 'hero-tablet-768.png'
    });
    
    await tabletPage.close();

    // Test 3: Mobile View (375px)
    console.log('Testing Mobile View (375px)...');
    const mobilePage = await browser.newPage({ viewport: { width: 375, height: 667 } });
    await mobilePage.goto(testUrl, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000);
    
    await mobilePage.screenshot({ 
      path: path.join(screenshotsDir, 'hero-mobile-375.png'),
      fullPage: true
    });
    
    const mobileHeadline = await mobilePage.locator('text=Read Less. Know More.').first();
    const mobileHeadlineVisible = await mobileHeadline.isVisible();
    
    results.tests.push({
      name: 'Mobile View',
      viewport: '375x667',
      headlineVisible: mobileHeadlineVisible,
      screenshot: 'hero-mobile-375.png'
    });
    
    await mobilePage.close();

    // Test 4: Functional Tests - Desktop
    console.log('Testing Functional Elements...');
    const funcPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await funcPage.goto(testUrl, { waitUntil: 'networkidle' });
    await funcPage.waitForTimeout(2000);
    
    // Test hover state on CTA
    const ctaButton = await funcPage.locator('text=Upload Your First PDF').first();
    await ctaButton.hover();
    await funcPage.waitForTimeout(500);
    
    await funcPage.screenshot({ 
      path: path.join(screenshotsDir, 'hero-cta-hover.png'),
      fullPage: false
    });
    
    // Check if trust signals are visible
    const trustSignals = await funcPage.locator('text=/trusted|secure|enterprise/i').first();
    const trustVisible = await trustSignals.isVisible().catch(() => false);
    
    results.tests.push({
      name: 'Functional Tests',
      ctaHoverable: true,
      trustSignalsVisible: trustVisible,
      screenshot: 'hero-cta-hover.png'
    });
    
    // Test 5: Hero Section Only (Isolated)
    await funcPage.screenshot({ 
      path: path.join(screenshotsDir, 'hero-section-isolated.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 900 }
    });
    
    await funcPage.close();

    // Test 6: Product Demo Card Visibility
    console.log('Testing Product Demo Card...');
    const demoPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await demoPage.goto(testUrl, { waitUntil: 'networkidle' });
    await demoPage.waitForTimeout(2000);
    
    // Look for glass card or demo container
    const demoCard = await demoPage.locator('.glass, [class*="glass"], [class*="demo"]').first();
    const demoVisible = await demoCard.isVisible().catch(() => false);
    
    results.tests.push({
      name: 'Product Demo Card',
      demoCardVisible: demoVisible
    });
    
    await demoPage.close();

  } catch (error) {
    results.error = error.message;
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }

  // Save results
  writeFileSync(
    path.join(process.cwd(), 'hero-test-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n=== TEST RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
}

testHeroRedesign().catch(console.error);
