/**
 * Design Token & Theme Management System for gp-ui
 * Supports multi-theme architecture where every theme includes both Light & Dark modes.
 */

export interface GpThemeTokens {
  primaryColor?: string;
  primaryHover?: string;
  primaryActive?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  surfaceGround?: string;
  surfaceCard?: string;
  textColor?: string;
}

export type GpThemeMode = 'light' | 'dark' | 'system' | 'gp-light' | 'gp-dark';

export interface GpThemeMeta {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  lightSurface: string;
  darkSurface: string;
}

export interface GpThemeState {
  theme: string;
  mode: GpThemeMode;
  activeMode: 'light' | 'dark';
  isDark: boolean;
}

export interface GpCustomThemeDefinition {
  id: string;
  name: string;
  description?: string;
  primaryColor?: string;
  accentColor?: string;
  lightTokens: Record<string, string>;
  darkTokens: Record<string, string>;
}

export class GpThemeManager {
  private static currentTheme = 'default';
  private static currentMode: GpThemeMode = 'system';
  private static systemDarkQuery: MediaQueryList | null = null;
  private static initialized = false;
  private static listeners: Set<(state: GpThemeState) => void> = new Set();
  private static customThemes: Map<string, GpThemeMeta> = new Map();

  public static readonly BUILT_IN_THEMES: GpThemeMeta[] = [
    {
      id: 'default',
      name: 'Default (Indigo & Slate)',
      description: 'Clean, modern enterprise styling with deep indigo accents.',
      primaryColor: '#6366f1',
      accentColor: '#818cf8',
      lightSurface: '#f8fafc',
      darkSurface: '#0b0f19'
    },
    {
      id: 'ocean',
      name: 'Ocean (Azure & Cyan)',
      description: 'Vibrant oceanic palette with refreshing cyan and deep azure hues.',
      primaryColor: '#0891b2',
      accentColor: '#22d3ee',
      lightSurface: '#f0f9ff',
      darkSurface: '#03131e'
    },
    {
      id: 'emerald',
      name: 'Emerald (Forest & Mint)',
      description: 'Natural forest green tones with crisp mint highlights.',
      primaryColor: '#059669',
      accentColor: '#34d399',
      lightSurface: '#f6fbf8',
      darkSurface: '#021a14'
    },
    {
      id: 'sunset',
      name: 'Sunset (Amber & Coral)',
      description: 'Warm golden sunset tones with energetic amber & coral accents.',
      primaryColor: '#d97706',
      accentColor: '#fbbf24',
      lightSurface: '#fffdfa',
      darkSurface: '#1c0f06'
    },
    {
      id: 'amethyst',
      name: 'Amethyst (Royal Violet)',
      description: 'Sophisticated luxury royal violet & lavender accents.',
      primaryColor: '#9333ea',
      accentColor: '#c084fc',
      lightSurface: '#faf7fd',
      darkSurface: '#140824'
    },
    {
      id: 'rose',
      name: 'Rose (Ruby & Rose)',
      description: 'Modern and energetic pink ruby with refined rose accents.',
      primaryColor: '#e11d48',
      accentColor: '#fb7185',
      lightSurface: '#fffafa',
      darkSurface: '#1c050c'
    },
    {
      id: 'nord',
      name: 'Nord (Arctic & Frost)',
      description: 'Arctic ice tones with cool muted polar slate surfaces.',
      primaryColor: '#0d9488',
      accentColor: '#88c0d0',
      lightSurface: '#eceff4',
      darkSurface: '#242933'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk (Neon Amber & Cyan)',
      description: 'High-contrast tech palette with luminous neon amber and cyan in obsidian space.',
      primaryColor: '#ca8a04',
      accentColor: '#facc15',
      lightSurface: '#f8fafc',
      darkSurface: '#07070a'
    }
  ];

  /**
   * Initializes theme manager, detecting OS system color-scheme preference
   * and listening for real-time OS preference changes.
   */
  public static initSystemTheme(defaultTheme = 'default', defaultMode: GpThemeMode = 'system'): GpThemeMode {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'light';
    }

    if (GpThemeManager.initialized) {
      return GpThemeManager.getActiveMode();
    }

    // Set up OS dark mode query
    GpThemeManager.systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    GpThemeManager.systemDarkQuery.addEventListener('change', () => {
      if (GpThemeManager.currentMode === 'system') {
        GpThemeManager.applyDomTheme();
      }
    });

