/**
 * scripts/generate_60s_tutorial_walkthrough.cjs
 * Dedicated 60-Second Full Interactive Tutorial Suite Walkthrough
 * 
 * Flow (Total: ~61.0s = 610 frames @ 10fps base, 60fps MP4 & optimized GIF):
 * 1. [0:00 - 0:15] Scene 1: Guided Tour on Simulator (Steps 1 to 5)
 * 2. [0:15 - 0:27] Scene 2: Module 1 - Foundations & Amdahl's Law Sandbox (/tutorials/basics)
 * 3. [0:27 - 0:39] Scene 3: Module 2 - Simulator Options & Controls Guide (/tutorials/options)
 * 4. [0:39 - 0:50] Scene 4: Module 3 - 6 Pipeline Stages Deep-Dive (/tutorials/pipeline)
 * 5. [0:50 - 1:01] Scene 5: Module 4 - Live API Console & Nemotron Grounding (/tutorials/api-walkthrough)
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
  console.log('=== STARTING 60-SECOND DEDICATED TUTORIAL WALKTHROUGH GENERATOR ===');

  const tempFramesDir = path.join(__dirname, 'temp_tutorial_frames');
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
  // SCENE 1: GUIDED INTERACTIVE TOUR ON SIMULATOR (0s - 15s = 150 frames)
  // =========================================================================
  console.log('[1/5] Scene 1: Guided Interactive Tour on Simulator...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tourBtn = btns.find(b => b.innerText.includes('Guided Tour'));
    if (tourBtn) tourBtn.click();
  });
  await capture(30, 60); // 3.0s: Step 1 Core Concept & Amdahl's Law

  // Advance step 2
  await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(30, 60); // 3.0s: Step 2 Biological Scales

  // Advance step 3
  await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(30, 60); // 3.0s: Step 3 Independent Variable Controls

  // Advance step 4
  await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(30, 60); // 3.0s: Step 4 6 Pipeline Stages

  // Advance step 5
  await page.evaluate(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await capture(30, 60); // 3.0s: Step 5 Nemotron API Call

  // Close tour
  await page.evaluate(() => {
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === 'Close tutorial' || b.innerText.includes('Close') || b.innerText.includes('Skip'));
    if (closeBtn) closeBtn.click();
  });

  // =========================================================================
  // SCENE 2: MODULE 1 - BASICS & AMDAHL'S LAW SANDBOX (15s - 27s = 120 frames)
  // =========================================================================
  console.log('[2/5] Scene 2: Module 1 - Foundations & Amdahl\'s Law Sandbox...');
  await page.goto(`${URL}/tutorials/basics`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s: Foundations header & context

  // Scroll to interactive sandbox
  await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'instant' }));
  await capture(45, 60); // 4.5s: Amdahl's law sandbox & sliders

  // Scroll further down to biophysics & bottlenecks
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await capture(45, 60); // 4.5s: Key Takeaways & Amdahl curve

  // =========================================================================
  // SCENE 3: MODULE 2 - SIMULATOR OPTIONS & PARAMETER PHYSICS (27s - 39s = 120 frames)
  // =========================================================================
  console.log('[3/5] Scene 3: Module 2 - Simulator Options & Control Physics...');
  await page.goto(`${URL}/tutorials/options`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s: 25+ parameters overview

  // Switch domain tabs
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'instant' }));
  await capture(45, 60); // 4.5s: Acquisition & Reconstruction physics

  // Mini-sandbox
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await capture(45, 60); // 4.5s: Interactive parameter mini-sandbox

  // =========================================================================
  // SCENE 4: MODULE 3 - 6 PIPELINE STAGES DEEP-DIVE (39s - 50s = 110 frames)
  // =========================================================================
  console.log('[4/5] Scene 4: Module 3 - 6 Pipeline Stages Deep-Dive...');
  await page.goto(`${URL}/tutorials/pipeline`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s: Pipeline overview & stage map

  await page.evaluate(() => window.scrollBy({ top: 480, behavior: 'instant' }));
  await capture(40, 60); // 4.0s: Preservation & Acquisition baselines

  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'instant' }));
  await capture(40, 60); // 4.0s: Reconstruction, Functionalization & Validation

  // =========================================================================
  // SCENE 5: MODULE 4 - LIVE API CONSOLE & NEMOTRON GROUNDING (50s - 61s = 110 frames)
  // =========================================================================
  console.log('[5/5] Scene 5: Module 4 - Live API Console & Nemotron Grounding...');
  await page.goto(`${URL}/tutorials/api-walkthrough`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3.0s: API Walkthrough header & preset selector

  // Scroll to interactive inspection tabs
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'instant' }));
  await capture(40, 60); // 4.0s: Formatted Nemotron response & schema

  // Scroll to JSON Request & Response view
  await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'instant' }));
  await capture(40, 60); // 4.0s: Live telemetry & contract verification

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
  console.log('Encoding Silky-Smooth 60fps 61-Second Tutorial Walkthrough MP4 (1080p)...');
  const outMp4 = path.join(SUBMISSION_RECORDINGS, '60s_tutorial_complete_walkthrough.mp4');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -r 60 -c:v libx264 -pix_fmt yuv420p -b:v 2800k -maxrate 4000k -bufsize 6000k "${outMp4}"`, { stdio: 'ignore' });

  // =========================================================================
  // ENCODING 2: 61-SECOND SOCIAL-COMPLIANT GIF (< 10MB)
  // =========================================================================
  console.log('Encoding 61-Second Optimized Animated Tutorial GIF (600w, 8fps, max_colors=64, < 10MB)...');
  const outGif = path.join(SUBMISSION_RECORDINGS, '60s_tutorial_complete_walkthrough.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -vf "fps=8,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${outGif}"`, { stdio: 'ignore' });

  // Distribute to public targets
  const targets = [PUBLIC_RECORDINGS, ROOT_PUBLIC_RECORDINGS, MASTER_POST_DIR];
  targets.forEach(dir => {
    fs.copyFileSync(outMp4, path.join(dir, '60s_tutorial_complete_walkthrough.mp4'));
    fs.copyFileSync(outGif, path.join(dir, '60s_tutorial_complete_walkthrough.gif'));
  });

  const mp4Size = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  const gifSize = (fs.statSync(outGif).size / (1024 * 1024)).toFixed(2);

  console.log(`\n🎉 SUCCESS! 61-second 60fps Tutorial Walkthrough assets generated:`);
  console.log(`- MP4 (60fps, 61s, 1080p): ${outMp4} (${mp4Size} MB)`);
  console.log(`- GIF (8fps, 61s, 600w): ${outGif} (${gifSize} MB)`);

  // Clean temp frames
  try {
    const fms = fs.readdirSync(tempFramesDir);
    for (const f of fms) fs.unlinkSync(path.join(tempFramesDir, f));
    fs.rmdirSync(tempFramesDir);
  } catch (e) {}

  console.log('Dedicated Tutorial Walkthrough Generation Complete!');
}

run().catch(err => {
  console.error('Fatal error generating tutorial demo:', err);
  process.exit(1);
});
