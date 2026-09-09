/**
 * scripts/generate_full_app_60s_demo.cjs
 * Comprehensive 65-Second, 1080p, 60fps Master Walkthrough Video & Optimized GIF
 *
 * Flow:
 * 1. [0:00 - 0:14] Scene 1: Signature Hero Bottleneck Shift (/)
 *    - Baseline: Preset 1 (Imaging Wall / Acquisition dominant constraint @ 3125% load)
 *    - Trigger 100x Imaging Breakthrough Demo
 *    - Instantaneous collapse of Acquisition Wall -> shift to Memory Bandwidth Wall
 *    - WBE Pipeline Map stage pressures, Sensitivity Sliders, Nemotron 3 Super, 100k GPU map
 * 2. [0:14 - 0:19] Scene 2: In-App Guided Tour (/)
 *    - Interactive spotlight walkthrough overlay across core concepts and biological presets
 * 3. [0:19 - 0:35] Scene 3: Interactive Tutorials (/tutorials/*)
 *    - Module 1: Basics & Amdahl's Law interactive sandbox with speedup sliders
 *    - Module 2: Simulator Options explorer & mini-sandbox
 *    - Module 3: 6-Stage WBE Pipeline breakdown
 *    - Module 4: Nemotron Grounding Schema & Live API Console
 * 4. [0:35 - 0:41] Scene 4: Methodology (/methodology)
 *    - 12 formal deterministic scaling equations & physics derivations
 * 5. [0:41 - 0:47] Scene 5: System Architecture (/architecture)
 *    - Full-stack architecture, strict epistemic separation, Cloud Run container & BigQuery Sandbox
 * 6. [0:47 - 0:53] Scene 6: Google Colab T4 GPU Lab Workflow
 *    - Tesla T4 runtime, %load_ext cudf.pandas, 8.62x measured benchmark speedup with cuDF & XGBoost
 * 7. [0:53 - 1:05] Scene 7: Grand Finale - About Page & Official Verified Credentials Modal (/about)
 *    - Official Google Cloud & NVIDIA Developer Community Badges (ID: 110918189625880989910)
 *    - Open "View Full Badge Showcase" Verified Credentials modal
 *    - Scroll to showcase the 4 completed Google Cloud x NVIDIA Golden Ticket learning cards:
 *      1. Deploy Faster GenAI Models with NVIDIA NIM on GKE
 *      2. Speed Up Data Analytics on GPUs
 *      3. Accelerated Machine Learning with Google Cloud and NVIDIA
 *      4. Intro to Inference: How to Run AI Models on a GPU
 *
 * Output targets:
 * - 1080p 60fps MP4 (1920x1080)
 * - Social-compliant animated GIF (< 15MB)
 * - Saved to master-launch-post/, public/images/, public/recordings/, submission-kit/, frontend/public/
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://z-wbe-bottleneck-lab.vercel.app';

// Target destination directories
const SUBMISSION_RECORDINGS = path.join(__dirname, '..', 'submission-kit', 'recordings');
const PUBLIC_RECORDINGS = path.join(__dirname, '..', 'frontend', 'public', 'recordings');
const ROOT_PUBLIC_RECORDINGS = path.join(__dirname, '..', 'public', 'recordings');
const MASTER_POST_DIR = path.join(__dirname, '..', 'master-launch-post');
const PUBLIC_IMAGES = path.join(__dirname, '..', 'public', 'images');
const FRONTEND_PUBLIC_IMAGES = path.join(__dirname, '..', 'frontend', 'public', 'images');
const DIST_RECORDINGS = path.join(__dirname, '..', 'dist', 'recordings');
const FRONTEND_DIST_RECORDINGS = path.join(__dirname, '..', 'frontend', 'dist', 'recordings');

const ALL_DIRS = [
  SUBMISSION_RECORDINGS,
  PUBLIC_RECORDINGS,
  ROOT_PUBLIC_RECORDINGS,
  MASTER_POST_DIR,
  PUBLIC_IMAGES,
  FRONTEND_PUBLIC_IMAGES,
  DIST_RECORDINGS,
  FRONTEND_DIST_RECORDINGS
];

ALL_DIRS.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function run() {
  console.log('=== STARTING 1080P 60FPS EXTENDED HERO BOTTLENECK & FULL-APP DEMO GENERATOR ===');

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
  // SCENE 1: SIGNATURE HERO BOTTLENECK SHIFT (0s - 14s = ~140 frames at 10fps)
  // =========================================================================
  console.log('\n[1/7] Scene 1: Signature Hero Bottleneck Shift (/)...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 800));

  // Baseline: Preset 1 - Imaging Wall
  console.log('   Activating Preset 1: Imaging Wall baseline...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Preset 1: Imaging Wall') || b.innerText.includes('Imaging Wall'));
    if (p1) p1.click();
  });
  await capture(25, 60); // 2.5s: Baseline Acquisition Wall (Red/amber wall alert @ 3125% load)

  // 1-Click Breakthrough Demo (100x shift)
  console.log('   Triggering 1-Click 100x Breakthrough Demo...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const shift = btns.find(b => b.innerText.includes('1-Click Demo') || b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS ONLY'));
    if (shift) shift.click();
  });
  await capture(35, 60); // 3.5s: Instantaneous collapse of Acquisition Wall and shift to Memory Bandwidth Wall!

  // Smooth scroll down to WBE Pipeline Map & Dominant Bottleneck
  console.log('   Scrolling to WBE Pipeline Map & Dominant Bottleneck...');
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Canonical stage pressures & dominant constraint badge

  // Sensitivity Sliders
  console.log('   Scrolling to Sensitivity Sliders & Parameter Controls...');
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Independent variable sliders

  // Grounded Nemotron 120B AI Synthesis
  console.log('   Scrolling to Grounded NVIDIA Nemotron 3 Super AI Synthesis...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && e.innerText.includes('NVIDIA Nemotron 3 Super') && e.innerText.includes('AI INTERPRETATION')
    );
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await capture(25, 60); // 2.5s: Causal reasoning & strict epistemic grounding contract

  // 100k GPU Exploration Map
  console.log('   Scrolling to 100k GPU Exploration Map...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && (e.innerText.includes('100,000') || e.innerText.includes('GPU Exploration Map'))
    );
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await capture(20, 60); // 2.0s: BigQuery 100k scenario sweep heatmap

  // =========================================================================
  // SCENE 2: IN-APP GUIDED TOUR (14s - 19s = ~50 frames at 10fps)
  // =========================================================================
  console.log('\n[2/7] Scene 2: In-App Interactive Guided Tour overlay...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tourBtn = btns.find(b => b.innerText.includes('Guided Tour') || b.innerText.includes('Start Walkthrough'));
    if (tourBtn) tourBtn.click();
  });
  await capture(25, 60); // 2.5s: Step 1 Core Concept Spotlight

  // Advance to next tour step
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(25, 60); // 2.5s: Step 2 Biological Scale Presets Spotlight

  // Close tour
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Close tutorial' || b.innerText.includes('Skip') || b.innerText.includes('Close'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // =========================================================================
  // SCENE 3: INTERACTIVE TUTORIALS (19s - 35s = ~160 frames at 10fps)
  // =========================================================================
  console.log('\n[3/7] Scene 3: Interactive Tutorials (/tutorials/basics, options, pipeline, api-walkthrough)...');
  
  // 3a. Basics & Amdahl's Law Sandbox
  console.log('   Navigating to /tutorials/basics (Amdahl\'s Law Module)...');
  await page.goto(`${URL}/tutorials/basics`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Amdahl's law sandbox sliders & speedup curves

  // 3b. Options Guide & Mini-Sandbox
  console.log('   Navigating to /tutorials/options (Simulator Options)...');
  await page.goto(`${URL}/tutorials/options`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Domain tabs & mini-sandbox

  // 3c. 6-Stage Pipeline
  console.log('   Navigating to /tutorials/pipeline (6 Pipeline Stages)...');
  await page.goto(`${URL}/tutorials/pipeline`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Pipeline stages & EM baselines

  // 3d. API Walkthrough Console
  console.log('   Navigating to /tutorials/api-walkthrough (Nemotron Grounding Schema)...');
  await page.goto(`${URL}/tutorials/api-walkthrough`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
  await capture(20, 60); // 2.0s: Nemotron Grounding Schema & Live Console

  // =========================================================================
  // SCENE 4: METHODOLOGY & 12 EQUATIONS (35s - 41s = ~60 frames at 10fps)
  // =========================================================================
  console.log('\n[4/7] Scene 4: Methodology & Physical Equations (/methodology)...');
  await page.goto(`${URL}/methodology`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s
  await page.evaluate(() => window.scrollBy({ top: 550, behavior: 'smooth' }));
  await capture(30, 60); // 3.0s: 12 equations & derivations

  // =========================================================================
  // SCENE 5: SYSTEM ARCHITECTURE (41s - 47s = ~60 frames at 10fps)
  // =========================================================================
  console.log('\n[5/7] Scene 5: System Architecture (/architecture)...');
  await page.goto(`${URL}/architecture`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
  await capture(30, 60); // 3.0s: Cloud Run, OpenRouter Nemotron & Grounding contracts

  // =========================================================================
  // SCENE 6: GOOGLE COLAB T4 GPU WORKFLOW (47s - 53s = ~60 frames at 10fps)
  // =========================================================================
  console.log('\n[6/7] Scene 6: Google Colab T4 GPU Workflow (cudf.pandas 8.62x speedup)...');
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
  // SCENE 7: GRAND FINALE - ABOUT PAGE & VERIFIED CREDENTIALS MODAL (53s - 65s)
  // =========================================================================
  console.log('\n[7/7] Scene 7: Grand Finale - About Page & Verified Certificates Modal (/about)...');
  await page.goto(`${URL}/about`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(20, 60); // 2.0s: Hero banner & GTC 2026 challenge header

  // Scroll to verified badges section & 4 pathways on the page
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h2, h3, div')).find(e => 
      e.innerText && e.innerText.includes('Completed Learning Pathways & Architectural Lineage')
    );
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollBy({ top: 480, behavior: 'smooth' });
  });
  await capture(25, 60); // 2.5s: 4/4 Google Cloud x NVIDIA badges & pathway cards on page

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

  // Modal top view: Header + Official Credentials banner + Badges screenshot
  await capture(20, 60); // 2.0s

  // Smooth scroll inside modal to showcase the 4 Golden Ticket learning cards
  console.log('   Scrolling inside modal to showcase the 4 Golden Ticket learning cards...');
  await page.evaluate(() => {
    const modalBody = document.querySelector('[role="dialog"] .overflow-y-auto');
    if (modalBody) modalBody.scrollBy({ top: 380, behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Hold steadily on the 4 Golden Ticket learning cards:
  // 1. Deploy Faster GenAI Models with NVIDIA NIM on GKE
  // 2. Speed Up Data Analytics on GPUs
  // 3. Accelerated ML with Google Cloud & NVIDIA
  // 4. Intro to Inference: How to Run AI Models on a GPU
  console.log('   Showcasing the 4 Golden Ticket learning cards...');
  await capture(50, 60); // 5.0s

  await browser.close();
  console.log(`\nBrowser capture complete! Total base frames: ${frameCount}.`);

  // Target exactly 650 base frames (65.0 seconds at 10 fps)
  const targetBaseFrames = 650;
  if (frameCount < targetBaseFrames) {
    const lastFrame = path.join(tempFramesDir, `frame_${String(frameCount - 1).padStart(5, '0')}.png`);
    while (frameCount < targetBaseFrames) {
      const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      fs.copyFileSync(lastFrame, dest);
    }
  }

  console.log(`Total sequence normalized to exactly ${frameCount} frames (${(frameCount / 10).toFixed(1)} seconds).`);

  // =========================================================================
  // ENCODING 1: FULL 60 FPS 1080P MP4 (Interpolated to 60fps)
  // =========================================================================
  console.log('\nEncoding Silky-Smooth 1080p 60fps Full Walkthrough MP4 (1920x1080)...');
  const outMp4 = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.mp4');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -r 60 -c:v libx264 -pix_fmt yuv420p -b:v 3200k -maxrate 4500k -bufsize 6000k "${outMp4}"`, { stdio: 'ignore' });

  // =========================================================================
  // ENCODING 2: SOCIAL-COMPLIANT OPTIMIZED GIF (< 15MB)
  // =========================================================================
  console.log('\nEncoding Optimized Animated GIF (600w, 8fps, max_colors=64, < 15MB)...');
  const outGif = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -vf "fps=8,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${outGif}"`, { stdio: 'ignore' });

  // =========================================================================
  // DISTRIBUTION: Mirror MP4 & GIF to all requested public and master folders
  // =========================================================================
  console.log('\nDistributing master video and animation across project directories...');

  // Also create hero_bottleneck_shift named files
  const heroMp4 = path.join(SUBMISSION_RECORDINGS, 'hero_bottleneck_shift.mp4');
  fs.copyFileSync(outMp4, heroMp4);

  // 1. master-launch-post/
  fs.copyFileSync(outMp4, path.join(MASTER_POST_DIR, '60s_full_workflow_walkthrough.mp4'));
  fs.copyFileSync(outGif, path.join(MASTER_POST_DIR, '60s_full_workflow_walkthrough.gif'));
  fs.copyFileSync(outMp4, path.join(MASTER_POST_DIR, '02_hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outGif, path.join(MASTER_POST_DIR, '02_hero_bottleneck_shift.gif'));

  // 2. public/images/
  fs.copyFileSync(outMp4, path.join(PUBLIC_IMAGES, '02_hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outMp4, path.join(PUBLIC_IMAGES, '60s_full_workflow_walkthrough.mp4'));
  fs.copyFileSync(outGif, path.join(PUBLIC_IMAGES, '02_hero_bottleneck_shift.gif'));

  // 3. frontend/public/images/
  if (fs.existsSync(FRONTEND_PUBLIC_IMAGES)) {
    fs.copyFileSync(outMp4, path.join(FRONTEND_PUBLIC_IMAGES, '02_hero_bottleneck_shift.mp4'));
    fs.copyFileSync(outMp4, path.join(FRONTEND_PUBLIC_IMAGES, '60s_full_workflow_walkthrough.mp4'));
    fs.copyFileSync(outGif, path.join(FRONTEND_PUBLIC_IMAGES, '02_hero_bottleneck_shift.gif'));
  }

  // 4. public/recordings/
  fs.copyFileSync(outMp4, path.join(ROOT_PUBLIC_RECORDINGS, '60s_full_workflow_walkthrough.mp4'));
  fs.copyFileSync(outGif, path.join(ROOT_PUBLIC_RECORDINGS, '60s_full_workflow_walkthrough.gif'));
  fs.copyFileSync(outMp4, path.join(ROOT_PUBLIC_RECORDINGS, '02_hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outMp4, path.join(ROOT_PUBLIC_RECORDINGS, 'hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outGif, path.join(ROOT_PUBLIC_RECORDINGS, 'hero_bottleneck_shift.gif'));

  // 5. frontend/public/recordings/
  fs.copyFileSync(outMp4, path.join(PUBLIC_RECORDINGS, '60s_full_workflow_walkthrough.mp4'));
  fs.copyFileSync(outGif, path.join(PUBLIC_RECORDINGS, '60s_full_workflow_walkthrough.gif'));
  fs.copyFileSync(outMp4, path.join(PUBLIC_RECORDINGS, '02_hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outMp4, path.join(PUBLIC_RECORDINGS, 'hero_bottleneck_shift.mp4'));
  fs.copyFileSync(outGif, path.join(PUBLIC_RECORDINGS, 'hero_bottleneck_shift.gif'));

  // 6. dist/recordings/ & frontend/dist/recordings/
  [DIST_RECORDINGS, FRONTEND_DIST_RECORDINGS].forEach(d => {
    if (fs.existsSync(d)) {
      fs.copyFileSync(outMp4, path.join(d, '60s_full_workflow_walkthrough.mp4'));
      fs.copyFileSync(outGif, path.join(d, '60s_full_workflow_walkthrough.gif'));
      fs.copyFileSync(outMp4, path.join(d, '02_hero_bottleneck_shift.mp4'));
      fs.copyFileSync(outMp4, path.join(d, 'hero_bottleneck_shift.mp4'));
      fs.copyFileSync(outGif, path.join(d, 'hero_bottleneck_shift.gif'));
    }
  });

  const mp4Size = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  const gifSize = (fs.statSync(outGif).size / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 SUCCESS! Extended 1080p 60fps walkthrough video generated:`);
  console.log(`- MP4 (1080p, 60fps, 65s): ${outMp4} (${mp4Size} MB)`);
  console.log(`- GIF (65s, <15MB): ${outGif} (${gifSize} MB)`);
  console.log(`- Saved as 02_hero_bottleneck_shift.mp4 and 60s_full_workflow_walkthrough.mp4 in master-launch-post/`);
  console.log(`- Mirrored to public/images/, public/recordings/, frontend/public/, and submission-kit/`);

  // Clean temp frames
  try {
    const fms = fs.readdirSync(tempFramesDir);
    for (const f of fms) fs.unlinkSync(path.join(tempFramesDir, f));
    fs.rmdirSync(tempFramesDir);
  } catch (e) {}

  console.log('\nAll generation, encoding, and distribution complete!');
}

run().catch(err => {
  console.error('Fatal error generating full app demo:', err);
  process.exit(1);
});
