const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'https://z-wbe-bottleneck-lab.vercel.app';

const SUBMISSION_SCREENSHOTS = path.join(__dirname, '..', 'submission-kit', 'screenshots');
const SUBMISSION_RECORDINGS = path.join(__dirname, '..', 'submission-kit', 'recordings');
const PUBLIC_SCREENSHOTS = path.join(__dirname, '..', 'frontend', 'public', 'screenshots');
const PUBLIC_RECORDINGS = path.join(__dirname, '..', 'frontend', 'public', 'recordings');

[SUBMISSION_SCREENSHOTS, SUBMISSION_RECORDINGS, PUBLIC_SCREENSHOTS, PUBLIC_RECORDINGS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function captureAll() {
  console.log('--- STARTING ASSET CAPTURE & RECORDING SUITE ---');
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

  // ----------------------------------------------------
  // PART 1: 6 JUDGE-GRADE SCREENSHOTS
  // ----------------------------------------------------
  console.log('\n[1/3] Verifying / Capturing 6 Judge-Grade High-Res Screenshots...');

  // Shot 1: Hero Overview (Drosophila baseline)
  console.log('Capturing Shot 1: Hero Overview...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.waitForSelector('header');
  await new Promise(r => setTimeout(r, 1200));
  const shot1 = path.join(SUBMISSION_SCREENSHOTS, '01_hero_overview.png');
  await page.screenshot({ path: shot1 });
  fs.copyFileSync(shot1, path.join(PUBLIC_SCREENSHOTS, '01_hero_overview.png'));

  // Shot 2: Preset 1 - The Imaging Wall Baseline
  console.log('Capturing Shot 2: Preset 1 - Imaging Wall Baseline...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('Preset 1: Imaging Wall'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const shot2 = path.join(SUBMISSION_SCREENSHOTS, '02_imaging_wall_baseline.png');
  await page.screenshot({ path: shot2 });
  fs.copyFileSync(shot2, path.join(PUBLIC_SCREENSHOTS, '02_imaging_wall_baseline.png'));

  // Shot 3: The Breakthrough - "THE BOTTLENECK MOVED"
  console.log('Capturing Shot 3: Bottleneck Moved Transition...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.innerText.includes('1-CLICK DEMO') || btn.innerText.includes('SHIFT PARAMS ONLY'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  const shot3 = path.join(SUBMISSION_SCREENSHOTS, '03_bottleneck_moved_transition.png');
  await page.screenshot({ path: shot3 });
  fs.copyFileSync(shot3, path.join(PUBLIC_SCREENSHOTS, '03_bottleneck_moved_transition.png'));

  // Shot 4: Nemotron Grounded Interpretation
  console.log('Capturing Shot 4: Grounded NVIDIA Nemotron 3 Super Interpretation...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(item => 
      item.innerText && item.innerText.includes('NVIDIA Nemotron 3 Super') && item.innerText.includes('AI INTERPRETATION')
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1000);
  });
  await new Promise(r => setTimeout(r, 1200));
  const shot4 = path.join(SUBMISSION_SCREENSHOTS, '04_nemotron_grounded_interpretation.png');
  await page.screenshot({ path: shot4 });
  fs.copyFileSync(shot4, path.join(PUBLIC_SCREENSHOTS, '04_nemotron_grounded_interpretation.png'));

  // Shot 5: GPU Exploration Map (100k Sweep)
  console.log('Capturing Shot 5: GPU Exploration Map...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div, section')).find(item =>
      (item.innerText && item.innerText.includes('GPU Exploration Map')) || (item.innerText && item.innerText.includes('100,000'))
    );
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    else window.scrollTo(0, 2200);
  });
  await new Promise(r => setTimeout(r, 1200));
  const shot5 = path.join(SUBMISSION_SCREENSHOTS, '05_gpu_exploration_map.png');
  await page.screenshot({ path: shot5 });
  fs.copyFileSync(shot5, path.join(PUBLIC_SCREENSHOTS, '05_gpu_exploration_map.png'));

  // Shot 6: Architecture & Epistemic Separation View
  console.log('Capturing Shot 6: Architecture Page...');
  await page.goto(`${URL}/architecture`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  const shot6 = path.join(SUBMISSION_SCREENSHOTS, '06_architecture_evidence_view.png');
  await page.screenshot({ path: shot6 });
  fs.copyFileSync(shot6, path.join(PUBLIC_SCREENSHOTS, '06_architecture_evidence_view.png'));

  console.log('All 6 high-res screenshots verified and saved!');

  // ----------------------------------------------------
  // PART 2: ANIMATED RECORDINGS & VIDEOS (MP4 + GIF)
  // ----------------------------------------------------
  console.log('\n[2/3] Generating Video Recordings & Animated GIFs...');

  const tempFrameDir = path.join(__dirname, 'temp_frames');
  if (fs.existsSync(tempFrameDir)) fs.rmSync(tempFrameDir, { recursive: true, force: true });
  fs.mkdirSync(tempFrameDir, { recursive: true });

  // ----------------------------------------------------
  // Recording 1: Hero Bottleneck Shift (100x Imaging Breakthrough)
  // ----------------------------------------------------
  console.log('\n--> Recording 1: Hero Bottleneck Shift (100x Imaging Breakthrough)...');
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 800));

  // Reset to Preset 1
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const p1 = btns.find(b => b.innerText.includes('Preset 1: Imaging Wall'));
    if (p1) p1.click();
  });
  await new Promise(r => setTimeout(r, 600));

  let frameIndex = 0;
  for (let i = 0; i < 12; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  // Click 1-Click Demo
  console.log('Clicking 1-Click Demo & recording transition...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const shift = btns.find(b => b.innerText.includes('1-CLICK DEMO') || b.innerText.includes('SHIFT PARAMS ONLY'));
    if (shift) shift.click();
  });

  for (let i = 0; i < 35; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('Encoding hero_bottleneck_shift.mp4 and hero_bottleneck_shift.gif...');
  const rec1Mp4 = path.join(SUBMISSION_RECORDINGS, 'hero_bottleneck_shift.mp4');
  const rec1Gif = path.join(SUBMISSION_RECORDINGS, 'hero_bottleneck_shift.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1280:-2" "${rec1Mp4}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${rec1Gif}"`, { stdio: 'ignore' });
  fs.copyFileSync(rec1Mp4, path.join(PUBLIC_RECORDINGS, 'hero_bottleneck_shift.mp4'));
  fs.copyFileSync(rec1Gif, path.join(PUBLIC_RECORDINGS, 'hero_bottleneck_shift.gif'));
  console.log('Saved hero_bottleneck_shift (.mp4 and .gif)!');

  // ----------------------------------------------------
  // Recording 2: ELI5 vs Expert Mode Toggle & Nemotron Causal Synthesis
  // ----------------------------------------------------
  console.log('\n--> Recording 2: Nemotron ELI5 vs Expert Mode Toggle...');
  fs.rmSync(tempFrameDir, { recursive: true, force: true });
  fs.mkdirSync(tempFrameDir, { recursive: true });
  frameIndex = 0;

  await page.evaluate(() => {
    const nemotronSection = Array.from(document.querySelectorAll('div, section')).find(el => 
      el.innerText && el.innerText.includes('NVIDIA Nemotron 3 Super') && el.innerText.includes('AI INTERPRETATION')
    );
    if (nemotronSection) {
      nemotronSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Initial ELI5 view
  for (let i = 0; i < 12; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  // Toggle to Expert mode
  console.log('Toggling to Expert Mode...');
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="toggle-expert-mode"]');
    if (btn) btn.click();
  });

  for (let i = 0; i < 20; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  // Toggle back to ELI5 mode
  console.log('Toggling back to ELI5 Mode...');
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="toggle-eli5-mode"]');
    if (btn) btn.click();
  });

  for (let i = 0; i < 18; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('Encoding nemotron_eli5_toggle.mp4 and nemotron_eli5_toggle.gif...');
  const rec2Mp4 = path.join(SUBMISSION_RECORDINGS, 'nemotron_eli5_toggle.mp4');
  const rec2Gif = path.join(SUBMISSION_RECORDINGS, 'nemotron_eli5_toggle.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1280:-2" "${rec2Mp4}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${rec2Gif}"`, { stdio: 'ignore' });
  fs.copyFileSync(rec2Mp4, path.join(PUBLIC_RECORDINGS, 'nemotron_eli5_toggle.mp4'));
  fs.copyFileSync(rec2Gif, path.join(PUBLIC_RECORDINGS, 'nemotron_eli5_toggle.gif'));
  console.log('Saved nemotron_eli5_toggle (.mp4 and .gif)!');

  // ----------------------------------------------------
  // Recording 3: Interactive Guided Tour Walkthrough
  // ----------------------------------------------------
  console.log('\n--> Recording 3: Guided Tour Walkthrough...');
  fs.rmSync(tempFrameDir, { recursive: true, force: true });
  fs.mkdirSync(tempFrameDir, { recursive: true });
  frameIndex = 0;

  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 600));

  // Click Guided Tour / Start Walkthrough button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tour = btns.find(b => b.innerText.includes('Start Walkthrough') || b.innerText.includes('Guided Tour'));
    if (tour) tour.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Step 1
  for (let i = 0; i < 10; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  // Click Next Tour Step
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next') || b.innerText.includes('2 Biophysics Engine'));
    if (nextBtn) nextBtn.click();
  });

  for (let i = 0; i < 12; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  // Click Next Step (Bottleneck Engine)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next') || b.innerText.includes('3 Bottleneck Engine'));
    if (nextBtn) nextBtn.click();
  });

  for (let i = 0; i < 12; i++) {
    const framePath = path.join(tempFrameDir, `frame_${String(frameIndex++).padStart(4, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('Encoding guided_tour_walkthrough.mp4 and guided_tour_walkthrough.gif...');
  const rec3Mp4 = path.join(SUBMISSION_RECORDINGS, 'guided_tour_walkthrough.mp4');
  const rec3Gif = path.join(SUBMISSION_RECORDINGS, 'guided_tour_walkthrough.gif');
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1280:-2" "${rec3Mp4}"`, { stdio: 'ignore' });
  execSync(`ffmpeg -y -framerate 10 -i "${tempFrameDir}/frame_%04d.png" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${rec3Gif}"`, { stdio: 'ignore' });
  fs.copyFileSync(rec3Mp4, path.join(PUBLIC_RECORDINGS, 'guided_tour_walkthrough.mp4'));
  fs.copyFileSync(rec3Gif, path.join(PUBLIC_RECORDINGS, 'guided_tour_walkthrough.gif'));
  console.log('Saved guided_tour_walkthrough (.mp4 and .gif)!');

  // Clean temp frame dir
  fs.rmSync(tempFrameDir, { recursive: true, force: true });

  await browser.close();
  console.log('\n======================================================');
  console.log('🎉 ALL 6 SCREENSHOTS AND 3 VIDEO/GIF RECORDINGS COMPLETE!');
  console.log('======================================================');
}

captureAll().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
