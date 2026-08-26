/**
 * Design Token Presets for gp-ui
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

export type GpThemeMode = 'gp-light' | 'gp-dark' | 'system';

export class GpThemeManager {
  private static currentTheme: GpThemeMode = 'system';
  private static systemDarkQuery: MediaQueryList | null = null;
  private static initialized = false;

  /**
   * Initializes theme manager, detecting OS system color-scheme preference
   * and listening for real-time OS preference changes.
   */
  public static initSystemTheme(): GpThemeMode {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'gp-light';
    }

    if (GpThemeManager.initialized) {
      return GpThemeManager.getActiveTheme();
    }

    GpThemeManager.systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for OS theme changes
    GpThemeManager.systemDarkQuery.addEventListener('change', (e) => {
      if (GpThemeManager.currentTheme === 'system') {
        GpThemeManager.applyDomTheme(e.matches ? 'gp-dark' : 'gp-light');
      }
    });

    // Check stored user override, else fallback to system
    const savedTheme = localStorage.getItem('gp-theme-preference') as GpThemeMode | null;
    if (savedTheme === 'gp-light' || savedTheme === 'gp-dark') {
      GpThemeManager.setTheme(savedTheme, false);
    } else {
      GpThemeManager.setTheme('system', false);
    }

    GpThemeManager.initialized = true;
    return GpThemeManager.getActiveTheme();
  }

  /**
   * Returns true if system preference is currently dark mode
   */
  public static isSystemDark(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Returns the effective active theme ('gp-dark' or 'gp-light')
   */
  public static getActiveTheme(): 'gp-light' | 'gp-dark' {
    if (GpThemeManager.currentTheme === 'system') {
      return GpThemeManager.isSystemDark() ? 'gp-dark' : 'gp-light';
    }
    return GpThemeManager.currentTheme === 'gp-dark' ? 'gp-dark' : 'gp-light';
  }

  /**
   * Sets the theme mode ('gp-light', 'gp-dark', or 'system')
   */
  public static setTheme(theme: GpThemeMode, persist = true): void {
    if (typeof document === 'undefined') return;

    GpThemeManager.currentTheme = theme;
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp-theme-preference', theme);
    }

    const effectiveTheme = theme === 'system'
      ? (GpThemeManager.isSystemDark() ? 'gp-dark' : 'gp-light')
      : theme;

    GpThemeManager.applyDomTheme(effectiveTheme);
  }

  private static applyDomTheme(theme: 'gp-light' | 'gp-dark'): void {
    const root = document.documentElement;
    root.classList.remove('gp-light', 'gp-dark');
    root.classList.add(theme);
    root.setAttribute('data-gp-theme', theme);
  }

  public static getTheme(): GpThemeMode {
    return GpThemeManager.currentTheme;
  }

  public static toggleTheme(): 'gp-light' | 'gp-dark' {
    const current = GpThemeManager.getActiveTheme();
    const next = current === 'gp-light' ? 'gp-dark' : 'gp-light';
    GpThemeManager.setTheme(next, true);
    return next;
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
    props.forEach(p => style.removeProperty(p));
  }
}
