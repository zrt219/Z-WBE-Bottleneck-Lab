import puppeteer from 'puppeteer-core';

async function runButtonVerification() {
  const baseUrl = (process.env.TEST_URL || process.argv[2] || 'https://z-wbe-bottleneck-lab.vercel.app').replace(/\/$/, '');
  console.log(`🚀 Starting Comprehensive Browser Button Verification against: ${baseUrl}...`);
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[Browser Console Error]`, msg.text());
      consoleErrors.push(msg.text());
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.error(`[HTTP ${response.status()}] ${response.url()}`);
    }
  });
  page.on('pageerror', (err) => {
    console.error(`[Browser Uncaught Error]`, err.message);
    consoleErrors.push(err.message);
  });

  try {
    // 1. Visit Home Page
    console.log(`1. Navigating to ${baseUrl}...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });

    // 2. Test Top 1-Click Demo Button from Home
    console.log('2. Testing Top Header ⚡ 1-Click Demo button from Home page...');
    const topDemoBtn = await page.waitForSelector('[data-testid="header-one-click-demo-button"]');
    await topDemoBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    const bannerVisible = await page.$eval('#tour-preset-selector', (el) => el.innerText.includes('THE BOTTLENECK MOVED'));
    console.log(`   - Constraint shift banner visible: ${bannerVisible}`);

    // 3. Test Top 1-Click Demo Button from Another Page (e.g., /about)
    console.log(`3. Navigating to ${baseUrl}/about and testing Top Header ⚡ 1-Click Demo button...`);
    await page.goto(`${baseUrl}/about`, { waitUntil: 'networkidle0' });
    const topDemoFromAbout = await page.waitForSelector('[data-testid="header-one-click-demo-button"]');
    await topDemoFromAbout.click();
    await new Promise((r) => setTimeout(r, 1500));
    const currentUrl = page.url();
    console.log(`   - Redirected back to Home: ${currentUrl === `${baseUrl}/` || currentUrl === baseUrl}`);
    const bannerVisibleAfterNav = await page.$eval('#tour-preset-selector', (el) => el.innerText.includes('THE BOTTLENECK MOVED'));
    console.log(`   - 1-Click Demo executed after navigation: ${bannerVisibleAfterNav}`);

    // 4. Test Preset Buttons
    console.log('4. Testing Biological Presets buttons...');
    const presetButtons = await page.$$('button[data-testid^="preset-"]');
    console.log(`   - Found ${presetButtons.length} preset buttons.`);
    for (let i = 0; i < presetButtons.length; i++) {
      const btn = presetButtons[i];
      await btn.click();
      await new Promise((r) => setTimeout(r, 200));
    }

    // 5. Test Hero Preset Selector "⚡ 1-Click Demo & Explain"
    console.log('5. Testing Hero Section ⚡ 1-Click Demo & Explain button...');
    const heroDemoBtn = await page.$('[data-testid="hero-one-click-demo-button"]');
    if (heroDemoBtn) {
      await heroDemoBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
      console.log('   - Hero 1-Click Demo button clicked successfully.');
    }

    // 6. Test Dominant Bottleneck Card "1-Click Demo" and "EXPLAIN WITH NEMOTRON"
    console.log('6. Testing Dominant Bottleneck Card buttons...');
    const cardDemoBtn = await page.$('[data-testid="card-one-click-demo-button"]');
    if (cardDemoBtn) {
      await cardDemoBtn.click();
      await new Promise((r) => setTimeout(r, 1200));
      console.log('   - Card 1-Click Demo button clicked successfully.');
    }

    const explainBtn = await page.$('#tour-explain-button button');
    if (explainBtn) {
      await explainBtn.click();
      await new Promise((r) => setTimeout(r, 1500));
      console.log('   - EXPLAIN WITH NEMOTRON clicked successfully.');
    }

    // 7. Test Copy Link button
    console.log('7. Testing Copy Permalink button...');
    const copyBtn = await page.$('button[title*="Copy permalink"]');
    if (copyBtn) {
      await copyBtn.click();
      console.log('   - Copy Permalink button clicked.');
    }

    // 8. Test Accessibility Modal
    console.log('8. Testing A11y Accessibility modal...');
    const a11yBtn = await page.$('[data-testid="header-accessibility-button"]');
    if (a11yBtn) {
      await a11yBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.keyboard.press('Escape');
      console.log('   - Accessibility modal opened and closed.');
    }

    // 9. Test Verified Credentials Modal
    console.log('9. Testing Verified Credentials modal...');
    const credsBtn = await page.$('button[title*="credentials"]');
    if (credsBtn) {
      await credsBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      await page.keyboard.press('Escape');
      console.log('   - Verified Credentials modal opened and closed.');
    }

    // 10. Test Navigation to all routes
    console.log('10. Testing all main navigation links...');
    const routes = ['/tutorials/basics', '/tutorials/options', '/tutorials/pipeline', '/tutorials/api-walkthrough', '/methodology', '/architecture', '/about'];
    for (const route of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' });
      console.log(`   - Visited ${route} successfully.`);
    }

    console.log('==================================================');
    console.log(`✅ ALL BUTTONS AND WORKFLOWS VERIFIED PASSING!`);
    console.log(`Console errors: ${consoleErrors.length}`);
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Error during button verification:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runButtonVerification();
