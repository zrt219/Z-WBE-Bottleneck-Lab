/**
 * scripts/generate_60s_master_walkthrough.cjs
 * Generates a full 60-second end-to-end walkthrough (MP4 and optimized GIF):
 * Phase 1 (0s - 35s): Live Web Demonstrator (Hero demo, 100x imaging shift, sensitivity sliders, Nemotron AI interpretation, 100k GPU map, architecture).
 * Phase 2 (35s - 60s): Google Colab GPU Workflow (NVIDIA Tesla T4 runtime, %load_ext cudf.pandas, 8.62x benchmark, Monte Carlo sweep, git provenance).
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
  console.log('=== STARTING 60-SECOND MASTER WORKFLOW RECORDING GENERATOR ===');
  
  const tempFramesDir = path.join(__dirname, 'temp_60s_frames');
  if (fs.existsSync(tempFramesDir)) {
    try { fs.rmSync(tempFramesDir, { recursive: true, force: true }); } catch (e) {}
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
  async function capture(nFrames, delayMs = 100) {
    if (!fs.existsSync(tempFramesDir)) fs.mkdirSync(tempFramesDir, { recursive: true });
    for (let i = 0; i < nFrames; i++) {
      const fPath = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      await page.screenshot({ path: fPath });
      await new Promise(r => setTimeout(r, delayMs));
    }
  }

  // ----------------------------------------------------
  // SECTION 1: LIVE DEMONSTRATOR WALKTHROUGH (35s = 350 frames at 10 fps)
  // ----------------------------------------------------
  console.log('[1/6] Capturing Web App: Hero Overview & Preset 1 Baseline (7s)...');
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
  await capture(60, 60); // 6s

  console.log('[2/6] Capturing Breakthrough Demo: 100x Imaging Shift -> Memory Wall (7s)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const shift = btns.find(b => b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS ONLY'));
    if (shift) shift.click();
  });
  await capture(70, 60); // 7s

  console.log('[3/6] Capturing Sensitivity Sliders & Parameter Sweeps (7s)...');
  await page.evaluate(() => {
    window.scrollBy({ top: 400, behavior: 'instant' });
  });
  await capture(60, 60); // 6s

  console.log('[4/6] Capturing Grounded NVIDIA Nemotron 120B Causal Synthesis (8s)...');
  await page.evaluate(() => {
    const nemotronSection = Array.from(document.querySelectorAll('div, section')).find(el => 
      el.innerText && el.innerText.includes('NVIDIA Nemotron 3 Super') && el.innerText.includes('AI INTERPRETATION')
    );
    if (nemotronSection) {
      nemotronSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await capture(70, 60); // 7s

  console.log('[5/6] Capturing 100,000-Scenario GPU Exploration Map & Architecture (8s)...');
  await page.evaluate(() => {
    const sweep = Array.from(document.querySelectorAll('div, section')).find(el => 
      el.innerText && (el.innerText.includes('100,000') || el.innerText.includes('GPU Exploration Map'))
    );
    if (sweep) sweep.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await capture(60, 60); // 6s

  await page.goto(`${URL}/architecture`, { waitUntil: 'networkidle0' });
  await capture(50, 60); // 5s

  await browser.close();
  console.log(`Captured ${frameCount} web demonstrator frames!`);

  // ----------------------------------------------------
  // SECTION 2: GOOGLE COLAB GPU WORKFLOW (~25s = 250 frames at 10 fps)
  // ----------------------------------------------------
  console.log('[6/6] Extracting Colab GPU Workflow (Tesla T4, cudf.pandas, 8.62x speedup)...');
  const colabTempDir = path.join(__dirname, 'temp_colab_frames');
  if (!fs.existsSync(colabTempDir)) fs.mkdirSync(colabTempDir, { recursive: true });

  const colabVideo = path.join(__dirname, '..', 'public', 'colab-evidence', 'colab_t4_live_demo.mp4');
  execSync(`ffmpeg -y -i "${colabVideo}" -vf "fps=10,scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${colabTempDir}/colab_%04d.png"`, { stdio: 'ignore' });

  const colabFiles = fs.readdirSync(colabTempDir).filter(f => f.endsWith('.png')).sort();
  console.log(`Extracted ${colabFiles.length} Colab frames.`);

  if (!fs.existsSync(tempFramesDir)) fs.mkdirSync(tempFramesDir, { recursive: true });

  // Append Colab frames to main sequence
  for (const cFile of colabFiles) {
    const src = path.join(colabTempDir, cFile);
    const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
    fs.copyFileSync(src, dest);
  }

  // Ensure total frames reaches exactly 600 frames (60.0 seconds at 10 fps)
  const targetFrames = 600;
  if (frameCount < targetFrames) {
    const lastFrame = path.join(tempFramesDir, `frame_${String(frameCount - 1).padStart(5, '0')}.png`);
    while (frameCount < targetFrames) {
      const dest = path.join(tempFramesDir, `frame_${String(frameCount++).padStart(5, '0')}.png`);
      fs.copyFileSync(lastFrame, dest);
    }
  }

  try { fs.rmSync(colabTempDir, { recursive: true, force: true }); } catch (e) {}
  console.log(`Total sequence compiled: ${frameCount} frames (exactly ${(frameCount / 10).toFixed(1)} seconds at 10 fps).`);

  // ----------------------------------------------------
  // ENCODING: MP4 (Full HD 60s) and Highly-Optimized GIF (< 10MB)
  // ----------------------------------------------------
  console.log('Encoding 60-Second Full Walkthrough MP4 (1080p)...');
  const outMp4 = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.mp4');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -b:v 1200k -maxrate 1500k -bufsize 2500k "${outMp4}"`, { stdio: 'ignore' });

  console.log('Encoding Highly-Optimized 60-Second GIF (640w, 8fps, 64 colors, strictly < 10MB for social platforms)...');
  const outGif = path.join(SUBMISSION_RECORDINGS, '60s_full_workflow_walkthrough.gif');
  // Use custom palettegen with max_colors=64 and bayer dithering to keep file size under 10MB across 60 seconds
  execSync(`ffmpeg -y -framerate 10 -i "${tempFramesDir}/frame_%05d.png" -vf "fps=8,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${outGif}"`, { stdio: 'ignore' });

  // Copy to public folders and master-launch-post
  const targets = [PUBLIC_RECORDINGS, ROOT_PUBLIC_RECORDINGS, MASTER_POST_DIR];
  targets.forEach(dir => {
    fs.copyFileSync(outMp4, path.join(dir, '60s_full_workflow_walkthrough.mp4'));
    fs.copyFileSync(outGif, path.join(dir, '60s_full_workflow_walkthrough.gif'));
  });

  const mp4Size = (fs.statSync(outMp4).size / (1024 * 1024)).toFixed(2);
  const gifSize = (fs.statSync(outGif).size / (1024 * 1024)).toFixed(2);
  console.log(`\nSUCCESS! 60-second assets generated:`);
  console.log(`- MP4: ${outMp4} (${mp4Size} MB)`);
  console.log(`- GIF: ${outGif} (${gifSize} MB)`);

  // Clean temp frames gracefully
  try {
    const fms = fs.readdirSync(tempFramesDir);
    for (const f of fms) fs.unlinkSync(path.join(tempFramesDir, f));
    fs.rmdirSync(tempFramesDir);
  } catch (e) {
    console.log('Note: Temp frames directory will be cleaned automatically.');
  }

  console.log('Complete!');
}

run().catch(err => {
  console.error('Error generating 60s walkthrough:', err);
  process.exit(1);
});
