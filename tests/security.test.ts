import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Security Verification: API Key Protection', () => {
  it('ensures GEMINI_API_KEY, OPENROUTER_API_KEY, and NVIDIA_API_KEY are not in frontend source files', () => {
    const frontendSrcDir = path.resolve(__dirname, '../frontend/src');

    function scanDir(dir: string): string[] {
      const files: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...scanDir(fullPath));
        } else if (/\.(tsx?|jsx?|html|css|json)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const files = scanDir(frontendSrcDir);
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Should never contain actual API keys
      expect(content).not.toMatch(/sk-or-v1-[A-Za-z0-9_-]{20,}/);
      expect(content).not.toMatch(/AIzaSy[A-Za-z0-9_-]{20,}/);
      expect(content).not.toMatch(/nvapi-[A-Za-z0-9_-]{20,}/);

      // Should never reference server-side env vars or VITE_ leaked keys
      expect(content).not.toContain('GEMINI_API_KEY');
      expect(content).not.toContain('OPENROUTER_API_KEY');
      expect(content).not.toContain('VITE_GEMINI_API_KEY');
      expect(content).not.toContain('VITE_OPENROUTER_API_KEY');
      expect(content).not.toContain('NEXT_PUBLIC_GEMINI_API_KEY');
      expect(content).not.toContain('NEXT_PUBLIC_OPENROUTER_API_KEY');
    }
  });

  it('ensures .gitignore ignores .env, .env.local, and .env.*.local', () => {
    const gitignorePath = path.resolve(__dirname, '../.gitignore');
    const content = fs.readFileSync(gitignorePath, 'utf-8');

    expect(content).toMatch(/^\.env$/m);
    expect(content).toMatch(/^\.env\.local$/m);
    expect(content).toMatch(/^\.env\.\*\.local$/m);
  });

  it('ensures .env.example only contains placeholders and no actual secrets', () => {
    const examplePath = path.resolve(__dirname, '../.env.example');
    expect(fs.existsSync(examplePath)).toBe(true);

    const content = fs.readFileSync(examplePath, 'utf-8');
    expect(content).toContain('OPENROUTER_API_KEY=');
    expect(content).toContain('OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free');
    expect(content).toContain('OPENROUTER_BASE_URL=https://openrouter.ai/api/v1');

    // Never contain actual secret patterns
    expect(content).not.toMatch(/sk-or-v1-[A-Za-z0-9_-]{20,}/);
    expect(content).not.toMatch(/AIzaSy[A-Za-z0-9_-]{20,}/);
    expect(content).not.toMatch(/nvapi-[A-Za-z0-9_-]{20,}/);
  });

  it('ensures .env and local.env contain no hardcoded or leaked secrets', () => {
    for (const file of ['../.env', '../local.env']) {
      const envFilePath = path.resolve(__dirname, file);
      if (fs.existsSync(envFilePath)) {
        const content = fs.readFileSync(envFilePath, 'utf-8');
        expect(content).not.toMatch(/sk-or-v1-[A-Za-z0-9_-]{20,}/);
        expect(content).not.toMatch(/AIzaSy[A-Za-z0-9_-]{20,}/);
        expect(content).not.toMatch(/nvapi-[A-Za-z0-9_-]{20,}/);
      }
    }
  });

  it('ensures backend config exposes safe booleans for health status', async () => {
    const configPath = path.resolve(__dirname, '../backend/src/config.ts');
    const content = fs.readFileSync(configPath, 'utf-8');

    expect(content).toContain('isOpenRouterConfigured');
    expect(content).toContain('modelIdentifier');
  });

  it('ensures codebase does not contain forbidden legacy endpoints or files', () => {
    const backendSrcDir = path.resolve(__dirname, '../backend/src');
    expect(fs.existsSync(path.join(backendSrcDir, 'services/geminiGemma.ts'))).toBe(false);
    expect(fs.existsSync(path.join(backendSrcDir, 'services/nim.ts'))).toBe(false);
    expect(fs.existsSync(path.resolve(__dirname, '../frontend/src/components/GemmaInterpretation.tsx'))).toBe(false);

    const entries = fs.readdirSync(backendSrcDir, { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(entry.parentPath || backendSrcDir, entry.name), 'utf-8');
        expect(content).not.toContain('integrate.api.nvidia.com');
        expect(content).not.toContain('generativelanguage.googleapis.com');
        expect(content).not.toContain('GEMINI_API_KEY');
        expect(content).not.toContain('NVIDIA_API_KEY');
        expect(content).not.toContain('GEMMA_MODEL');
      }
    }
  });
});
