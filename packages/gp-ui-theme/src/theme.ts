/**
 * Design Token & Theme Management System for gp-ui
 * Supports JSON / TypeScript token architecture across Primitives, Semantic, and Component layers.
 * Injects compiled theme styles directly into document <head> at runtime.
 */
import {
  GpThemeDefinition,
  GpThemeOverride,
  GpThemeMode,
  GpColorScheme,
  GpThemeMeta,
  GpThemeState,
  GpThemeTokens
} from './tokens/types';
import { builtInThemes, defaultTheme } from './tokens/presets';
import { baseTheme } from './tokens/base-theme';
import { extendTheme, themeToCss } from './tokens/compiler';

export * from './tokens/types';
export * from './tokens/primitives';
export * from './tokens/base-theme';
export * from './tokens/compiler';
export * from './tokens/presets';

export class GpThemeManager {
  private static currentTheme = 'default';
  private static currentMode: GpThemeMode = 'system';
  private static systemDarkQuery: MediaQueryList | null = null;
  private static initialized = false;
  private static listeners: Set<(state: GpThemeState) => void> = new Set();
  private static registeredDefinitions: Map<string, GpThemeDefinition> = new Map();

  /**
   * Built-in themes mapped to metadata
   */
  public static readonly BUILT_IN_THEMES: GpThemeMeta[] = builtInThemes.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    primaryColor: t.light.semantic.primary.main,
    accentColor: t.dark.semantic.primary.main,
    lightSurface: t.light.semantic.surfaces.ground,
    darkSurface: t.dark.semantic.surfaces.ground
  }));

  /**
   * Initializes theme manager, detecting OS system color-scheme preference,
   * injecting theme styles directly into <head>, and listening for real-time OS preference changes.
   */
  public static initSystemTheme(defaultThemeName = 'default', defaultMode: GpThemeMode = 'system'): GpThemeMode {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return 'light';
    }

    // Populate built-in definitions
    builtInThemes.forEach((t) => {
      GpThemeManager.registeredDefinitions.set(t.id, t);
    });

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
      GpThemeManager.currentTheme = defaultThemeName;
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

    // Inject all built-in themes into <head> so sub-trees with data-gp-theme also work
    GpThemeManager.injectAllThemes();

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
   * Legacy alias for getActiveMode
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
   * Returns the current theme name/id (e.g. 'default', 'ocean', 'emerald', etc.)
   */
  public static getThemeName(): string {
    return GpThemeManager.currentTheme;
  }

  /**
   * Backwards compatible theme getter
   */
  public static getTheme(): string {
    return GpThemeManager.currentTheme;
  }

  /**
   * Returns the full JSON / TypeScript theme definition for the current or specified theme ID.
   */
  public static getThemeDefinition(themeId?: string): GpThemeDefinition {
    const id = themeId || GpThemeManager.currentTheme;
    return (
      GpThemeManager.registeredDefinitions.get(id) ||
      builtInThemes.find((t) => t.id === id) ||
      defaultTheme
    );
  }

  /**
   * Returns all registered theme definition objects (built-in + dynamically registered).
   */
  public static getAllThemeDefinitions(): GpThemeDefinition[] {
    const defs: GpThemeDefinition[] = [];
    GpThemeManager.registeredDefinitions.forEach((def) => defs.push(def));
    return defs;
  }

  /**
   * Injects the compiled CSS for a specific theme definition directly into document <head>.
   */
  public static injectTheme(themeOrId: GpThemeDefinition | string): void {
    if (typeof document === 'undefined') return;

    const themeDef =
      typeof themeOrId === 'string'
        ? GpThemeManager.getThemeDefinition(themeOrId)
        : themeOrId;

    let styleEl = document.getElementById(`gp-theme-${themeDef.id}`) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = `gp-theme-${themeDef.id}`;
      styleEl.setAttribute('data-gp-theme-id', themeDef.id);
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = themeToCss(themeDef);
  }

  /**
   * Injects compiled CSS for all registered and built-in themes into document <head>.
   */
  public static injectAllThemes(): void {
    if (typeof document === 'undefined') return;
    GpThemeManager.registeredDefinitions.forEach((def) => {
      GpThemeManager.injectTheme(def);
    });
  }

  /**
   * Sets the active theme by ID or definition and ensures its styles are injected into <head>.
   */
  public static setTheme(theme: string | GpThemeDefinition, persist = true): void {
    if (typeof document === 'undefined') return;

    if (typeof theme === 'object') {
      GpThemeManager.registerTheme(theme);
      GpThemeManager.currentTheme = theme.id;
    } else {
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
    }

    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('gp-theme-name', GpThemeManager.currentTheme);
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
   * Toggles between 'light' and 'dark' mode
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
    const list: GpThemeMeta[] = [];
    GpThemeManager.registeredDefinitions.forEach((def) => {
      list.push({
        id: def.id,
        name: def.name,
        description: def.description || '',
        primaryColor: def.light.semantic.primary.main,
        accentColor: def.dark.semantic.primary.main,
        lightSurface: def.light.semantic.surfaces.ground,
        darkSurface: def.dark.semantic.surfaces.ground
      });
    });
    return list.length > 0 ? list : GpThemeManager.BUILT_IN_THEMES;
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
   * Dynamically registers a custom theme definition (or theme override based on baseTheme) at runtime,
   * compiling and injecting its styles directly into <head>.
   */
  public static registerTheme(themeOrOverride: GpThemeDefinition | GpThemeOverride): GpThemeDefinition {
    // If it's a partial override, extend from baseTheme
    const fullDefinition: GpThemeDefinition =
      'primitives' in themeOrOverride &&
      'light' in themeOrOverride &&
      'dark' in themeOrOverride &&
      (themeOrOverride as any).light?.semantic &&
      (themeOrOverride as any).dark?.semantic
        ? (themeOrOverride as GpThemeDefinition)
        : extendTheme(themeOrOverride as GpThemeOverride, baseTheme);

    GpThemeManager.registeredDefinitions.set(fullDefinition.id, fullDefinition);

    // Compile and inject CSS into DOM <head>
    GpThemeManager.injectTheme(fullDefinition);

    return fullDefinition;
  }

  private static applyDomTheme(): void {
    if (typeof document === 'undefined') return;

    const theme = GpThemeManager.currentTheme;
    const effectiveMode = GpThemeManager.getActiveMode();
    const legacyTheme = effectiveMode === 'dark' ? 'gp-dark' : 'gp-light';

    // Ensure the theme's CSS is injected in <head>
    GpThemeManager.injectTheme(theme);

    const root = document.documentElement;
    root.setAttribute('data-gp-theme', theme);
    root.setAttribute('data-gp-mode', effectiveMode);

    const classesToRemove: string[] = ['gp-light', 'gp-dark'];
    root.classList.forEach((cls) => {
      if (cls.startsWith('gp-theme-')) {
        classesToRemove.push(cls);
      }
    });
    root.classList.remove(...classesToRemove);

    root.classList.add(`gp-theme-${theme}`);
    root.classList.add(legacyTheme);

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
