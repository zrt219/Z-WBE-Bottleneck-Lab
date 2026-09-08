/**
 * scripts/generate_full_app_60s_demo.cjs
 * Comprehensive 60-Second, 60fps End-to-End Walkthrough
 * 
 * Flow (Total: ~61.0s = 610 frames @ 10fps base, rendered at 60fps MP4 & optimized GIF):
 * 1. [0:00 - 0:13] Scene 1: Main Simulator Lab (/) - 1-Click 100x Breakthrough, Sliders, Nemotron, GPU map.
 * 2. [0:13 - 0:18] Scene 2: In-App Guided Tour (/) - Spotlight overlay across core concepts.
 * 3. [0:18 - 0:34] Scene 3: Interactive Tutorials (/tutorials/*) - Basics, Options, Pipeline, API Walkthrough.
 * 4. [0:34 - 0:40] Scene 4: Methodology (/methodology) - 12 deterministic equations & physics derivations.
 * 5. [0:40 - 0:46] Scene 5: System Architecture (/architecture) - Full-stack architecture & Cloud Run.
 * 6. [0:46 - 0:52] Scene 6: Google Colab T4 GPU Workflow - nvidia-smi, cudf.pandas, 8.62x benchmark.
 * 7. [0:52 - 1:01] Scene 7: Grand Finale - About Page (/about) - Official 4/4 Google Cloud x NVIDIA credentials modal!
 *
 * Output:
 * - 60-Second 60fps MP4 (1080p)
 * - 60-Second Social-Compliant Animated GIF (< 10MB)
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://z-wbe-bottleneck-lab.vercel.app';

const SUBMISSION_RECORDINGS = path.join(__dirname, '..', 'submission-kit', 'recordings');
const PUBLIC_RECORDINGS = path.join(__dirname, '..', 'frontend', 'public', 'recordings');
const ROOT_PUBLIC_RECORDINGS = path.join(__dirname, '..', 'public', 'recordings');
const MASTER_POST_DIR = path.join(__dirname, '..', 'master-launch-post');

[SUBMISSION_RECORDINGS, PUBLIC_RECORDINGS, ROOT_PUBLIC_RECORDINGS, MASTER_POST_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function run() {
  console.log('=== STARTING 60-SECOND 60FPS FULL-APP & CERTIFICATES DEMO GENERATOR ===');

  const tempFramesDir = path.join(__dirname, 'temp_app_frames');
  if (fs.existsSync(tempFramesDir)) {
    try {
      const existing = fs.readdirSync(tempFramesDir);
      for (const f of existing) fs.unlinkSync(path.join(tempFramesDir, f));
      fs.rmdirSync(tempFramesDir);
    } catch (e) {}
  }
  fs.mkdirSync(tempFramesDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  let frameCount = 0;
  async function capture(nFrames, delayMs = 60) {
    for (let i = 0; i < nFrames; i++) {
      const fPath = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      await page.screenshot({ path: fPath });
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  // =========================================================================
  // SCENE 1: MAIN SIMULATOR LAB (0s - 13s = ~130 frames at 10fps)
  // =========================================================================
  console.log('[1/7] Scene 1: Main Simulator Lab (Preset 1, 100x Shift, Sliders, Nemotron, GPU Map)...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // Baseline Preset 1: Imaging Wall
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Preset 1: Imaging Wall') || b.innerText.includes('Imaging Wall'));
    if (p1) p1.click();
  });
  await capture(25, 60); // 2.5s

  // 1-Click Breakthrough Demo (100x shift)
  console.log('   Triggering 1-Click 100x Breakthrough Demo...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const shift = btns.find(b => b.innerText.includes('1-Click Demo') || b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS ONLY'));
    if (shift) shift.click();
  });
  await capture(35, 60); // 3.5s

  // Sensitivity Sliders
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'instant' }));
  await capture(25, 60); // 2.5s

  // Grounded Nemotron 120B AI Synthesis
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && e.innerText.includes('NVIDIA Nemotron 3 Super') && e.innerText.includes('AI INTERPRETATION')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await capture(25, 60); // 2.5s

  // 100k GPU Exploration Map
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && (e.innerText.includes('100,000') || e.innerText.includes('GPU Exploration Map'))
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await capture(20, 60); // 2.0s

  // =========================================================================
  // SCENE 2: IN-APP GUIDED TOUR (13s - 18s = ~50 frames at 10fps)
  // =========================================================================
  console.log('[2/7] Scene 2: In-App Interactive Tour overlay...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tourBtn = btns.find(b => b.innerText.includes('Guided Tour'));
    if (tourBtn) tourBtn.click();
  });
  await capture(25, 60); // 2.5s: Step 1 Core Concept

  // Advance to next tour step
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(25, 60); // 2.5s: Step 2 Biological Scale Presets

  // Close tour
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Close tutorial' || b.innerText.includes('Skip') || b.innerText.includes('Close'));
    if (closeBtn) closeBtn.click();
  });

  // =========================================================================
  // SCENE 3: INTERACTIVE TUTORIALS (18s - 34s = ~160 frames at 10fps)
  // =========================================================================
  console.log('[3/7] Scene 3: Interactive Tutorials (/tutorials/basics, options, pipeline, api-walkthrough)...');
  
  // 3a. Basics & Amdahl's Law Sandbox
  console.log('   Navigating to /tutorials/basics...');
  await page.goto(`${URL}/tutorials/basics`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await capture(20, 60); // 2.0s (Amdahl's law sandbox sliders)

  // 3b. Options Guide & Mini-Sandbox
  console.log('   Navigating to /tutorials/options...');
  await page.goto(`${URL}/tutorials/options`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await capture(20, 60); // 2.0s (Domain tabs & mini-sandbox)

  // 3c. 6-Stage Pipeline
  console.log('   Navigating to /tutorials/pipeline...');
  await page.goto(`${URL}/tutorials/pipeline`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await capture(20, 60); // 2.0s (Pipeline stages & EM baselines)

  // 3d. API Walkthrough Console
  console.log('   Navigating to /tutorials/api-walkthrough...');
  await page.goto(`${URL}/tutorials/api-walkthrough`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'instant' }));
  await capture(20, 60); // 2.0s (Nemotron Grounding Schema & Live Console)

  // =========================================================================
  // SCENE 4: METHODOLOGY & 12 EQUATIONS (34s - 40s = ~60 frames at 10fps)
  // =========================================================================
  console.log('[4/7] Scene 4: Methodology & Physical Equations (/methodology)...');
  await page.goto(`${URL}/methodology`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'instant' }));
  await capture(30, 60); // 3.0s (12 equations & derivations)

  // =========================================================================
  // SCENE 5: SYSTEM ARCHITECTURE (40s - 46s = ~60 frames at 10fps)
  // =========================================================================
  console.log('[5/7] Scene 5: System Architecture (/architecture)...');
  await page.goto(`${URL}/architecture`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await capture(30, 60); // 3.0s (Cloud Run, OpenRouter Nemotron & Grounding contracts)

  // =========================================================================
  // SCENE 6: GOOGLE COLAB T4 GPU WORKFLOW (46s - 52s = ~60 frames at 10fps)
  // =========================================================================
  console.log('[6/7] Scene 6: Google Colab T4 GPU Workflow (cudf.pandas 8.62x speedup)...');
  const colabTempDir = path.join(__dirname, 'temp_colab_frames_60s');
  if (fs.existsSync(colabTempDir)) {
    try {
      const cExisting = fs.readdirSync(colabTempDir);
      for (const f of cExisting) fs.unlinkSync(path.join(colabTempDir, f));
      fs.rmdirSync(colabTempDir);
    } catch (e) {}
  }
  fs.mkdirSync(colabTempDir, { recursive: true });

  const colabVideo = path.join(__dirname, '..', 'public', 'colab-evidence', 'colab_t4_live_demo.mp4');
  execSync(`ffmpeg -y -i "${colabVideo}" -vf "fps=10,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${colabTempDir}/colab_%04d.png"`, { stdio: 'ignore' });
  const colabFiles = fs.readdirSync(colabTempDir).filter(f => f.endsWith('.png')).sort();
  
  // Select 60 frames from Colab (6.0 seconds)
  const colabStride = Math.max(1, Math.floor(colabFiles.length / 60));
  let colabCount = 0;
  for (let i = 0; i < colabFiles.length && colabCount < 60; i += colabStride) {
    const src = path.join(colabTempDir, colabFiles[i]);
    const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
    fs.copyFileSync(src, dest);
    colabCount++;
  }
  try {
    for (const f of colabFiles) fs.unlinkSync(path.join(colabTempDir, f));
    fs.rmdirSync(colabTempDir);
  } catch (e) {}
  console.log(`   Appended ${colabCount} Colab GPU workflow frames.`);

  // =========================================================================
  // SCENE 7: GRAND FINALE - ABOUT PAGE & VERIFIED CREDENTIALS (52s - 61s)
  // =========================================================================
  console.log('[7/7] Scene 7: Grand Finale - About Page & Verified Certificates Modal (/about)...');
  await page.goto(`${URL}/about`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(25, 60); // 2.5s: Hero banner & GTC 2026 header

  // Scroll to verified badges section & 4 pathways
  await page.evaluate(() => {
    window.scrollBy({ top: 480, behavior: 'instant' });
  });
  await capture(25, 60); // 2.5s: 4/4 Google Cloud x NVIDIA badges & pathway cards

  // Click "View Full Badge Showcase" modal button
  console.log('   Clicking "View Full Badge Showcase" button to open Official Credentials Modal...');
  const clickedModal = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const modalBtn = btns.find(b => 
      b.innerText.includes('View Full Badge Showcase') ||
      b.innerText.includes('Inspect Verified Developer Credentials') ||
      b.innerText.includes('VERIFIED CREDENTIALS')
    );
    if (modalBtn) {
      modalBtn.click();
      return true;
    }
    return false;
  });
  console.log(`   Modal button clicked: ${clickedModal}`);
  await new Promise(r => setTimeout(r, 600));

  // Modal Showcase (40 frames = 4.0s) showcasing the official 4/4 credentials
  await capture(40, 60);

  await browser.close();
  console.log(`Browser capture complete! Total base frames: ${frameCount}.`);

  // Target exactly 610 base frames (61.0 seconds at 10 fps)
  const targetBaseFrames = 610;
  if (frameCount < targetBaseFrames) {
    const lastFrame = path.join(tempFramesDir, `frame_${String(frameCount - 1).padStart(5, '0')}.png`);
    while (frameCount < targetBaseFrames) {
      const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      fs.copyFileSync(lastFrame, dest);
    }
  }

  console.log(`Total sequence normalized to exactly ${frameCount} frames (61.0 seconds).`);

  // =========================================================================
  // ENCODING 1: FULL 60 FPS 1080P MP4 (Interpolated to 60fps)
  // =========================================================================
  console.log('Encoding Silky-Smooth 60fps 61-Second Full Walkthrough MP4 (1080p)...');
  const outMp4 = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.mp4');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -r 60 -c:v libx264 -pix_fmt yuv420p -b:v 2800k -maxrate 4000k -bufsize 6000k "${outMp4}"`, { stdio: 'ignore' });

  // =========================================================================
  // ENCODING 2: 61-SECOND SOCIAL-COMPLIANT GIF (< 10MB)
  // =========================================================================
  console.log('Encoding 61-Second Optimized Animated GIF (600w, 8fps, max_colors=64, < 10MB)...');
  const outGif = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -vf "fps=8,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${outGif}"`, { stdio: 'ignore' });

  // Distribute to public targets
  const targets = [PUBLIC_RECORDINGS, ROOT_PUBLIC_RECORDINGS, MASTER_POST_DIR];
  targets.forEach(dir => {
    fs.copyFileSync(outMp4, path.join(dir, '60s_full_workflow_walkthrough.mp4'));
    fs.copyFileSync(outGif, path.join(dir, '60s_full_workflow_walkthrough.gif'));
  });

  const mp4Size = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  const gifSize = (fs.statSync(outGif).size / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 SUCCESS! 60-second 60fps assets generated:`);
  console.log(`- MP4 (60fps, 60s): ${outMp4} (${mp4Size} MB)`);
  console.log(`- GIF (60s, <10MB): ${outGif} (${gifSize} MB)`);

  // Clean temp frames
  try {
    const fms = fs.readdirSync(tempFramesDir);
    for (const f of fms) fs.unlinkSync(path.join(tempFramesDir, f));
    fs.rmdirSync(tempFramesDir);
  } catch (e) {}

  console.log('All done!');
}

run().catch(err => {
  console.error('Fatal error generating full app demo:', err);
  process.exit(1);
});
