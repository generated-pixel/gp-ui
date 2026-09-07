import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  GpButton,
  GpInputText,
  GpSwitch,
  GpSlider,
  GpColorPicker,
  GpBadge,
  GpTag,
  GpProgressBar,
  GpThemeScopeDirective
} from 'gp-ui';
import {
  GpThemeManager,
  GpThemeMeta,
  GpThemeMode,
  exportToW3C,
  exportToUtilityConfig,
  exportToCssVariables,
  evaluateContrast
} from 'gp-ui-theme';
import { GpIcon } from 'gp-ui-icons';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';

import { ThemeEditor } from './theme-editor';
import { ThemeEditorService } from './theme-editor.service';

@Component({
  selector: 'app-theming-page',
  standalone: true,
  imports: [
    FormsModule,
    GpButton,
    GpInputText,
    GpSwitch,
    GpSlider,
    GpColorPicker,
    GpBadge,
    GpTag,
    GpProgressBar,
    GpThemeScopeDirective,
    GpIcon,
    DocCode,
    DocApiTable,
    ThemeEditor
  ],
  templateUrl: './theming.html',
  styleUrl: './theming.scss'
})
export class ThemingPage implements OnInit, OnDestroy {
  protected activeThemeId = signal<string>('default');
  protected currentMode = signal<GpThemeMode>('system');
  protected isDarkMode = signal<boolean>(false);
  protected primaryColor = signal<string>('#6366f1');
  protected borderRadius = signal<number>(6);
  protected themes = signal<GpThemeMeta[]>(GpThemeManager.getAvailableThemes());

  newThemeName = 'Neon Lime';
  newThemePrimary = '#84cc16';
  newThemeDarkBg = '#0d1a04';

  private unsubscribeThemeListener: (() => void) | null = null;

  brandPalette = [
    '#6366f1',
    '#3b82f6',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
    '#64748b'
  ];

  installationCode = `npm install @generatedpixel/gp-ui-theme

# Optional companion packages
npm install @generatedpixel/gp-ui @generatedpixel/gp-css @generatedpixel/gp-ui-icons`;

  themeScopeCode = `<!-- Localized Scoped Sub-Themes -->
<div [gpThemeScope]="'cyberpunk'" mode="dark">
  <h3>Dark Cyberpunk Scope</h3>
  <gp-button label="Cyberpunk Button" />
</div>

<div [gpThemeScope]="'high-contrast-dark'" mode="dark">
  <h3>WCAG AAA High Contrast Scope</h3>
  <gp-button label="AAA Button" />
</div>`;

  startupCode = `import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

// Call once during browser application startup.
GpThemeManager.initSystemTheme('default', 'system');

GpThemeManager.setTheme('ocean');
GpThemeManager.setMode('dark');

// Temporary changes do not update localStorage.
GpThemeManager.setMode('light', false);`;

  cssVariablesCode = `.dashboard-card {
  background: var(--gp-surface-card);
  border: 1px solid var(--gp-surface-border);
  border-radius: var(--gp-border-radius-lg);
  color: var(--gp-text-color);
  box-shadow: var(--gp-shadow-md);
}

.dashboard-card:focus-visible {
  box-shadow: var(--gp-focus-ring);
}`;

  aliasCode = `const compactTheme = extendTheme({
  id: 'compact',
  name: 'Compact',
  light: {
    components: {
      card: {
        bg: '{semantic.surfaces.card}',
        borderRadius: '{primitives.borderRadius.sm}'
      }
    }
  },
  dark: {
    components: {
      card: {
        bg: '{semantic.surfaces.card}',
        borderRadius: '{primitives.borderRadius.sm}'
      }
    }
  }
});`;

  runtimeBehavior: DocApiProperty[] = [
    {
      name: 'Persistence',
      type: 'localStorage',
      description: 'setTheme and setMode persist by default under gp-theme-name and gp-theme-mode.'
    },
    {
      name: 'State subscription',
      type: 'onChange(listener)',
      description: 'Immediately receives the current state and returns an unsubscribe function.'
    },
    {
      name: 'Scoped themes',
      type: 'data attributes',
      description: 'Set data-gp-theme and data-gp-mode together on a subtree for previews or embedded surfaces.'
    },
    {
      name: 'Server rendering',
      type: 'browser guard',
      description:
        'The manager does not access window, document, or localStorage on the server; initialize it after hydration.'
    },
    {
      name: 'Token flattening',
      type: '--gp-*',
      description: 'components.dialog.header.fontSize becomes --gp-dialog-header-font-size.'
    }
  ];

