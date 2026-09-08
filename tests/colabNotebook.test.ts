import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Google Colab Canonical Architecture & Synchronization Tests', () => {
  const rootDir = path.resolve(__dirname, '..');
  const notebookPath = path.join(rootDir, 'notebooks/Z_WBE_GPU_LAB.ipynb');
  const archiveDir = path.join(rootDir, 'notebooks/archive');
  const tutorialsDir = path.join(rootDir, 'notebooks/tutorials');
  const colabMdPath = path.join(rootDir, 'COLAB.md');
  const syncScriptPath = path.join(rootDir, 'scripts/sync-colab.ps1');

  it('verifies that notebooks directory contains only ONE canonical notebook at root', () => {
    const files = fs.readdirSync(path.join(rootDir, 'notebooks'));
    const ipynbFiles = files.filter(f => f.endsWith('.ipynb'));
    expect(ipynbFiles).toEqual(['Z_WBE_GPU_LAB.ipynb']);
  });

  it('verifies that notebooks/archive contains the four historical learning notebooks', () => {
    expect(fs.existsSync(archiveDir)).toBe(true);
    const archivedFiles = fs.readdirSync(archiveDir);
    expect(archivedFiles).toContain('gpu_accelerated_regression.ipynb');
    expect(archivedFiles).toContain('gpu_scenario_sweep_old.ipynb');
    expect(archivedFiles).toContain('nyc_congestion_pricing_equilibrium.ipynb');
    expect(archivedFiles).toContain('nyc_graph_congestion_matrix.ipynb');
  });

  it('verifies canonical notebook JSON schema and all 10 required architectural sections', () => {
    expect(fs.existsSync(notebookPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(notebookPath, 'utf-8'));

    expect(content.nbformat).toBeGreaterThanOrEqual(4);
    expect(content.cells).toBeDefined();
    expect(content.cells.length).toBeGreaterThanOrEqual(10);

    const allSourceText = content.cells
      .map((c: { source: string[] }) => c.source.join(''))
      .join('\n');

    const requiredSectionPatterns = [
      /Section 1:\s*Environment\s*(&|and|\/)\s*GPU/i,
      /Section 2:\s*NVIDIA RAPIDS Setup/i,
      /Section 3:\s*Course Benchmark Pipeline/i,
      /Section 4:\s*Benchmark Evidence\s*(&|and)\s*Hardware Provenance/i,
      /Section 5:\s*Z-WBE Biophysical/i,
      /Section 6:\s*100,000-Scenario/i,
      /Section 7:\s*Multi-Dimensional Bottleneck Classification/i,
      /Section 8:\s*Phase-Transition/i,
      /Section 9:\s*Visual Analytics\s*(&|and)\s*JSON Export/i,
      /Section 10:\s*Contest Evidence/i,
    ];

    for (const pattern of requiredSectionPatterns) {
      expect(allSourceText).toMatch(pattern);
    }

    // Check specific technical content
    expect(allSourceText).toContain('!nvidia-smi');
    expect(allSourceText).toContain('%load_ext cudf.pandas');
    expect(allSourceText).toContain('%load_ext cuml.accel');
    expect(allSourceText).toContain('RandomForestRegressor');
    expect(allSourceText).toContain('xgb.XGBRegressor');
    expect(allSourceText).toContain('NVIDIA Tesla T4');
    expect(allSourceText).toContain('8.62');
    expect(allSourceText).toContain('calculate_wbe_metrics');
    expect(allSourceText).toContain('N_SAMPLES = 100000');
    expect(allSourceText).toContain('gpu-sweep-summary.json');
  });

  it('verifies COLAB.md has canonical badge, permanent URL, triad architecture, and sync guide', () => {
    expect(fs.existsSync(colabMdPath)).toBe(true);
    const content = fs.readFileSync(colabMdPath, 'utf-8');

    // Badge and link
    expect(content).toContain('OPEN%20Z--WBE%20GPU%20LAB%20IN%20COLAB');
    expect(content).toContain(
      'https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb'
    );

    // Triad architecture
    expect(content).toContain('The Triad Architecture: Antigravity ↔ GitHub ↔ Colab');
    expect(content).toContain('ONE SOURCE OF TRUTH');

    // Sequential workflow & rule
    expect(content).toContain('Do not edit the notebook in Antigravity and Colab at the same time');

    // Sync script documentation
    expect(content).toContain('scripts/sync-colab.ps1');
  });

  it('verifies scripts/sync-colab.ps1 exists and contains the 8-step synchronization workflow', () => {
    expect(fs.existsSync(syncScriptPath)).toBe(true);
    const script = fs.readFileSync(syncScriptPath, 'utf-8');

    expect(script).toContain('[Step 1/8]');
    expect(script).toContain('[Step 2/8]');
    expect(script).toContain('[Step 3/8]');
    expect(script).toContain('[Step 4/8]');
    expect(script).toContain('[Step 5/8]');
    expect(script).toContain('[Step 6/8]');
    expect(script).toContain('[Step 7/8]');
    expect(script).toContain('[Step 8/8]');

    // Contains permanent URL
    expect(script).toContain(
      'https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb'
    );
  });
});
