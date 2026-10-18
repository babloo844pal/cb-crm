'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = false, className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateThemeState = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    updateThemeState();

    window.addEventListener('theme-change', updateThemeState);
    return () => window.removeEventListener('theme-change', updateThemeState);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    }

    window.dispatchEvent(new Event('theme-change'));
  };

  if (!mounted) {
    return (
      <div className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#E2E8F0] ${className}`}>
        <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`min-h-[44px] flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
        isDark
          ? 'bg-[#1E293B] text-amber-300 border-[#334155] hover:bg-[#334155] hover:text-amber-200'
          : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#1E293B]'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#2563EB] shrink-0 transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && (
        <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
      )}
    </button>
  );
};
