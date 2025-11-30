import { chromium } from 'playwright';
import path from 'path';

const testUrl = 'http://localhost:3001';
const screenshotsDir = path.join(process.cwd(), 'test-screenshots');

async function testFunctional() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  try {
    await page.goto(testUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('Testing CTA Button Hover...');
    const startFreeBtn = await page.locator('button:has-text("Start Free"), a:has-text("Start Free")').first();
    await startFreeBtn.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, 'hero-cta-hover-state.png') });
    console.log('✓ CTA hover captured');
    
    console.log('\nTesting Watch Demo Button...');
    const watchDemoBtn = await page.locator('button:has-text("Watch Demo"), a:has-text("Watch Demo")').first();
    await watchDemoBtn.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, 'hero-demo-button-hover.png') });
    console.log('✓ Demo button hover captured');
    
    console.log('\nChecking Trust Signals...');
    const trustSignals = await page.locator('text=/No credit card|5 free PDFs|Secure/i').count();
    console.log(`✓ Found ${trustSignals} trust signals`);
    
    console.log('\nChecking Product Demo Elements...');
    const demoElements = {
      uploadZone: await page.locator('text=/Drop PDF Here/i').isVisible(),
      keyFindings: await page.locator('text=/Key Findings/i').isVisible(),
      summaryPreview: await page.locator('text=/Summary Preview/i').isVisible(),
      chatReady: await page.locator('text=/Chat Ready/i').isVisible()
    };
    console.log('Product Demo Elements:', demoElements);
    
    console.log('\nTesting Gradient Effect...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'hero-gradient-check.png'),
      fullPage: false
    });
    console.log('✓ Gradient screenshot captured');
    
    console.log('\nAll functional tests completed successfully!');
    
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testFunctional().catch(console.error);
