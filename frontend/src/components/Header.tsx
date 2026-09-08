import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Compass, BookOpen, Layers, Zap, Cloud, Github, Eye, GraduationCap, Award } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityModal } from './AccessibilityModal';
import { ContestBadgesModal } from './ContestBadgesModal';

interface HeaderProps {
  onStartTutorial?: () => void;
  onOneClickDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTutorial, onOneClickDemo }) => {
  const location = useLocation();
  const { openModal, isModalOpen } = useAccessibility();
  const [isContestModalOpen, setIsContestModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenContest = () => setIsContestModalOpen(true);
    window.addEventListener('zwbe:open-contest-modal', handleOpenContest);
    return () => window.removeEventListener('zwbe:open-contest-modal', handleOpenContest);
  }, []);

  const handleStartTutorial = () => {
    if (onStartTutorial) {
      onStartTutorial();
    } else {
      window.dispatchEvent(new CustomEvent('zwbe:start-tour'));
    }
  };

  const handleOneClickDemo = () => {
    if (onOneClickDemo) {
      onOneClickDemo();
    } else {
      window.dispatchEvent(new CustomEvent('zwbe:one-click-demo'));
    }
  };

  const navItems = [
    { label: 'Simulator', path: '/', icon: Activity },
    { label: 'Tutorials', path: '/tutorials', icon: GraduationCap },
    { label: 'Methodology', path: '/methodology', icon: BookOpen },
    { label: 'Architecture', path: '/architecture', icon: Layers },
    { label: 'About & Contest', path: '/about', icon: Compass }
  ];

  return (
    <>
      {/* WCAG Accessible Skip Link */}
      <a
        href="#main-simulator-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:font-bold focus:text-sm focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-blue-300 transition-all"
      >
        Skip to main content
      </a>

      {/* Primary Sticky Header: Sleek 64px navigation */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-x-3 sm:gap-x-4">
            {/* Brand & Logo Lockup */}
            <div className="flex items-center space-x-3 shrink-0">
              <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
                <img
                  src="/images/zwbe-logo.jpg"
                  alt="Z-WBE Bottleneck Lab Logo"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-sm ring-1 ring-slate-800/80 group-hover:scale-105 transition-all duration-150 shrink-0"
                />
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-blue-600 transition-colors font-mono whitespace-nowrap">
                    Z-WBE BOTTLENECK LAB
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 hidden xl:inline shrink-0">
                    v1.0
                  </span>
                </div>
              </Link>
            </div>

            {/* Segmented Navigation Links (Desktop lg+) - Centered in flex flow, ZERO overlap */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-inner mx-auto shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-2.5 xl:px-3.5 py-1 xl:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 font-bold scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>
                      {item.path === '/about' ? (
                        <>
                          <span className="xl:hidden">About</span>
                          <span className="hidden xl:inline">About &amp; Contest</span>
                        </>
                      ) : (
                        item.label
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons Cluster */}
            <div className="flex items-center space-x-2 shrink-0">
              {/* One-Click Demo Quick Button */}
              <button
                onClick={handleOneClickDemo}
                data-testid="header-one-click-demo-button"
                className="hidden xl:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 hover:from-emerald-100 hover:to-teal-200 active:from-emerald-200 active:to-teal-300 text-emerald-900 border border-emerald-300 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                title="Run 1-Click Hero Demo (100x Acceleration + Instant Grounded AI Explanation)"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                <span>⚡ 1-Click Demo</span>
              </button>

              {/* Guided Tour Walkthrough Button */}
              <button
                onClick={handleStartTutorial}
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-900 border border-blue-200 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                title="Start Interactive Guided Tour"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Guided Tour</span>
              </button>

              {/* Accessibility & Readability Settings Toggle */}
              <button
                onClick={openModal}
                data-testid="header-accessibility-button"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-b from-white to-slate-100 hover:to-slate-200 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                title="Accessibility & Readability Settings (Alt+A)"
                aria-haspopup="dialog"
                aria-expanded={isModalOpen}
                aria-label="Open Accessibility & Readability Settings (Alt+A)"
              >
                <Eye className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span>A11y</span>
              </button>

              {/* GitHub Repo Link */}
              <a
                href="https://github.com/zrt219/Z-WBE-Bottleneck-Lab"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 hover:text-slate-900 bg-gradient-to-b from-white to-slate-100 hover:to-slate-200 rounded-lg border border-slate-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-center shrink-0 active:scale-95"
                title="View Source on GitHub"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Dedicated Telemetry & Contest Status Sub-Bar - Natural page flow (scrolls away cleanly, ZERO dashboard collision) */}
      <div id="header-telemetry-subbar" data-testid="header-telemetry-subbar" className="border-b border-slate-200/80 bg-slate-50/90 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 text-[11px] font-mono">
          {/* Left: Verified Credentials Recognition - Interactive Modal Launcher */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsContestModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 hover:from-blue-100 hover:to-indigo-200 text-blue-950 border border-blue-300 font-bold uppercase text-[10px] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              title="Click to view verified Google Cloud & NVIDIA developer credentials and learning pathways"
            >
              <Award className="w-3 h-3 text-blue-700 shrink-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>🏅 Verified Credentials</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline text-[11px]">Whole-Brain Emulation Demonstrator</span>
          </div>

          {/* Right: Live Telemetry Indicators */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600 shrink-0">
            {/* Deterministic Math Engine Latency */}
            <div className="flex items-center space-x-1.5" title="Deterministic Math Pipeline Latency">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span className="text-slate-500">Engine:</span>
              <span className="text-emerald-600 font-bold">&lt;1ms</span>
            </div>

            <span className="text-slate-300">•</span>

            {/* AI Model Indicator */}
            <div className="flex items-center space-x-1.5" title="Grounded AI Interpretation Engine via OpenRouter">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-slate-500">AI:</span>
              <span className="font-semibold text-slate-800">NVIDIA Nemotron 3 Super 120B</span>
            </div>

            <span className="text-slate-300 hidden md:inline">•</span>

            {/* Cloud Run / Vercel Serverless Host Badge */}
            <div className="hidden md:flex items-center space-x-1.5 text-emerald-800 font-semibold" title="Deployment Infrastructure">
              <Cloud className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Cloud Run × Vercel Serverless</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Navigation Strip (<lg) - Natural page flow */}
      <div className="flex lg:hidden items-center justify-start w-full max-w-full border-b border-slate-200/70 bg-white/95 px-3 py-2 overflow-x-auto gap-1.5 shadow-xs">
        <button
          onClick={() => setIsContestModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 bg-blue-50 text-blue-900 border border-blue-200 shadow-xs cursor-pointer"
          title="View Verified Credentials"
        >
          <Award className="w-3.5 h-3.5 text-blue-700 shrink-0" />
          <span>🏅 Credentials</span>
        </button>
        <button
          onClick={openModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 bg-slate-100 text-slate-700 border border-slate-200 shadow-xs cursor-pointer"
          aria-label="Accessibility Settings"
        >
          <Eye className="w-3.5 h-3.5 text-slate-700 shrink-0" />
          <span>A11y</span>
        </button>
        <button
          onClick={handleOneClickDemo}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
          <span>⚡ 1-Click Demo</span>
        </button>
        <button
          onClick={handleStartTutorial}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 bg-blue-50 text-blue-700 border border-blue-200 shadow-xs cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Guided Tour</span>
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

    {/* Accessibility Settings Modal Dialog */}
    <AccessibilityModal />

    {/* Official Google Cloud × NVIDIA Verified Credentials Modal */}
    <ContestBadgesModal isOpen={isContestModalOpen} onClose={() => setIsContestModalOpen(false)} />
  </>
);
};

