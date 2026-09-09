const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'https://z-wbe-bottleneck-lab.vercel.app';

async function test() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(APP_URL, { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const root = document.createElement('div');
    root.id = 'cinematic-cursor-root';
    root.innerHTML = `
      <style>
        #cinematic-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          z-index: 2147483647;
          pointer-events: none;
          transform: translate(500px, 400px);
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.7));
        }
        .click-ripple {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2147483646;
          border: 3px solid #38bdf8;
          box-shadow: 0 0 16px rgba(56, 189, 248, 0.9);
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          left: 500px;
          top: 400px;
        }
      </style>
      <div id="cinematic-cursor">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M4 3L11.5 21L14.8 13.2L22 10L4 3Z" fill="#ffffff" stroke="#0b0f19" stroke-width="1.8" stroke-linejoin="round"/>
          <circle cx="5.5" cy="4.5" r="1.6" fill="#38bdf8"/>
        </svg>
      </div>
      <div class="click-ripple"></div>
    `;
    document.body.appendChild(root);
  });

  const testOut = path.join(__dirname, 'test_cursor_frame.png');
  await page.screenshot({ path: testOut });
  await browser.close();
  console.log('Test frame saved:', testOut, fs.existsSync(testOut));
}

test().catch(console.error);
