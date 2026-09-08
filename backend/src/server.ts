import express from 'express';
import cors from 'cors';
import path from 'path';
import { config, validateStartupEnvironment } from './config';
import { apiRouter } from './routes';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));

// Mount API routes
app.use('/api', apiRouter);

// Serve static frontend files if built
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      // If frontend hasn't been built yet in dev mode, return basic info
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Z-WBE Bottleneck Lab API</title></head>
          <body style="font-family: sans-serif; padding: 2rem;">
            <h1>Z-WBE Bottleneck Lab Backend API</h1>
            <p>API is active. Health: <a href="/api/health">/api/health</a></p>
          </body>
        </html>
      `);
    }
  });
});

const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith('server.ts') ||
  process.argv[1].endsWith('server.js')
);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL && isDirectExecution) {
  validateStartupEnvironment();
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Z-WBE Backend] Server listening on 0.0.0.0:${config.port}`);
  });
}

export default app;
