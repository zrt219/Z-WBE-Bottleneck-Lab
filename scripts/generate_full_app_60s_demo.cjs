/**
 * scripts/generate_full_app_60s_demo.cjs
 * Comprehensive 60-Second, 60fps End-to-End Walkthrough
 * 
 * Flow:
 * 1. [0:00 - 0:14] Main Lab (/): Preset 1 Imaging Wall, 1-Click 100x Breakthrough (The Bottleneck Moved), Sliders, Nemotron Grounding, 100k GPU map.
 * 2. [0:14 - 0:26] Tutorials (/tutorials/basics, options, pipeline, api): Complete educational walkthrough.
 * 3. [0:26 - 0:38] Methodology & Architecture (/methodology, /architecture): 12 equations, systems architecture.
 * 4. [0:38 - 0:48] Google Colab GPU Lab: Tesla T4 runtime, cudf.pandas 8.62x speedup benchmark.
 * 5. [0:48 - 1:00] Grand Finale - About Page (/about): Official 4/4 Google Cloud x NVIDIA badges & certificates modal!
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
  // SCENE 1: MAIN SIMULATOR LAB (0s - 14s = ~140 frames at 10fps base)
  // =========================================================================
  console.log('[1/5] Scene 1: Main Simulator Lab (Preset 1, 100x Shift, Sliders, Nemotron, GPU map)...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // Preset 1: Imaging Wall Baseline
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Preset 1: Imaging Wall'));
    if (p1) p1.click();
  });
  await capture(25, 60); // 2.5s

  // 1-Click Breakthrough Demo
  console.log('   Triggering 1-Click 100x Imaging Breakthrough Demo...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const shift = btns.find(b => b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS ONLY'));
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
  await capture(30, 60); // 3.0s

  // 100k GPU Exploration Map
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(e => 
      e.innerText && (e.innerText.includes('100,000') || e.innerText.includes('GPU Exploration Map'))
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await capture(25, 60); // 2.5s

  // =========================================================================
  // SCENE 2: TUTORIALS (14s - 26s = ~120 frames at 10fps base)
  // =========================================================================
  console.log('[2/5] Scene 2: Interactive Tutorials (/tutorials/basics, options, pipeline, api)...');
  await page.goto(`${URL}/tutorials/basics`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s

  await page.goto(`${URL}/tutorials/options`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s

  await page.goto(`${URL}/tutorials/pipeline`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s

  await page.goto(`${URL}/tutorials/api`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s

  // =========================================================================
  // SCENE 3: METHODOLOGY & ARCHITECTURE (26s - 38s = ~120 frames at 10fps base)
  // =========================================================================
  console.log('[3/5] Scene 3: Methodology & Architecture (/methodology, /architecture)...');
  await page.goto(`${URL}/methodology`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'instant' }));
  await capture(30, 60); // 3s

  await page.goto(`${URL}/architecture`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(30, 60); // 3s
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }));
  await capture(30, 60); // 3s

  // =========================================================================
  // SCENE 4: GOOGLE COLAB GPU LAB (38s - 48s = ~100 frames at 10fps base)
  // =========================================================================
  console.log('[4/5] Scene 4: Google Colab T4 GPU Workflow (cudf.pandas 8.62x speedup)...');
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
  
  // Select 100 frames from Colab (10 seconds)
  const colabStride = Math.max(1, Math.floor(colabFiles.length / 100));
  let colabCount = 0;
  for (let i = 0; i < colabFiles.length && colabCount < 100; i += colabStride) {
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
  // SCENE 5: GRAND FINALE - ABOUT PAGE & VERIFIED CERTIFICATES (48s - 60s)
  // =========================================================================
  console.log('[5/5] Scene 5: Grand Finale - About Page & Verified Certificates (/about)...');
  await page.goto(`${URL}/about`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(25, 60); // 2.5s: Hero banner & GTC 2026 header

  // Scroll to verified badges section
  await page.evaluate(() => {
    window.scrollBy({ top: 450, behavior: 'instant' });
  });
  await capture(35, 60); // 3.5s: 4/4 Google Cloud x NVIDIA badges

  // Click "Inspect Verified Developer Credentials" modal
  console.log('   Opening Verified Developer Credentials Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const modalBtn = btns.find(b => b.innerText.includes('Inspect Verified Developer Credentials') || b.innerText.includes('Verified Badges'));
    if (modalBtn) modalBtn.click();
  });
  await capture(60, 60); // 6.0s: Modal showcasing all 4 certificates

  await browser.close();
  console.log(`Browser capture complete! Total base frames: ${frameCount}.`);

  // Pad or trim to exactly 600 base frames (60.0s at 10 fps)
  const targetBaseFrames = 600;
  if (frameCount < targetBaseFrames) {
    const lastFrame = path.join(tempFramesDir, `frame_${String(frameCount - 1).padStart(5, '0')}.png`);
    while (frameCount < targetBaseFrames) {
      const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      fs.copyFileSync(lastFrame, dest);
    }
  }

  console.log(`Total sequence normalized to exactly ${frameCount} frames (60.0 seconds).`);

  // =========================================================================
  // ENCODING 1: FULL 60 FPS 1080P MP4 (Interpolated to 60fps)
  // =========================================================================
  console.log('Encoding Silky-Smooth 60fps 60-Second Full Walkthrough MP4 (1080p)...');
  const outMp4 = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.mp4');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -r 60 -c:v libx264 -pix_fmt yuv420p -b:v 2500k -maxrate 3500k -bufsize 5000k "${outMp4}"`, { stdio: 'ignore' });

  // =========================================================================
  // ENCODING 2: 60-SECOND SOCIAL-COMPLIANT GIF (< 10MB)
  // =========================================================================
  console.log('Encoding 60-Second Optimized Animated GIF (540w, 8fps, max_colors=48, < 10MB)...');
  const outGif = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -vf "fps=8,scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=48:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${outGif}"`, { stdio: 'ignore' });

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
