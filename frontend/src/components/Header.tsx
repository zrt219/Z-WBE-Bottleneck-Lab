import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Compass, BookOpen, Layers, Zap, Cloud, Github, Eye } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { AccessibilityModal } from './AccessibilityModal';

interface HeaderProps {
  onStartTutorial?: () => void;
  onOneClickDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartTutorial, onOneClickDemo }) => {
  const location = useLocation();
  const { openModal, isModalOpen } = useAccessibility();

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

      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-x-3 sm:gap-x-4 lg:gap-x-6">
          {/* Brand & Logo Lockup */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-xs ring-1 ring-slate-800/80 group-hover:bg-blue-600 transition-all duration-150 group-hover:scale-105 shrink-0">
                Z
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-blue-600 transition-colors font-mono whitespace-nowrap">
                  Z-WBE BOTTLENECK LAB
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 hidden sm:inline shrink-0">
                  v1.0
                </span>
              </div>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden md:block lg:hidden xl:block shrink-0" />

            {/* Single-line GTC 2026 Golden Ticket Badge: visible on md tablet and xl+ full desktop, cleanly gated on lg to prevent center nav collision */}
            <span className="hidden md:inline-flex lg:hidden xl:inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 whitespace-nowrap shadow-2xs shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
              <span>GTC 2026 Golden Ticket</span>
            </span>
          </div>

          {/* Centered Segmented Navigation Links (Desktop lg+) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Cluster & Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Deterministic Engine Latency (Wide 2xl+) */}
            <div className="hidden 2xl:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap shrink-0" title="Deterministic Math Pipeline Latency">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-semibold text-slate-700">Engine:</span>
              <span className="text-emerald-600 font-bold">&lt;1ms</span>
            </div>

            {/* AI Model Badge (sm+) */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="font-semibold text-slate-900">Nemotron 3 Super</span>
            </div>

            {/* Cloud Run Host Badge (xl+) */}
            <div className="hidden xl:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1.5 rounded-lg bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 font-semibold shadow-2xs whitespace-nowrap shrink-0">
              <Cloud className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Cloud Run</span>
            </div>

            {/* One-Click Demo Quick Button */}
            <button
              onClick={handleOneClickDemo}
              data-testid="header-one-click-demo-button"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-800 border border-emerald-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              title="Run 1-Click Hero Demo (100x Acceleration + Instant Grounded AI Explanation)"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
              <span>⚡ 1-Click Demo</span>
            </button>

            {/* Interactive Tutorial Button */}
            <button
              onClick={handleStartTutorial}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 hover:text-blue-900 border border-blue-200/90 font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0"
              title="Start Interactive Tutorial & Walkthrough"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Tutorial</span>
            </button>

            {/* Accessibility & Readability Settings Toggle */}
            <button
              onClick={openModal}
              data-testid="header-accessibility-button"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-slate-900 border border-slate-300/80 font-bold text-xs shadow-2xs transition-all cursor-pointer shrink-0"
              title="Accessibility & Readability Settings (Alt+A)"
              aria-haspopup="dialog"
              aria-expanded={isModalOpen}
              aria-label="Open Accessibility & Readability Settings (Alt+A)"
            >
              <Eye className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span>A11y</span>
            </button>

            {/* GitHub Repo Link (always visible) */}
            <a
              href="https://github.com/zhane/z-wbe-bottleneck-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors shadow-2xs flex items-center justify-center shrink-0"
              title="View Source on GitHub"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Navigation Strip (<lg) */}
      <div className="flex lg:hidden items-center justify-start sm:justify-center border-t border-slate-200/70 bg-white/95 px-3 py-2 overflow-x-auto gap-1.5 shadow-xs">
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
          <span>Tutorial</span>
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
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
    </header>

    {/* Accessibility Settings Modal Dialog */}
    <AccessibilityModal />
  </>
);
};

