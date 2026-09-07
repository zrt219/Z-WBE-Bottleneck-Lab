"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: config_1.config.corsOrigin }));
app.use(express_1.default.json({ limit: '10mb' }));
// Mount API routes
app.use('/api', routes_1.apiRouter);
// Serve static frontend files if built
const frontendDistPath = path_1.default.resolve(__dirname, '../../frontend/dist');
app.use(express_1.default.static(frontendDistPath));
// Fallback to index.html for SPA client-side routing
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    const indexHtml = path_1.default.join(frontendDistPath, 'index.html');
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
const isDirectExecution = process.argv[1] && (process.argv[1].endsWith('server.ts') ||
    process.argv[1].endsWith('server.js'));
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL && isDirectExecution) {
    (0, config_1.validateStartupEnvironment)();
    app.listen(config_1.config.port, () => {
        console.log(`[Z-WBE Backend] Server listening on port ${config_1.config.port}`);
    });
}
exports.default = app;
