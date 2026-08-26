import { GpThemeManager, GpThemeMode } from './theme';

describe('GpThemeManager', () => {
  beforeEach(() => {
    // Reset custom tokens and reset theme/mode
    GpThemeManager.resetCustomTokens();
  });

  it('should have built-in themes defined', () => {
    const themes = GpThemeManager.getAvailableThemes();
    expect(themes.length).toBeGreaterThanOrEqual(8);
    const ids = themes.map(t => t.id);
    expect(ids).toContain('default');
    expect(ids).toContain('ocean');
    expect(ids).toContain('emerald');
    expect(ids).toContain('sunset');
    expect(ids).toContain('amethyst');
    expect(ids).toContain('rose');
    expect(ids).toContain('nord');
    expect(ids).toContain('cyberpunk');
  });

  it('should set and get theme name', () => {
    GpThemeManager.setTheme('ocean', false);
    expect(GpThemeManager.getThemeName()).toBe('ocean');
    expect(GpThemeManager.getTheme()).toBe('ocean');

    GpThemeManager.setTheme('sunset', false);
    expect(GpThemeManager.getThemeName()).toBe('sunset');
  });

  it('should set and get mode', () => {
    GpThemeManager.setMode('dark', false);
    expect(GpThemeManager.getMode()).toBe('dark');
    expect(GpThemeManager.getActiveMode()).toBe('dark');
    expect(GpThemeManager.isDark()).toBe(true);

    GpThemeManager.setMode('light', false);
    expect(GpThemeManager.getMode()).toBe('light');
    expect(GpThemeManager.getActiveMode()).toBe('light');
    expect(GpThemeManager.isDark()).toBe(false);
  });

  it('should toggle mode correctly', () => {
    GpThemeManager.setMode('light', false);
    const nextMode = GpThemeManager.toggleMode();
    expect(nextMode).toBe('dark');
    expect(GpThemeManager.getActiveMode()).toBe('dark');

    const backToLight = GpThemeManager.toggleMode();
    expect(backToLight).toBe('light');
    expect(GpThemeManager.getActiveMode()).toBe('light');
  });

  it('should support dynamic theme registration', () => {
    GpThemeManager.registerTheme({
      id: 'custom-gold',
      name: 'Custom Gold',
      description: 'Gold themed layout',
      primaryColor: '#eab308',
      lightTokens: {
        '--gp-primary': '#eab308',
        '--gp-surface-ground': '#fefce8'
      },
      darkTokens: {
        '--gp-primary': '#fde047',
        '--gp-surface-ground': '#1a1805'
      }
    });

    const themes = GpThemeManager.getAvailableThemes();
    expect(themes.map(t => t.id)).toContain('custom-gold');

    GpThemeManager.setTheme('custom-gold', false);
    expect(GpThemeManager.getThemeName()).toBe('custom-gold');
  });

  it('should notify state subscribers on change', () => {
    let callCount = 0;
    let lastState: any = null;

    const unsubscribe = GpThemeManager.onChange((state) => {
      callCount++;
      lastState = state;
    });

    expect(callCount).toBe(1); // Immediate initial invocation

    GpThemeManager.setTheme('amethyst', false);
    expect(callCount).toBe(2);
    expect(lastState.theme).toBe('amethyst');

    GpThemeManager.setMode('dark', false);
    expect(callCount).toBe(3);
    expect(lastState.activeMode).toBe('dark');

    unsubscribe();

    GpThemeManager.setTheme('emerald', false);
    expect(callCount).toBe(3); // Should not increase after unsubscribe
  });
});
