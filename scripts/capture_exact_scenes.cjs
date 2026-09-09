/**
 * scripts/capture_exact_scenes.cjs
 * Captures pixel-perfect full 1080p base states for the 7 master scenes:
 * 1. Breakthrough (Baseline & Shifted)
 * 2. Deterministic Engine (Controls & Calculated values)
 * 3. Nemotron 3 Super (AI Interpretation & Epistemic Boundary)
 * 4. Research Proof (Methodology, Architecture, and Colab T4)
 * 5. BigQuery Analytics (100k Scenario Exploration Map)
 * 6. Open System (GitHub / Architecture / Reproducibility)
 * 7. Credentials (4 Golden Ticket Learning Cards Modal)
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://z-wbe-bottleneck-lab.vercel.app';
const OUT_DIR = path.join(__dirname, 'master_scenes_raw');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function captureScenes() {
  console.log('=== CAPTURING EXACT 7 SCENES FOR MASTER DEMO ===');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  // ----------------------------------------------------
  // SCENE 1: BREAKTHROUGH BASELINE & SHIFTED
  // ----------------------------------------------------
  console.log('[1/7] Capturing Scene 1: Breakthrough Baseline (Preset 1: Imaging Wall)...');
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // Dismiss guided tour toast if present so it doesn't clutter
  await page.evaluate(() => {
    const dismiss = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Dismiss'));
    if (dismiss) dismiss.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Click Preset 1: Imaging Wall
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Preset 1: Imaging Wall') || b.innerText.includes('Imaging Wall'));
    if (p1) p1.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Find exact position of the 100x button
  const heroBtnInfo = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS')
    );
    if (!btn) return null;
    const r = btn.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: r.width, height: r.height };
  });
  console.log('   Hero button location:', heroBtnInfo);

  await page.screenshot({ path: path.join(OUT_DIR, 'scene1_baseline.png') });

  // Now trigger the 100x Breakthrough shift
  console.log('   Triggering 100x Breakthrough action...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS')
    );
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Find position of THE BOTTLENECK MOVED banner and Dominant Bottleneck card
  const shiftInfo = await page.evaluate(() => {
    const banner = Array.from(document.querySelectorAll('div, h2, h3, span')).find(el => 
      el.innerText && el.innerText.includes('BOTTLENECK MOVED')
    );
    const dominant = Array.from(document.querySelectorAll('div, section')).find(el => 
      el.innerText && el.innerText.includes('DOMINANT BOTTLENECK')
    );
    return {
      banner: banner ? banner.getBoundingClientRect() : null,
      dominant: dominant ? dominant.getBoundingClientRect() : null
    };
  });
  console.log('   Shift elements detected:', shiftInfo);

  await page.screenshot({ path: path.join(OUT_DIR, 'scene1_shifted.png') });

  // ----------------------------------------------------
  // SCENE 2: DETERMINISTIC ENGINE (Controls & Calculated values)
  // ----------------------------------------------------
  console.log('[2/7] Capturing Scene 2: Deterministic Engine (Controls & Metrics)...');
  await page.evaluate(() => {
    const el = document.querySelector('section[aria-label="Scope and Parameter Assumptions"]') || 
               Array.from(document.querySelectorAll('section')).find(s => s.innerText && s.innerText.includes('SCENARIO ASSUMPTIONS'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 750, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene2_controls.png') });

  // Also capture calculated values and pipeline map
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('section')).find(s => s.innerText && s.innerText.includes('CALCULATED OUTPUT METRICS'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollBy({ top: 600, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene2_metrics.png') });

  // ----------------------------------------------------
  // SCENE 3: NEMOTRON (AI Interpretation & Label Boundary)
  // ----------------------------------------------------
  console.log('[3/7] Capturing Scene 3: Nemotron AI Interpretation & Epistemic Boundary...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && e.innerText.includes('NVIDIA Nemotron 3 Super') && e.innerText.includes('AI INTERPRETATION')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo({ top: 3400, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene3_nemotron.png') });

  // ----------------------------------------------------
  // SCENE 4: RESEARCH PROOF (Methodology & Architecture)
  // ----------------------------------------------------
  console.log('[4/7] Capturing Scene 4: Methodology & Architecture...');
  await page.goto(`${APP_URL}/methodology`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene4_methodology_top.png') });

  await page.evaluate(() => window.scrollBy({ top: 650, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene4_methodology_equations.png') });

  await page.goto(`${APP_URL}/architecture`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene4_architecture_top.png') });

  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene4_architecture_pipeline.png') });

  // ----------------------------------------------------
  // SCENE 5: BIGQUERY (100k-Scenario Analytics)
  // ----------------------------------------------------
  console.log('[5/7] Capturing Scene 5: BigQuery 100k-Scenario Analytics...');
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2, h3')).find(e => 
      e.innerText && e.innerText.includes('Parameter Exploration Map')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo({ top: 3930, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene5_bigquery_top.png') });

  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene5_bigquery_chart.png') });

  // ----------------------------------------------------
  // SCENE 6: OPEN SYSTEM (GitHub / Architecture / Reproducibility)
  // ----------------------------------------------------
  console.log('[6/7] Capturing Scene 6: Open System & Reproducibility...');
  // We can capture the GitHub repository view and Architecture blueprint
  await page.goto(`${APP_URL}/architecture`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene6_open_architecture.png') });

  // ----------------------------------------------------
  // SCENE 7: CREDENTIALS (Four Golden Ticket Learning Cards)
  // ----------------------------------------------------
  console.log('[7/7] Capturing Scene 7: Credentials (Four Golden Ticket Cards)...');
  await page.goto(`${APP_URL}/about`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // Open modal
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => 
      b.innerText.includes('Inspect Verified Developer Credentials') || 
      b.innerText.includes('View Full Badge Showcase')
    );
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Scroll modal body down to showcase the 4 Golden Ticket cards clearly
  await page.evaluate(() => {
    const modalBody = document.querySelector('[role="dialog"] .overflow-y-auto');
    if (modalBody) modalBody.scrollBy({ top: 380, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'scene7_credentials_modal.png') });

  // Save metadata json with coordinates
  const meta = {
    heroBtn: heroBtnInfo,
    shift: shiftInfo
  };
  fs.writeFileSync(path.join(OUT_DIR, 'scene_meta.json'), JSON.stringify(meta, null, 2));

  await browser.close();
  console.log('SUCCESS: All 7 scenes captured to', OUT_DIR);
}

captureScenes().catch(err => {
  console.error('Fatal error capturing scenes:', err);
  process.exit(1);
});
