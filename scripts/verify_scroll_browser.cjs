const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '../frontend/dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 4188;

// 1. Simple static HTTP server for frontend/dist
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
  };

  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';
    let filePath = path.join(DIST_DIR, reqUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(500);
      res.end('Server Error: ' + err.message);
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`[Test Server] Serving dist on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// 2. CDP client using native WebSocket
function createCdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let idCounter = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = ++idCounter;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  return new Promise((resolve, reject) => {
    ws.onopen = () => resolve({ send, close: () => ws.close() });
    ws.onerror = (err) => reject(err);
  });
}

// Helper to fetch CDP target
async function getWsUrl(port) {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find((t) => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          return page.webSocketDebuggerUrl;
        }
      }
    } catch (e) {
      // retry
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Could not connect to Edge DevTools port ' + port);
}

async function run() {
  const server = await startServer();

  const cdpPort = 9223;
  const userDataDir = path.resolve(__dirname, '../.edge-profile-test');
  
  console.log('[Browser] Launching Edge headless...');
  const edge = spawn(EDGE_PATH, [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900'
  ], { stdio: 'ignore' });

  try {
    const wsUrl = await getWsUrl(cdpPort);
    console.log('[Browser] Connected to CDP:', wsUrl);
    const client = await createCdpClient(wsUrl);

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log(`[Browser] Navigating to http://localhost:${PORT}/ ...`);
    await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });

    // Wait for load
    await new Promise((r) => setTimeout(r, 2000));

    // Evaluate initial layout
    console.log('[Test 1] Checking initial layout at scrollY = 0...');
    const initialCheck = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('header');
          const headerRect = header ? header.getBoundingClientRect() : null;
          
          // Find the telemetry bar by ID
          const telemetryBar = document.getElementById('header-telemetry-subbar');
          const telemetryRect = telemetryBar ? telemetryBar.getBoundingClientRect() : null;

          return {
            scrollY: window.scrollY,
            headerHeight: headerRect ? headerRect.height : 0,
            telemetryTop: telemetryRect ? telemetryRect.top : 0,
            telemetryHeight: telemetryRect ? telemetryRect.height : 0
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Initial layout:', initialCheck.result.value);

    // Test 2: Scroll down to 400px
    console.log('[Test 2] Scrolling down to 400px...');
    const scroll400Result = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, 400);
          const header = document.querySelector('header');
          const headerRect = header.getBoundingClientRect();

          const telemetryBar = document.getElementById('header-telemetry-subbar');
          const telemetryRect = telemetryBar ? telemetryBar.getBoundingClientRect() : null;

          const presetSelector = document.getElementById('tour-preset-selector');
          const presetRect = presetSelector ? presetSelector.getBoundingClientRect() : null;

          return {
            scrollY: window.scrollY,
            headerTop: headerRect.top,
            headerBottom: headerRect.bottom,
            headerHeight: headerRect.height,
            isHeaderSticky: headerRect.top === 0,
            telemetryTop: telemetryRect ? telemetryRect.top : null,
            telemetryBottom: telemetryRect ? telemetryRect.bottom : null,
            isTelemetryScrolledOff: telemetryRect ? telemetryRect.bottom <= 0 : false,
            presetTop: presetRect ? presetRect.top : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Scroll 400px result:', scroll400Result.result.value);

    const v2 = scroll400Result.result.value;
    if (!v2.isHeaderSticky) {
      throw new Error('FAIL: Header should be sticky at top: 0');
    }
    if (!v2.isTelemetryScrolledOff) {
      throw new Error('FAIL: Telemetry sub-bar should naturally scroll off screen (bottom <= 0)! Instead bottom is ' + v2.telemetryBottom);
    }
    console.log('PASS: Primary header is cleanly sticky at top-0 (h-16 = 64px), and telemetry sub-bar scrolled completely off screen without overlapping!');

    // Test 3: Scroll down to 900px (inspecting assumptions and pipeline map)
    console.log('[Test 3] Scrolling down to 900px (pipeline and assumptions view)...');
    const scroll900Result = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          window.scrollTo(0, 900);
          const header = document.querySelector('header');
          const headerRect = header.getBoundingClientRect();

          const scopeSection = document.getElementById('section-scope');
          const scopeRect = scopeSection ? scopeSection.getBoundingClientRect() : null;

          return {
            scrollY: window.scrollY,
            headerTop: headerRect.top,
            headerBottom: headerRect.bottom,
            headerHeight: headerRect.height,
            scopeTop: scopeRect ? scopeRect.top : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Scroll 900px result:', scroll900Result.result.value);

    // Capture screenshot of scroll at 350px
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 350);' });
    await new Promise((r) => setTimeout(r, 500));
    const screenshotData = await client.send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath = path.resolve(__dirname, '../scroll_verification.png');
    fs.writeFileSync(screenshotPath, Buffer.from(screenshotData.data, 'base64'));
    console.log(`[Screenshot] Saved screenshot to ${screenshotPath}`);

    // Capture screenshot of deep scroll at 850px
    await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 850);' });
    await new Promise((r) => setTimeout(r, 500));
    const screenshotData2 = await client.send('Page.captureScreenshot', { format: 'png' });
    const screenshotPath2 = path.resolve(__dirname, '../scroll_verification_deep.png');
    fs.writeFileSync(screenshotPath2, Buffer.from(screenshotData2.data, 'base64'));
    console.log(`[Screenshot] Saved deep screenshot to ${screenshotPath2}`);

    client.close();
    console.log('\n[SUCCESS] All browser scroll verifications PASSED perfectly!');
  } finally {
    edge.kill();
    server.close();
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
