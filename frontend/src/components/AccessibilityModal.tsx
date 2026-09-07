import React from 'react';
import {
  X,
  Eye,
  Type,
  Maximize2,
  MousePointer,
  RotateCcw,
  Volume2,
  Sliders,
  Sparkles,
  Check,
  Keyboard
} from 'lucide-react';
import { useAccessibility, FontSizeOption } from '../context/AccessibilityContext';

export const AccessibilityModal: React.FC = () => {
  const {
    settings,
    updateSetting,
    resetSettings,
    announce,
    isModalOpen,
    closeModal
  } = useAccessibility();

  if (!isModalOpen) return null;

  const fontOptions: { id: FontSizeOption; label: string; size: string }[] = [
    { id: 'normal', label: 'Default', size: '100%' },
    { id: 'large', label: 'Large (+15%)', size: '115%' },
    { id: 'xl', label: 'Extra Large (+30%)', size: '130%' },
  ];

  const handleToggle = (key: keyof typeof settings, label: string) => {
    const nextVal = !settings[key];
    updateSetting(key, nextVal);
    announce(`${label} ${nextVal ? 'enabled' : 'disabled'}`);
  };

  const handleFontChange = (size: FontSizeOption) => {
    updateSetting('fontSize', size);
    announce(`Font scale set to ${size}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={closeModal} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-lg font-extrabold text-slate-900 font-mono tracking-tight">
                Accessibility & Readability Settings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                WCAG 2.1 AAA enhancements, motor accommodations & keyboard navigation
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close accessibility settings (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-800">
          {/* Section 1: Visual Contrast & Text Size */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Visual Contrast & Text Scaling
            </h3>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="high-contrast-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    High Contrast Mode (WCAG AAA)
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Maximizes text contrast (&gt;7:1), applies distinct 2px solid dark borders, and enhances badge legibility.
                  </p>
                </div>
              </div>
              <button
                id="high-contrast-toggle"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => handleToggle('highContrast', 'High Contrast Mode')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Font Scaling Options */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center space-x-2.5">
                <Type className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-900">Text Scaling</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleFontChange(opt.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      settings.fontSize === opt.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {settings.fontSize === opt.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia-Friendly Typography */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <Type className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="dyslexia-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    Dyslexia-Friendly Typography
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Increases letter-spacing, word-spacing, and applies a clear, heavy-baseline font style.
                  </p>
                </div>
              </div>
              <button
                id="dyslexia-toggle"
                role="switch"
                aria-checked={settings.dyslexiaFont}
                onClick={() => handleToggle('dyslexiaFont', 'Dyslexia Typography')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.dyslexiaFont ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.dyslexiaFont ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Motor, Focus & Movement */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Motor Accessibility & Motion
            </h3>

            {/* Enhanced Focus Rings */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <MousePointer className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="focus-ring-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    High-Visibility Keyboard Focus Rings
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Applies prominent 3px blue outline rings with 2px offset when tabbing through buttons and inputs.
                  </p>
                </div>
              </div>
              <button
                id="focus-ring-toggle"
                role="switch"
                aria-checked={settings.enhancedFocus}
                onClick={() => handleToggle('enhancedFocus', 'High-Visibility Focus Rings')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.enhancedFocus ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.enhancedFocus ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Large Click Targets */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <Maximize2 className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="targets-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    Large Touch & Click Targets (Min 44px)
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Expands hit areas of steppers, tabs, buttons, and switches for tremors or touch device accessibility.
                  </p>
                </div>
              </div>
              <button
                id="targets-toggle"
                role="switch"
                aria-checked={settings.largeTargets}
                onClick={() => handleToggle('largeTargets', 'Large Click Targets')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.largeTargets ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.largeTargets ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Simplified Numeric Inputs */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <Sliders className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="inputs-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    Accessible Number Input Mode
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Shows high-contrast, direct text number input fields to avoid dependence on fine motor slider dragging.
                  </p>
                </div>
              </div>
              <button
                id="inputs-toggle"
                role="switch"
                aria-checked={settings.simplifiedInputs}
                onClick={() => handleToggle('simplifiedInputs', 'Accessible Number Input Mode')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.simplifiedInputs ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.simplifiedInputs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <RotateCcw className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="motion-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    Reduced Motion (Vestibular Safe)
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Disables pulse indicators, smooth meter transitions, and sliding animations.
                  </p>
                </div>
              </div>
              <button
                id="motion-toggle"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() => handleToggle('reducedMotion', 'Reduced Motion')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Screen Reader & Keyboard Guide */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Screen Readers & Keyboard Shortcuts
            </h3>

            {/* Live Announcements Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3 pr-4">
                <Volume2 className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <label htmlFor="announcements-toggle" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    ARIA Live Screen Reader Announcements
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Speaks dominant bottleneck shifts, 100x imaging triggers, and calculation milestones via aria-live=&quot;polite&quot;.
                  </p>
                </div>
              </div>
              <button
                id="announcements-toggle"
                role="switch"
                aria-checked={settings.screenReaderAnnouncements}
                onClick={() => handleToggle('screenReaderAnnouncements', 'Screen Reader Announcements')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  settings.screenReaderAnnouncements ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    settings.screenReaderAnnouncements ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Keyboard Shortcuts Reference Table */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Keyboard className="w-4 h-4 text-slate-600" />
                <span>Global Keyboard Hotkeys</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600">Accessibility Modal</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">Alt + A</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600">100x Hero Demo</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">Alt + H</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600">Explain with Nemotron</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">Alt + E</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                  <span className="text-slate-600">Compare Scenarios</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-800">Alt + C</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/80 shrink-0">
          <button
            onClick={() => {
              resetSettings();
              announce('Accessibility settings reset to default');
            }}
            className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 font-bold cursor-pointer px-3 py-2 rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={closeModal}
            className="px-4.5 py-2.5 bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900 border border-slate-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
