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

export type GpThemeMode = 'gp-light' | 'gp-dark' | string;

export class GpThemeManager {
  private static currentTheme: GpThemeMode = 'gp-light';

  public static setTheme(theme: GpThemeMode): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('gp-light', 'gp-dark');
    root.classList.add(theme);
    root.setAttribute('data-gp-theme', theme);
    GpThemeManager.currentTheme = theme;
  }

  public static getTheme(): GpThemeMode {
    return GpThemeManager.currentTheme;
  }

  public static toggleTheme(): GpThemeMode {
    const next = GpThemeManager.currentTheme === 'gp-light' ? 'gp-dark' : 'gp-light';
    GpThemeManager.setTheme(next);
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
