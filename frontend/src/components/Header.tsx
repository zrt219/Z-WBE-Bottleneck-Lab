import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Compass, BookOpen, Layers, Zap, Cloud, Github } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Simulator', path: '/', icon: Activity },
    { label: 'Methodology', path: '/methodology', icon: BookOpen },
    { label: 'Architecture', path: '/architecture', icon: Layers },
    { label: 'About & Contest', path: '/about', icon: Compass }
  ];

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Logo Lockup */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider shadow-xs ring-1 ring-slate-800/80 group-hover:bg-blue-600 transition-all duration-150 group-hover:scale-105">
                Z
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight group-hover:text-blue-600 transition-colors font-mono">
                    Z-WBE BOTTLENECK LAB
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold px-1 py-0.5 rounded bg-slate-100 border border-slate-200/60 hidden sm:inline">
                    v1.0
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block leading-tight">
                  Change the assumptions. See what breaks first.
                </p>
              </div>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            {/* Single-line GTC 2026 Golden Ticket Badge */}
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 whitespace-nowrap shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>GTC 2026 Golden Ticket</span>
            </span>
          </div>

          {/* Centered Segmented Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Status Cluster & Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Deterministic Engine Latency */}
            <div className="hidden xl:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs" title="Deterministic Math Pipeline Latency">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-slate-700">Engine:</span>
              <span className="text-emerald-600 font-bold">&lt;1ms</span>
            </div>

            {/* AI Model Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-900">Nemotron 3 Super</span>
            </div>

            {/* Cloud Run Host Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 font-semibold shadow-2xs">
              <Cloud className="w-3 h-3 text-emerald-600" />
              <span>Cloud Run</span>
            </div>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/zhane/z-wbe-bottleneck-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors shadow-2xs flex items-center justify-center"
              title="View Source on GitHub"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Strip */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-200/70 bg-white/95 px-2 py-1.5 overflow-x-auto shadow-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

