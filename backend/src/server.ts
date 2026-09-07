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

if (process.env.NODE_ENV !== 'test') {
  validateStartupEnvironment();
  app.listen(config.port, () => {
    console.log(`[Z-WBE Backend] Server listening on port ${config.port}`);
  });
}

export default app;