  gpCssImportCode = `// 1. Core global reset, layout utilities, animations & ripple effects
@import '@generatedpixel/gp-ui-theme/src/index.css';

// 2. Default light & dark themes (or import all built-in themes)
@import '@generatedpixel/gp-ui-theme/src/themes/default.css';
// @import '@generatedpixel/gp-ui-theme/src/themes/all.css'; // Includes ocean, emerald, sunset, etc.`;

  extendThemeCode = `import { baseTheme, extendTheme, GpThemeManager } from '@generatedpixel/gp-ui-theme';

// 1. Create a custom theme by extending the master baseTheme
export const brandCustomTheme = extendTheme({
  id: 'brand-crimson',
  name: 'Brand Crimson',
  description: 'Corporate crimson branding with custom dark mode surfaces',
  light: {
    semantic: {
      primary: {
        main: '#be123c',
        text: '#ffffff',
        hover: '#9f1239',
        active: '#881337',
        light: '#fff1f2'
      },
      surfaces: {
        ground: '#fffafb',
        card: '#ffffff'
      }
    },
    components: {
      button: {
        borderRadius: '8px'
      }
    }
  },
  dark: {
    semantic: {
      primary: {
        main: '#fb7185',
        text: '#4c0519',
        hover: '#fda4af',
        active: '#fecdd3',
        light: 'rgba(244, 63, 94, 0.2)'
      },
      surfaces: {
        ground: '#1c050d',
        card: '#2e0817'
      }
    }
  }
}, baseTheme);

// 2. Register & activate dynamically at runtime
GpThemeManager.registerTheme(brandCustomTheme);
GpThemeManager.setTheme('brand-crimson');`;

  tsUsageCode = `import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

// Switch Theme Presets ('default', 'ocean', 'emerald', 'sunset', 'amethyst', 'rose', 'nord', 'cyberpunk')
GpThemeManager.setTheme('ocean');

// Switch Color Mode ('light', 'dark', or 'system')
GpThemeManager.setMode('dark');

// Toggle between Light and Dark
GpThemeManager.toggleMode();

// Subscribe to real-time state changes
const unsubscribe = GpThemeManager.onChange((state) => {
  console.log('Active Theme:', state.theme);
  console.log('Mode:', state.mode);
  console.log('Effective Dark:', state.isDark);
});`;

  htmlUsageCode = `<!-- Apply Theme and Mode to the entire document -->
<html data-gp-theme="ocean" data-gp-mode="dark">
  ...
</html>

<!-- Or scope a specific theme/mode to a sub-container or dialog -->
<div data-gp-theme="sunset" data-gp-mode="light" class="themed-card">
  <h3>Golden Sunset Panel</h3>
  <gp-button label="Themed Button" severity="primary" />
</div>`;

