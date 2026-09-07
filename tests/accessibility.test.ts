import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('WCAG 2.1 AAA Accessibility & Readability Verifications', () => {
  const indexCss = fs.readFileSync(path.resolve(__dirname, '../frontend/src/index.css'), 'utf-8');
  const headerTsx = fs.readFileSync(path.resolve(__dirname, '../frontend/src/components/Header.tsx'), 'utf-8');
  const modalTsx = fs.readFileSync(path.resolve(__dirname, '../frontend/src/components/AccessibilityModal.tsx'), 'utf-8');
  const contextTsx = fs.readFileSync(path.resolve(__dirname, '../frontend/src/context/AccessibilityContext.tsx'), 'utf-8');
  const appTsx = fs.readFileSync(path.resolve(__dirname, '../frontend/src/App.tsx'), 'utf-8');

  it('defines WCAG AAA high contrast rules with >= 7:1 contrast requirements', () => {
    expect(indexCss).toContain('html.a11y-high-contrast');
    expect(indexCss).toContain('color: #000000 !important');
    expect(indexCss).toContain('background-color: #ffffff !important');
    expect(indexCss).toContain('border-color: #334155 !important');
  });

  it('defines text scaling and dyslexia-friendly typography classes', () => {
    expect(indexCss).toContain('html.a11y-large-text');
    expect(indexCss).toContain('font-size: 115% !important');
    expect(indexCss).toContain('html.a11y-xl-text');
    expect(indexCss).toContain('font-size: 130% !important');
    expect(indexCss).toContain('html.a11y-dyslexia');
    expect(indexCss).toContain('letter-spacing: 0.05em !important');
  });

  it('defines high-visibility keyboard focus rings and min 44px touch targets', () => {
    expect(indexCss).toContain('html.a11y-enhanced-focus *:focus-visible');
    expect(indexCss).toContain('outline: 3px solid #1d4ed8 !important');
    expect(indexCss).toContain('html.a11y-large-targets');
    expect(indexCss).toContain('min-height: 44px !important');
    expect(indexCss).toContain('min-width: 44px !important');
  });

  it('defines vestibular-safe reduced motion mode', () => {
    expect(indexCss).toContain('html.a11y-reduced-motion');
    expect(indexCss).toContain('animation-duration: 0.001ms !important');
    expect(indexCss).toContain('transition-duration: 0.001ms !important');
  });

  it('provides accessible skip-to-content navigation link in Header', () => {
    expect(headerTsx).toContain('href="#main-simulator-content"');
    expect(headerTsx).toContain('Skip to main content');
    expect(appTsx).toContain('id="main-simulator-content"');
  });

  it('features dedicated Accessibility Modal with ARIA dialog roles and keyboard shortcut Alt+A', () => {
    expect(headerTsx).toContain('data-testid="header-accessibility-button"');
    expect(headerTsx).toContain('aria-label="Open Accessibility & Readability Settings (Alt+A)"');
    expect(modalTsx).toContain('role="dialog"');
    expect(modalTsx).toContain('aria-modal="true"');
    expect(modalTsx).toContain('Alt + A');
    expect(contextTsx).toContain("e.key === 'a' || e.key === 'A'");
  });

  it('maintains polite ARIA live announcement region for screen readers', () => {
    expect(contextTsx).toContain('id="a11y-live-region"');
    expect(contextTsx).toContain('aria-live="polite"');
    expect(contextTsx).toContain('role="status"');
  });
});
