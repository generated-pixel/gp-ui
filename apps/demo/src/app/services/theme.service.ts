import { Injectable, signal } from '@angular/core';

export type DemoThemeMode = 'light' | 'dark' | 'system';

export interface DemoThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  description: string;
}

export const DEMO_THEMES: DemoThemeOption[] = [
  { id: 'default', name: 'Default', primaryColor: '#4f46e5', description: 'Indigo & Slate foundation' },
  { id: 'ocean', name: 'Ocean', primaryColor: '#0891b2', description: 'Deep Azure & Cyan' },
  { id: 'emerald', name: 'Emerald', primaryColor: '#059669', description: 'Lush Emerald & Forest Teal' },
  { id: 'sunset', name: 'Sunset', primaryColor: '#ea580c', description: 'Warm Amber & Rose' },
  { id: 'amethyst', name: 'Amethyst', primaryColor: '#9333ea', description: 'Vibrant Violet & Purple' },
  { id: 'rose', name: 'Rose', primaryColor: '#e11d48', description: 'Bold Crimson & Berry' },
  { id: 'nord', name: 'Nord', primaryColor: '#5e81ac', description: 'Cool Arctic Blue & Slate' },
  { id: 'cyberpunk', name: 'Cyberpunk', primaryColor: '#f43f5e', description: 'High-contrast Neon & Gold' },
];

@Injectable({ providedIn: 'root' })
export class DemoThemeService {
  readonly currentTheme = signal<string>('default');
  readonly currentMode = signal<DemoThemeMode>('light');
  readonly isDark = signal<boolean>(false);

  private mediaQuery: MediaQueryList | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const savedTheme = localStorage.getItem('gp-theme') || 'default';
    const savedMode = (localStorage.getItem('gp-mode') as DemoThemeMode) || 'light';

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', () => {
      if (this.currentMode() === 'system') {
        this.applyThemeToDom();
      }
    });

    this.currentTheme.set(savedTheme);
    this.currentMode.set(savedMode);
    this.applyThemeToDom();
  }

  setTheme(themeId: string): void {
    this.currentTheme.set(themeId);
    try {
      localStorage.setItem('gp-theme', themeId);
    } catch {}
    this.applyThemeToDom();
  }

  setMode(mode: DemoThemeMode): void {
    this.currentMode.set(mode);
    try {
      localStorage.setItem('gp-mode', mode);
    } catch {}
    this.applyThemeToDom();
  }

  toggleMode(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.setMode(next);
  }

  private applyThemeToDom(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const theme = this.currentTheme();
    const mode = this.currentMode();

    let effectiveDark = false;
    if (mode === 'dark') {
      effectiveDark = true;
    } else if (mode === 'light') {
      effectiveDark = false;
    } else if (this.mediaQuery) {
      effectiveDark = this.mediaQuery.matches;
    }

    this.isDark.set(effectiveDark);

    // Apply data attributes according to gp-ui-theme specification
    root.setAttribute('data-gp-theme', theme);
    root.setAttribute('data-gp-mode', effectiveDark ? 'dark' : 'light');

    // Remove legacy theme/mode classes
    Array.from(root.classList).forEach((cls) => {
      if (cls.startsWith('gp-theme-') || cls === 'gp-dark' || cls === 'gp-light') {
        root.classList.remove(cls);
      }
    });

    // Add current theme/mode classes
    root.classList.add(`gp-theme-${theme}`);
    root.classList.add(effectiveDark ? 'gp-dark' : 'gp-light');
  }
}