  tokenList: DocApiProperty[] = [
    {
      name: '--gp-primary',
      type: 'color',
      default: 'varies by theme',
      description: 'Primary brand color for buttons, active navigation, focus highlights, and controls.'
    },
    {
      name: '--gp-primary-text',
      type: 'color',
      default: '#ffffff',
      description: 'Contrasting text color for primary filled elements.'
    },
    {
      name: '--gp-primary-hover',
      type: 'color',
      default: 'varies by theme',
      description: 'Interactive hover color for primary elements.'
    },
    {
      name: '--gp-primary-light',
      type: 'color',
      default: 'varies by theme',
      description: 'Subtle translucent background for active items and badges.'
    },
    {
      name: '--gp-surface-ground',
      type: 'color',
      default: 'varies by theme',
      description: 'Main canvas and background surface color.'
    },
    {
      name: '--gp-surface-card',
      type: 'color',
      default: 'varies by theme',
      description: 'Elevated card, panel, and dialog surface color.'
    },
    {
      name: '--gp-surface-border',
      type: 'color',
      default: 'varies by theme',
      description: 'Structural border and divider stroke color.'
    },
    {
      name: '--gp-text-color',
      type: 'color',
      default: 'varies by theme',
      description: 'Primary foreground text color.'
    },
    {
      name: '--gp-text-color-secondary',
      type: 'color',
      default: 'varies by theme',
      description: 'Secondary descriptive text color.'
    },
    {
      name: '--gp-border-radius',
      type: 'length',
      default: '6px (theme configurable)',
      description: 'Base border radius for buttons, cards, dialogs, inputs, and chips.'
    },
    {
      name: '--gp-scrollbar-thumb',
      type: 'color',
      default: 'rgba(100, 116, 139, 0.32) / theme configured',
      description: 'Thumb / handle color of scrollbars across the document and scrollable containers.'
    },
    {
      name: '--gp-scrollbar-thumb-hover',
      type: 'color',
      default: 'rgba(100, 116, 139, 0.55) / theme configured',
      description: 'Hover color of scrollbar thumb on mouseover or dragging.'
    },
    {
      name: '--gp-scrollbar-track',
      type: 'color',
      default: 'transparent / theme configured',
      description: 'Background track color behind the scrollbar thumb.'
    },
    {
      name: '--gp-scrollbar-size',
      type: 'length',
      default: '8px (12px in High Contrast, 6px in Cyberpunk)',
      description: 'Width of vertical scrollbars and height of horizontal scrollbars.'
    },
    {
      name: '--gp-scrollbar-radius',
      type: 'length',
      default: '4px (9999px in Pride, 2px in High Contrast, 0px in Cyberpunk)',
      description: 'Border radius applied to scrollbar thumbs.'
    }
  ];

  public themeEditorService = inject(ThemeEditorService);

  ngOnInit(): void {
    this.unsubscribeThemeListener = GpThemeManager.onChange((state) => {
      this.activeThemeId.set(state.theme);
      this.currentMode.set(state.mode);
      this.isDarkMode.set(state.isDark);
      this.themes.set(GpThemeManager.getAvailableThemes());
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeThemeListener) {
      this.unsubscribeThemeListener();
    }
  }

  public selectTheme(themeId: string): void {
    GpThemeManager.setTheme(themeId);
  }

  public setMode(mode: GpThemeMode): void {
    GpThemeManager.setMode(mode);
  }

  public toggleDarkModeSwitch(dark: boolean): void {
    GpThemeManager.setMode(dark ? 'dark' : 'light');
  }

  public onPrimaryColorChange(color: string): void {
    this.primaryColor.set(color);
    GpThemeManager.setCustomToken('--gp-primary', color);
  }

  public onBorderRadiusChange(radius: number): void {
    this.borderRadius.set(radius);
    GpThemeManager.setCustomToken('--gp-border-radius', `${radius}px`);
  }

  public onNewThemeNameInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    if (val) {
      this.newThemeName = val;
    }
  }

  public onNewThemePrimaryChange(val: string): void {
    this.newThemePrimary = val;
  }

  public onNewThemeDarkBgChange(val: string): void {
    this.newThemeDarkBg = val;
  }

  public resetTokens(): void {
    GpThemeManager.resetCustomTokens();
    this.borderRadius.set(6);
    this.primaryColor.set('#6366f1');
  }

  public registerCustomTheme(): void {
    const id = this.newThemeName.toLowerCase().replace(/\s+/g, '-');
    GpThemeManager.registerTheme({
      id,
      name: this.newThemeName,
      description: `Custom registered theme with ${this.newThemePrimary} accent.`,
      light: {
        semantic: {
          primary: {
            main: this.newThemePrimary,
            text: '#ffffff',
            hover: this.newThemePrimary,
            active: this.newThemePrimary,
            light: 'rgba(0, 0, 0, 0.05)'
          },
          surfaces: {
            ground: '#fafcf8',
            card: '#ffffff'
          }
        }
      },
      dark: {
        semantic: {
          primary: {
            main: this.newThemePrimary,
            text: '#000000',
            hover: this.newThemePrimary,
            active: this.newThemePrimary,
            light: 'rgba(255, 255, 255, 0.15)'
          },
          surfaces: {
            ground: this.newThemeDarkBg,
            card: '#162808'
          }
        }
      }
    });

    this.themes.set(GpThemeManager.getAvailableThemes());
    GpThemeManager.setTheme(id);
  }
}