    // Check stored theme name
    const savedTheme = localStorage.getItem('gp-theme-name');
    if (savedTheme) {
      GpThemeManager.currentTheme = savedTheme;
    } else {
      GpThemeManager.currentTheme = defaultTheme;
    }

    // Check stored mode preference (with fallback for legacy 'gp-theme-preference')
    const savedMode = localStorage.getItem('gp-theme-mode') as GpThemeMode | null;
    const legacyMode = localStorage.getItem('gp-theme-preference');

    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
      GpThemeManager.currentMode = savedMode;
    } else if (legacyMode === 'gp-dark') {
      GpThemeManager.currentMode = 'dark';
    } else if (legacyMode === 'gp-light') {
      GpThemeManager.currentMode = 'light';
    } else {
      GpThemeManager.currentMode = defaultMode;
    }

    GpThemeManager.applyDomTheme();
    GpThemeManager.initialized = true;

    return GpThemeManager.getActiveMode();
  }

  /**
   * Returns true if system preference is currently dark mode
   */
  public static isSystemDark(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Returns the effective active color mode ('light' or 'dark')
   */
  public static getActiveMode(): 'light' | 'dark' {
    if (GpThemeManager.currentMode === 'system') {
      return GpThemeManager.isSystemDark() ? 'dark' : 'light';
    }
    return GpThemeManager.currentMode === 'dark' || GpThemeManager.currentMode === 'gp-dark' ? 'dark' : 'light';
  }

  /**
   * Alias for getActiveMode, or returns active theme name if called for legacy theme checks
   */
  public static getActiveTheme(): 'gp-light' | 'gp-dark' {
    return GpThemeManager.getActiveMode() === 'dark' ? 'gp-dark' : 'gp-light';
  }

  /**
   * Returns true if current active mode is dark
   */
  public static isDark(): boolean {
    return GpThemeManager.getActiveMode() === 'dark';
  }

  /**
   * Returns the current theme name (e.g. 'default', 'ocean', 'emerald', etc.)
   */
  public static getThemeName(): string {
    return GpThemeManager.currentTheme;
  }

  /**
   * Backwards compatible theme getter.
   */
  public static getTheme(): string {
    return GpThemeManager.currentTheme;
  }

  /**
   * Sets the theme name (e.g. 'default', 'ocean', 'emerald', etc.)
   * Also supports legacy mode strings ('gp-light', 'gp-dark', 'system') for full backwards compatibility.
   */
  public static setTheme(theme: string, persist = true): void {
    if (typeof document === 'undefined') return;

    if (theme === 'gp-light') {
      GpThemeManager.setMode('light', persist);
      return;
    }
    if (theme === 'gp-dark') {
      GpThemeManager.setMode('dark', persist);
      return;
    }
    if (theme === 'system') {
      GpThemeManager.setMode('system', persist);
      return;
    }

    GpThemeManager.currentTheme = theme;
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp-theme-name', theme);
    }

    GpThemeManager.applyDomTheme();
  }

  /**
   * Sets the color mode ('light', 'dark', or 'system')
   */
  public static setMode(mode: GpThemeMode, persist = true): void {
    if (typeof document === 'undefined') return;

    const normalizedMode: GpThemeMode =
      mode === 'gp-dark' ? 'dark' : mode === 'gp-light' ? 'light' : mode;

    GpThemeManager.currentMode = normalizedMode;
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp-theme-mode', normalizedMode);
      // Legacy key compatibility
      localStorage.setItem('gp-theme-preference', normalizedMode === 'system' ? 'system' : `gp-${normalizedMode}`);
    }

    GpThemeManager.applyDomTheme();
  }

  /**
   * Returns the configured mode setting ('light', 'dark', or 'system')
   */
  public static getMode(): GpThemeMode {
    return GpThemeManager.currentMode;
  }

  /**
   * Toggles between 'light' and 'dark' mode while preserving current theme
   */
  public static toggleMode(): 'light' | 'dark' {
    const current = GpThemeManager.getActiveMode();
    const next: GpThemeMode = current === 'light' ? 'dark' : 'light';
    GpThemeManager.setMode(next, true);
    return next;
  }

  /**
   * Backwards compatible theme toggle (toggles light/dark mode)
   */
  public static toggleTheme(): 'gp-light' | 'gp-dark' {
    const next = GpThemeManager.toggleMode();
    return next === 'dark' ? 'gp-dark' : 'gp-light';
  }

  /**
   * Returns metadata for all available themes (built-in + dynamically registered)
   */
  public static getAvailableThemes(): GpThemeMeta[] {
    const list = [...GpThemeManager.BUILT_IN_THEMES];
    GpThemeManager.customThemes.forEach((meta) => {
      list.push(meta);
    });
    return list;
  }

  /**
   * Returns current snapshot of theme state
   */
  public static getState(): GpThemeState {
    const activeMode = GpThemeManager.getActiveMode();
    return {
      theme: GpThemeManager.currentTheme,
      mode: GpThemeManager.currentMode,
      activeMode,
      isDark: activeMode === 'dark'
    };
  }

  /**
   * Subscribes to theme / mode changes
   */
  public static onChange(listener: (state: GpThemeState) => void): () => void {
    GpThemeManager.listeners.add(listener);
    listener(GpThemeManager.getState());
    return () => {
      GpThemeManager.listeners.delete(listener);
    };
  }

  /**
   * Dynamically registers a custom theme definition at runtime.
   */
  public static registerTheme(def: GpCustomThemeDefinition): void {
    const meta: GpThemeMeta = {
      id: def.id,
      name: def.name,
      description: def.description || 'Custom User Theme',
      primaryColor: def.primaryColor || def.lightTokens['--gp-primary'] || '#6366f1',
      accentColor: def.accentColor || def.darkTokens['--gp-primary'] || '#818cf8',
      lightSurface: def.lightTokens['--gp-surface-ground'] || '#f8fafc',
      darkSurface: def.darkTokens['--gp-surface-ground'] || '#0b0f19'
    };

    GpThemeManager.customThemes.set(def.id, meta);

    if (typeof document !== 'undefined') {
      let styleEl = document.getElementById('gp-custom-themes') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'gp-custom-themes';
        document.head.appendChild(styleEl);
      }

      const lightCss = Object.entries(def.lightTokens)
        .map(([k, v]) => `  ${k.startsWith('--gp-') ? k : `--gp-${k}`}: ${v};`)
        .join('\n');

      const darkCss = Object.entries(def.darkTokens)
        .map(([k, v]) => `  ${k.startsWith('--gp-') ? k : `--gp-${k}`}: ${v};`)
        .join('\n');

      const rules = `
/* Custom Theme: ${def.name} (Light) */
:root[data-gp-theme="${def.id}"],
[data-gp-theme="${def.id}"],
[data-gp-theme="${def.id}"][data-gp-mode="light"],
.gp-theme-${def.id},
.gp-theme-${def.id}.gp-light {
${lightCss}
}

/* Custom Theme: ${def.name} (Dark) */
:root[data-gp-theme="${def.id}"][data-gp-mode="dark"],
[data-gp-theme="${def.id}"][data-gp-mode="dark"],
.gp-theme-${def.id}.gp-dark,
[data-gp-theme="${def.id}"].gp-dark {
${darkCss}
}
`;
      styleEl.textContent += rules;
    }
  }

  private static applyDomTheme(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const theme = GpThemeManager.currentTheme;
    const effectiveMode = GpThemeManager.getActiveMode();
    const legacyTheme = effectiveMode === 'dark' ? 'gp-dark' : 'gp-light';

    // Set dataset attributes
    root.setAttribute('data-gp-theme', theme);
    root.setAttribute('data-gp-mode', effectiveMode);

    // Remove legacy classes and existing gp-theme-* classes
    const classesToRemove: string[] = ['gp-light', 'gp-dark'];
    root.classList.forEach((cls) => {
      if (cls.startsWith('gp-theme-')) {
        classesToRemove.push(cls);
      }
    });
    root.classList.remove(...classesToRemove);

    // Add updated classes
    root.classList.add(`gp-theme-${theme}`);
    root.classList.add(legacyTheme);

    // Notify listeners
    const state = GpThemeManager.getState();
    GpThemeManager.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in theme listener:', err);
      }
    });
  }

  public static setCustomToken(name: string, value: string): void {
    if (typeof document === 'undefined') return;
    const varName = name.startsWith('--gp-') ? name : `--gp-${name}`;
    document.documentElement.style.setProperty(varName, value);
  }

  public static setCustomTokens(tokens: Record<string, string>): void {
    Object.entries(tokens).forEach(([key, val]) => {
      GpThemeManager.setCustomToken(key, val);
    });
  }

  public static resetCustomTokens(): void {
    if (typeof document === 'undefined') return;
    const style = document.documentElement.style;
    const props: string[] = [];
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--gp-')) {
        props.push(prop);
      }
    }
    props.forEach((p) => style.removeProperty(p));
  }
}
