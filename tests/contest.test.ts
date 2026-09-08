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

  const badgeFilenames = [
    'google-nvidia-developer-badges.png',
    'badge_nim_gke.png',
    'badge_data_analytics.png',
    'badge_accelerated_ml.png',
    'badge_intro_inference.png'
  ];

  it('verifies that all official badge assets exist in both public asset directories', () => {
    for (const filename of badgeFilenames) {
      const pubPath = path.join(rootDir, 'public/images', filename);
      const frontPath = path.join(rootDir, 'frontend/public/images', filename);

      expect(fs.existsSync(pubPath), `Missing public/images/${filename}`).toBe(true);
      expect(fs.existsSync(frontPath), `Missing frontend/public/images/${filename}`).toBe(true);

      const pubStats = fs.statSync(pubPath);
      const frontStats = fs.statSync(frontPath);
      expect(pubStats.size).toBeGreaterThan(10000);
      expect(frontStats.size).toBe(pubStats.size);
    }
  });

  it('verifies that README.md highlights 4/4 verified credentials, open models, and contains no sweepstakes promotion or deadline', () => {
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

    // Public Profile & Verified Playlist URLs (All 4 verified badges)
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('developers.google.com/profile/u/zhane');
    expect(content).toContain('4 Official Digital Badges (4/4 Complete Sweep)');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=zhane');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=zhane');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane');
    expect(content).toContain('https://developers.google.com/learn/pathways/ai-models-on-gpu-intro');

    // High-res badge artwork images
    expect(content).toContain('badge_nim_gke.png');
    expect(content).toContain('badge_data_analytics.png');
    expect(content).toContain('badge_accelerated_ml.png');
    expect(content).toContain('badge_intro_inference.png');

    // 4 Judging Criteria
    expect(content).toContain('(a) Technical Innovation');
    expect(content).toContain('(b) Effective Use of NVIDIA & Google Cloud');
    expect(content).toContain('(c) Potential Impact & Usefulness');
    expect(content).toContain('(d) Quality of Documentation & Presentation');
  });

  it('verifies that CONTEST_SUBMISSION.md includes verified public profile and all 4 badge playlists', () => {
    const content = fs.readFileSync(contestSubmissionPath, 'utf-8');
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('developers.google.com/profile/u/zhane');
    expect(content).toContain('4/4 Complete Sweep');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=zhane');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=zhane');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane');
    expect(content).toContain('nvidia/nemotron-3-super-120b-a12b:free');
  });

  it('verifies that ContestBadgesModal has ARIA dialog attributes, backdrop dismiss, 4/4 badge links, and artwork with no prize marketing', () => {
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
    expect(content).toContain('4 Official Badges Verified');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane');
    expect(content).toContain('/images/badge_nim_gke.png');
    expect(content).toContain('/images/badge_data_analytics.png');
    expect(content).toContain('/images/badge_accelerated_ml.png');
    expect(content).toContain('/images/badge_intro_inference.png');

    // No prize promotion or deadline
    expect(content).not.toContain('The Grand Prize');
    expect(content).not.toContain('Jensen Huang Keynote');
    expect(content).not.toContain('Deadline:');
  });

  it('verifies that AboutPage includes architectural pillars, 4/4 verified badges, artwork, and scoring criteria with no prize marketing or deadline', () => {
    const content = fs.readFileSync(aboutTsxPath, 'utf-8');
    expect(content).toContain('Google Cloud × NVIDIA Developer Challenge 2026');
    expect(content).toContain('/images/google-nvidia-developer-badges.png');
    expect(content).toContain('110918189625880989910');
    expect(content).toContain('4/4 Badges Verified');
    expect(content).toContain('https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane');
    expect(content).toContain('/images/badge_nim_gke.png');
    expect(content).toContain('/images/badge_data_analytics.png');
    expect(content).toContain('/images/badge_accelerated_ml.png');
    expect(content).toContain('/images/badge_intro_inference.png');
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

  it('verifies that Header and SimulatorPage integrate verified credentials access points with 4/4 sweep indicators', () => {
    const headerContent = fs.readFileSync(headerTsxPath, 'utf-8');
    const simulatorContent = fs.readFileSync(simulatorTsxPath, 'utf-8');

    expect(headerContent).toContain('Verified Credentials');
    expect(headerContent).toContain('ContestBadgesModal');
    expect(simulatorContent).toContain('Google Cloud × NVIDIA Developer Challenge 2026');
    expect(simulatorContent).toContain('Inspect Verified Credentials');
    expect(simulatorContent).toContain('4/4 Verified Badges (Full Sweep • Sep 7, 2026)');

    // No prize promotion or deadline
    expect(headerContent).not.toContain('Golden Ticket');
    expect(simulatorContent).not.toContain('Deadline:');
  });
});
