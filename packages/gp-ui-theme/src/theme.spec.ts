import {
  GpThemeManager,
  baseTheme,
  extendTheme,
  modeTokensToCssVars,
  themeToCss,
  defaultTheme,
  oceanTheme,
  emeraldTheme,
  sunsetTheme,
  amethystTheme,
  roseTheme,
  nordTheme,
  cyberpunkTheme,
  defaultPrimitives
} from './index';

describe('TypeScript & JSON Theme Architecture', () => {
  beforeEach(() => {
    GpThemeManager.resetCustomTokens();
  });

  describe('baseTheme structure', () => {
    it('should have complete primitives defined', () => {
      expect(baseTheme.primitives).toBeDefined();
      expect(baseTheme.primitives.colors.indigo[500]).toBe('#6366f1');
      expect(baseTheme.primitives.typography.fontSize.base).toBe('1rem');
      expect(baseTheme.primitives.borderRadius.base).toBe('6px');
      expect(baseTheme.primitives.transitions.duration.normal).toBe('150ms');
    });

    it('should have complete light and dark semantic tokens', () => {
      expect(baseTheme.light.semantic.primary.main).toBe('#4f46e5');
      expect(baseTheme.light.semantic.surfaces.ground).toBe('#f8fafc');
      expect(baseTheme.light.semantic.text.primary).toBe('#1e293b');

      expect(baseTheme.dark.semantic.primary.main).toBe('#818cf8');
      expect(baseTheme.dark.semantic.surfaces.ground).toBe('#0b0f19');
      expect(baseTheme.dark.semantic.text.primary).toBe('#f8fafc');
    });

    it('should have component styles for light and dark', () => {
      expect(baseTheme.light.components?.button?.height).toBe('2.5rem');
      expect(baseTheme.light.components?.input?.bg).toBe('#ffffff');

      expect(baseTheme.dark.components?.button?.height).toBe('2.5rem');
      expect(baseTheme.dark.components?.input?.bg).toBe('#0f172a');
    });
  });

  describe('extendTheme', () => {
    it('should create a new theme by overriding only specific tokens and inheriting the rest', () => {
      const customTheme = extendTheme({
        id: 'gold-custom',
        name: 'Gold Custom',
        light: {
          semantic: {
            primary: {
              main: '#eab308',
              text: '#000000',
              hover: '#ca8a04',
              active: '#a16207',
              light: '#fef9c3'
            }
          }
        },
        dark: {
          semantic: {
            primary: {
              main: '#fde047',
              text: '#000000',
              hover: '#fef08a',
              active: '#fef9c3',
              light: 'rgba(234, 179, 8, 0.2)'
            }
          }
        }
      });

      expect(customTheme.id).toBe('gold-custom');
      expect(customTheme.name).toBe('Gold Custom');
      // Overridden tokens
      expect(customTheme.light.semantic.primary.main).toBe('#eab308');
      expect(customTheme.dark.semantic.primary.main).toBe('#fde047');
      // Inherited tokens from baseTheme
      expect(customTheme.light.semantic.surfaces.ground).toBe(baseTheme.light.semantic.surfaces.ground);
      expect(customTheme.dark.semantic.surfaces.ground).toBe(baseTheme.dark.semantic.surfaces.ground);
      expect(customTheme.primitives.typography.fontSize.base).toBe('1rem');
      expect(customTheme.light.components?.button?.height).toBe('2.5rem');
    });
  });

  describe('CSS Compiler', () => {
    it('should convert theme tokens to CSS variable map', () => {
      const lightVars = modeTokensToCssVars(defaultTheme, 'light');
      expect(lightVars['--gp-primary']).toBe('#4f46e5');
      expect(lightVars['--gp-surface-ground']).toBe('#f8fafc');
      expect(lightVars['--gp-text-color']).toBe('#1e293b');
      expect(lightVars['--gp-button-height']).toBe('2.5rem');
      expect(lightVars['--gp-input-bg']).toBe('#ffffff');
      expect(lightVars['--gp-autocomplete-dropdown-width']).toBe('2.25rem');
      expect(lightVars['--gp-autocomplete-dropdown-background']).toBe('#f1f5f9');
      expect(lightVars['--gp-dialog-header-font-size']).toBe('1.25rem');
      expect(lightVars['--gp-table-header-background']).toBe('#f8fafc');

      const darkVars = modeTokensToCssVars(defaultTheme, 'dark');
      expect(darkVars['--gp-primary']).toBe('#818cf8');
      expect(darkVars['--gp-surface-ground']).toBe('#0b0f19');
      expect(darkVars['--gp-text-color']).toBe('#f8fafc');
      expect(darkVars['--gp-input-bg']).toBe('#0f172a');
      expect(darkVars['--gp-autocomplete-dropdown-background']).toBe('#1e293b');
      expect(darkVars['--gp-dialog-background']).toBe('#1e293b');
      expect(darkVars['--gp-table-header-background']).toBe('#111827');
    });

    it('should generate complete CSS rules with selector scoping and dark mode media queries', () => {
      const css = themeToCss(oceanTheme);
      expect(css).toContain('data-gp-theme="ocean"');
      expect(css).toContain('data-gp-mode="light"');
      expect(css).toContain('data-gp-mode="dark"');
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('--gp-primary: #0891b2;');
      expect(css).toContain('--gp-primary: #22d3ee;');
    });
  });

  describe('Theme Presets', () => {
    it('should include all 8 built-in themes created via extendTheme', () => {
      const presets = [
        defaultTheme,
        oceanTheme,
        emeraldTheme,
        sunsetTheme,
        amethystTheme,
        roseTheme,
        nordTheme,
        cyberpunkTheme
      ];

      expect(presets.length).toBe(8);
      presets.forEach((p) => {
        expect(p.id).toBeDefined();
        expect(p.name).toBeDefined();
        expect(p.light.semantic.primary.main).toBeDefined();
        expect(p.dark.semantic.primary.main).toBeDefined();
        expect(p.light.semantic.surfaces.ground).toBeDefined();
        expect(p.dark.semantic.surfaces.ground).toBeDefined();
      });
    });
  });

  describe('GpThemeManager Integration', () => {
    it('should return complete theme definition objects', () => {
      GpThemeManager.initSystemTheme();
      const def = GpThemeManager.getThemeDefinition('ocean');
      expect(def.id).toBe('ocean');
      expect(def.light.semantic.primary.main).toBe('#0891b2');
    });

    it('should dynamically register and apply custom themes at runtime', () => {
      const registered = GpThemeManager.registerTheme({
        id: 'runtime-emerald',
        name: 'Runtime Emerald',
        light: {
          semantic: {
            primary: {
              main: '#10b981',
              text: '#ffffff',
              hover: '#059669',
              active: '#047857',
              light: '#ecfdf5'
            }
          }
        },
        dark: {
          semantic: {
            primary: {
              main: '#34d399',
              text: '#022c22',
              hover: '#6ee7b7',
              active: '#a7f3d0',
              light: 'rgba(16, 185, 129, 0.2)'
            }
          }
        }
      });

      expect(registered.id).toBe('runtime-emerald');
      GpThemeManager.setTheme('runtime-emerald', false);
      expect(GpThemeManager.getThemeName()).toBe('runtime-emerald');

      const retrieved = GpThemeManager.getThemeDefinition('runtime-emerald');
      expect(retrieved.light.semantic.primary.main).toBe('#10b981');
      // Inherited from baseTheme
      expect(retrieved.light.components?.button?.height).toBe('2.5rem');
    });

    it('should switch mode and notify subscribers', () => {
      let stateSnapshot: any = null;
      const unsub = GpThemeManager.onChange((s) => {
        stateSnapshot = s;
      });

      GpThemeManager.setTheme('sunset', false);
      expect(stateSnapshot.theme).toBe('sunset');

      GpThemeManager.setMode('dark', false);
      expect(stateSnapshot.activeMode).toBe('dark');
      expect(stateSnapshot.isDark).toBe(true);

      GpThemeManager.toggleMode();
      expect(stateSnapshot.activeMode).toBe('light');
      expect(stateSnapshot.isDark).toBe(false);

      unsub();
    });
  });
});
