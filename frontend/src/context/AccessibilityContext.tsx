import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xl';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: FontSizeOption;
  dyslexiaFont: boolean;
  enhancedFocus: boolean;
  largeTargets: boolean;
  reducedMotion: boolean;
  simplifiedInputs: boolean;
  screenReaderAnnouncements: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  announce: (message: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const STORAGE_KEY = 'zwbe_a11y_settings_v1';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  dyslexiaFont: false,
  enhancedFocus: true,
  largeTargets: false,
  reducedMotion: false,
  simplifiedInputs: false,
  screenReaderAnnouncements: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback if localStorage unavailable
    }
    // Check system preferences
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = typeof window !== 'undefined' && window.matchMedia('(prefers-contrast: more)').matches;
    return {
      ...DEFAULT_SETTINGS,
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Persist to localStorage and apply DOM classes to root
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }

    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Font size
    root.classList.remove('a11y-large-text', 'a11y-xl-text');
    if (settings.fontSize === 'large') {
      root.classList.add('a11y-large-text');
    } else if (settings.fontSize === 'xl') {
      root.classList.add('a11y-xl-text');
    }

    // Dyslexia-friendly font & spacing
    if (settings.dyslexiaFont) {
      root.classList.add('a11y-dyslexia');
    } else {
      root.classList.remove('a11y-dyslexia');
    }

    // Enhanced focus rings
    if (settings.enhancedFocus) {
      root.classList.add('a11y-enhanced-focus');
    } else {
      root.classList.remove('a11y-enhanced-focus');
    }

    // Large click/touch targets
    if (settings.largeTargets) {
      root.classList.add('a11y-large-targets');
    } else {
      root.classList.remove('a11y-large-targets');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('a11y-reduced-motion');
    } else {
      root.classList.remove('a11y-reduced-motion');
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const announce = useCallback((message: string) => {
    if (!settings.screenReaderAnnouncements) return;
    setLiveAnnouncement(message);
    // Clear after timeout so subsequent identical messages re-announce
    setTimeout(() => {
      setLiveAnnouncement('');
    }, 4000);
  }, [settings.screenReaderAnnouncements]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Global keyboard shortcuts (Alt+A for Accessibility, Esc to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        announce,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
      {/* Live Region for Screen Readers */}
      <div
        id="a11y-live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
