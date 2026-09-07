import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Google Cloud × NVIDIA Developer Challenge 2026 Submission Verifications', () => {
  const rootDir = path.resolve(__dirname, '..');
  const readmePath = path.join(rootDir, 'README.md');
  const contestSubmissionPath = path.join(rootDir, 'CONTEST_SUBMISSION.md');
  const publicBadgeImg = path.join(rootDir, 'public/images/google-nvidia-developer-badges.png');
  const frontendBadgeImg = path.join(rootDir, 'frontend/public/images/google-nvidia-developer-badges.png');
  const modalTsxPath = path.join(rootDir, 'frontend/src/components/ContestBadgesModal.tsx');
  const headerTsxPath = path.join(rootDir, 'frontend/src/components/Header.tsx');
  const aboutTsxPath = path.join(rootDir, 'frontend/src/pages/AboutPage.tsx');
  const simulatorTsxPath = path.join(rootDir, 'frontend/src/pages/SimulatorPage.tsx');

  it('verifies that the official badge screenshot exists in public asset directories', () => {
    expect(fs.existsSync(publicBadgeImg)).toBe(true);
    expect(fs.existsSync(frontendBadgeImg)).toBe(true);

    const publicStats = fs.statSync(publicBadgeImg);
    const frontendStats = fs.statSync(frontendBadgeImg);
    expect(publicStats.size).toBeGreaterThan(10000);
    expect(frontendStats.size).toBe(publicStats.size);
  });

  it('verifies that README.md highlights developer credentials, open models, and contains no sweepstakes promotion or deadline', () => {
    const content = fs.readFileSync(readmePath, 'utf-8');

    // Submission identity & Hashtags
    expect(content).toContain('Google Cloud × NVIDIA Developer Challenge 2026');
    expect(content).toContain('#NVIDIAGTC');

    // PROHIBITED: Sweepstakes promotion, prizes, and deadline
    expect(content).not.toContain('Your chance to win a Golden Ticket');
    expect(content).not.toContain('Jensen Huang Keynote');
    expect(content).not.toContain('merchandise gift bag');
    expect(content).not.toContain('Deadline:');
    expect(content).not.toContain('September 10, 2026');

    // Open model
    expect(content).toContain('nvidia/nemotron-3-super-120b-a12b:free');
    expect(content).toContain('OpenRouter');

    // Public Profile & Verified Playlist URLs
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/u/110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/learn/pathways/ai-models-on-gpu-intro');

    // 4 Judging Criteria
    expect(content).toContain('(a) Technical Innovation');
    expect(content).toContain('(b) Effective Use of NVIDIA & Google Cloud');
    expect(content).toContain('(c) Potential Impact & Usefulness');
    expect(content).toContain('(d) Quality of Documentation & Presentation');
  });

  it('verifies that CONTEST_SUBMISSION.md includes verified public profile and badge playlists', () => {
    const content = fs.readFileSync(contestSubmissionPath, 'utf-8');
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/u/110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910');
    expect(content).toContain('nvidia/nemotron-3-super-120b-a12b:free');
  });

  it('verifies that ContestBadgesModal has ARIA dialog attributes, backdrop dismiss, and verified badge links with no prize marketing', () => {
    const content = fs.readFileSync(modalTsxPath, 'utf-8');
    expect(content).toContain('role="dialog"');
    expect(content).toContain('aria-modal="true"');
    expect(content).toContain('id="contest-modal-title"');
    expect(content).toContain('aria-labelledby="contest-modal-title"');
    expect(content).toContain('aria-label="Close modal"');
    expect(content).toContain('onClick={onClose}');
    expect(content).toContain("e.key === 'Escape'");
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/u/110918189625880989910');
    expect(content).toContain('/images/google-nvidia-developer-badges.png');

    // No prize promotion or deadline
    expect(content).not.toContain('The Grand Prize');
    expect(content).not.toContain('Jensen Huang Keynote');
    expect(content).not.toContain('Deadline:');
  });

  it('verifies that AboutPage includes architectural pillars, verified badges image, and scoring criteria with no prize marketing or deadline', () => {
    const content = fs.readFileSync(aboutTsxPath, 'utf-8');
    expect(content).toContain('Google Cloud × NVIDIA Developer Challenge 2026');
    expect(content).toContain('/images/google-nvidia-developer-badges.png');
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('Technical Innovation');
    expect(content).toContain('Effective Use of NVIDIA & Google Cloud');
    expect(content).toContain('Potential Impact & Usefulness');
    expect(content).toContain('Quality of Documentation & Presentation');
    expect(content).toContain('#NVIDIAGTC');

    // No prize promotion or deadline
    expect(content).not.toContain('Your Chance to Win');
    expect(content).not.toContain('Jensen Huang Keynote');
    expect(content).not.toContain('Deadline:');
  });

  it('verifies that Header and SimulatorPage integrate verified credentials access points', () => {
    const headerContent = fs.readFileSync(headerTsxPath, 'utf-8');
    const simulatorContent = fs.readFileSync(simulatorTsxPath, 'utf-8');

    expect(headerContent).toContain('Verified Credentials');
    expect(headerContent).toContain('ContestBadgesModal');
    expect(simulatorContent).toContain('Google Cloud × NVIDIA Developer Challenge 2026');
    expect(simulatorContent).toContain('Inspect Verified Credentials');

    // No prize promotion or deadline
    expect(headerContent).not.toContain('Golden Ticket');
    expect(simulatorContent).not.toContain('Deadline:');
  });
});
