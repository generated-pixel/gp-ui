/**
 * Design Token Compiler & Theme Extender for gp-ui
 * Transforms TypeScript & JSON theme structures into CSS custom properties and stylesheets.
 */
import { GpThemeDefinition, GpThemeOverride } from './types';
import { baseTheme } from './base-theme';

const componentTokenNames = [
  'button',
  'buttonGroup',
  'splitButton',
  'speedDial',
  'toggleButton',
  'input',
  'inputText',
  'textarea',
  'password',
  'inputNumber',
  'inputMask',
  'checkbox',
  'radioButton',
  'switch',
  'slider',
  'rating',
  'colorPicker',
  'select',
  'multiSelect',
  'listbox',
  'autocomplete',
  'cascadeSelect',
  'treeSelect',
  'datePicker',
  'timePicker',
  'fileUpload',
  'paginator',
  'column',
  'table',
  'treeTable',
  'dataView',
  'virtualScroller',
  'tree',
  'orgChart',
  'menu',
  'menubar',
  'contextMenu',
  'tieredMenu',
  'megaMenu',
  'panelMenu',
  'breadcrumb',
  'tabs',
  'stepper',
  'dock',
  'toolbar',
  'dialog',
  'confirmDialog',
  'drawer',
  'popover',
  'commandPalette',
  'formField',
  'bottomSheet',
  'card',
  'panel',
  'accordion',
  'fieldset',
  'divider',
  'splitter',
  'scrollPanel',
  'toast',
  'message',
  'progressBar',
  'progressSpinner',
  'skeleton',
  'badge',
  'tag',
  'chip',
  'image',
  'carousel',
  'timeline',
  'meterGroup',
  'emptyState',
  'avatar',
  'treeNode',
  'icon',
  'grid',
  'gridWidget',
  'blockCard',
  'sidebar',
  'kpiCard',
  'statCard',
  'announcementBar',
  'dateRangePicker',
  'label',
  'floatLabel',
  'insetLabel'
] as const;

const inheritedComponentTokenDefaults = componentTokenNames.reduce<Record<string, Record<string, string>>>(
  (defaults, componentName) => {
    defaults[componentName] = {
      background: '{semantic.surfaces.card}',
      color: '{semantic.text.primary}',
      borderColor: '{semantic.surfaces.border}',
      borderRadius: '{primitives.borderRadius.base}',
      padding: '{primitives.spacing.4}',
      paddingX: '{primitives.spacing.4}',
      paddingY: '{primitives.spacing.3}',
      margin: '0',
      marginX: '0',
      marginY: '0',
      gap: '{primitives.spacing.2}',
      spacing: '{primitives.spacing.2}',
      fontSize: '{primitives.typography.fontSize.base}',
      shadow: '{semantic.shadows.sm}'
    };
    return defaults;
  },
  {}
);

/**
 * Deeply merges two objects, creating a new clone.
 */
export function deepMerge<T extends object>(target: T, source: any): T {
  if (!source) {
    return target;
  }
  const output = { ...target } as any;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in (target as object))) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge((target as any)[key], source[key]);
        }
      } else if (source[key] !== undefined) {
        output[key] = source[key];
      }
    });
  }
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Extends the Base Theme (or another theme) with partial overrides to create a complete Theme Definition.
 */
export function extendTheme(overrides: GpThemeOverride, base: GpThemeDefinition = baseTheme): GpThemeDefinition {
  const merged = deepMerge(base, overrides) as GpThemeDefinition;
  merged.id = overrides.id;
  merged.name = overrides.name;
  if (overrides.description) {
    merged.description = overrides.description;
  }
  if (overrides.author) {
    merged.author = overrides.author;
  }
  return merged;
}

/**
 * Converts a theme's tokens for a specific mode ('light' or 'dark') into a dictionary of CSS Custom Properties.
 */
export function modeTokensToCssVars(theme: GpThemeDefinition, mode: 'light' | 'dark'): Record<string, string> {
  const modeData = mode === 'dark' ? theme.dark : theme.light;
  const sem = modeData.semantic;
  const prim = theme.primitives;
  const comp = deepMerge(inheritedComponentTokenDefaults, modeData.components || {});

  const vars: Record<string, string> = {};

  // 1. Primary scale (50 - 950)
  if (sem.primaryScale) {
    Object.entries(sem.primaryScale).forEach(([step, color]) => {
      vars[`--gp-primary-${step}`] = color;
    });
  }

  // 2. Semantic Primary Tokens
  vars['--gp-primary'] = sem.primary.main;
  vars['--gp-primary-text'] = sem.primary.text;
  vars['--gp-primary-hover'] = sem.primary.hover;
  vars['--gp-primary-active'] = sem.primary.active;
  vars['--gp-primary-light'] = sem.primary.light;
  if (sem.primary.border) {
    vars['--gp-primary-border'] = sem.primary.border;
  }

  // 3. Status Colors
  vars['--gp-secondary'] = sem.secondary.main;
  vars['--gp-secondary-text'] = sem.secondary.text;
  vars['--gp-secondary-hover'] = sem.secondary.hover;
  vars['--gp-secondary-light'] = sem.secondary.light;

  vars['--gp-success'] = sem.success.main;
  vars['--gp-success-text'] = sem.success.text;
  vars['--gp-success-hover'] = sem.success.hover;
  vars['--gp-success-light'] = sem.success.light;
  if (sem.success.border) {
    vars['--gp-success-border'] = sem.success.border;
  }

  vars['--gp-info'] = sem.info.main;
  vars['--gp-info-text'] = sem.info.text;
  vars['--gp-info-hover'] = sem.info.hover;
  vars['--gp-info-light'] = sem.info.light;
  if (sem.info.border) {
    vars['--gp-info-border'] = sem.info.border;
  }

  vars['--gp-warning'] = sem.warning.main;
  vars['--gp-warning-text'] = sem.warning.text;
  vars['--gp-warning-hover'] = sem.warning.hover;
  vars['--gp-warning-light'] = sem.warning.light;
  if (sem.warning.border) {
    vars['--gp-warning-border'] = sem.warning.border;
  }

  vars['--gp-danger'] = sem.danger.main;
  vars['--gp-danger-text'] = sem.danger.text;
  vars['--gp-danger-hover'] = sem.danger.hover;
  vars['--gp-danger-light'] = sem.danger.light;
  if (sem.danger.border) {
    vars['--gp-danger-border'] = sem.danger.border;
  }

  vars['--gp-contrast'] = sem.contrast.main;
  vars['--gp-contrast-text'] = sem.contrast.text;
  vars['--gp-contrast-hover'] = sem.contrast.hover;

  // 4. Surfaces
  vars['--gp-surface-ground'] = sem.surfaces.ground;
  vars['--gp-surface-section'] = sem.surfaces.section;
  vars['--gp-surface-card'] = sem.surfaces.card;
  vars['--gp-surface-overlay'] = sem.surfaces.overlay;
  vars['--gp-surface-hover'] = sem.surfaces.hover;
  vars['--gp-surface-active'] = sem.surfaces.active;
  vars['--gp-surface-border'] = sem.surfaces.border;
  vars['--gp-surface-divider'] = sem.surfaces.divider;

  // 5. Typography
  vars['--gp-font-family'] = prim.typography.fontFamily.sans;
  vars['--gp-font-size-xs'] = prim.typography.fontSize.xs;
  vars['--gp-font-size-sm'] = prim.typography.fontSize.sm;
  vars['--gp-font-size-base'] = prim.typography.fontSize.base;
  vars['--gp-font-size-lg'] = prim.typography.fontSize.lg;
  vars['--gp-font-size-xl'] = prim.typography.fontSize.xl;
  vars['--gp-font-size-2xl'] = prim.typography.fontSize['2xl'];
  vars['--gp-font-size-3xl'] = prim.typography.fontSize['3xl'];

  // 6. Text
  vars['--gp-text-color'] = sem.text.primary;
  vars['--gp-text-color-secondary'] = sem.text.secondary;
  vars['--gp-text-color-muted'] = sem.text.muted;
  vars['--gp-text-color-disabled'] = sem.text.disabled;

  // 7. Focus & Shadows
  vars['--gp-focus-ring'] = sem.focus.ring;
  vars['--gp-focus-ring-danger'] = sem.focus.ringDanger;
  vars['--gp-shadow-sm'] = sem.shadows.sm;
  vars['--gp-shadow-md'] = sem.shadows.md;
  vars['--gp-shadow-lg'] = sem.shadows.lg;
  vars['--gp-shadow-xl'] = sem.shadows.xl;

  // 8. Radius
  vars['--gp-border-radius-sm'] = prim.borderRadius.sm;
  vars['--gp-border-radius'] = prim.borderRadius.base;
  vars['--gp-border-radius-md'] = prim.borderRadius.md;
  vars['--gp-border-radius-lg'] = prim.borderRadius.lg;
  vars['--gp-border-radius-full'] = prim.borderRadius.full;

  // 9. Transitions & Motion
  vars['--gp-transition-duration'] = prim.transitions.duration.normal;
  vars['--gp-transition-timing'] = prim.transitions.timing.ease;
  vars['--gp-duration-fast'] = prim.transitions.duration.fast || '150ms';
  vars['--gp-duration-normal'] = prim.transitions.duration.normal || '250ms';
  vars['--gp-duration-slow'] = prim.transitions.duration.slow || '400ms';
  vars['--gp-ease-standard'] = prim.transitions.easing?.standard || 'cubic-bezier(0.2, 0.0, 0, 1.0)';
  vars['--gp-ease-emphasized'] = prim.transitions.easing?.emphasized || 'cubic-bezier(0.05, 0.7, 0.1, 1.0)';
  vars['--gp-ease-decelerate'] = prim.transitions.easing?.decelerate || 'cubic-bezier(0.0, 0.0, 0.2, 1.0)';
  vars['--gp-ease-spring'] = prim.transitions.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1.0)';

  // 10. Glassmorphism & Depth Elevation
  vars['--gp-surface-glass'] =
    sem.surfaces.glass || (mode === 'dark' ? 'rgba(30, 41, 59, 0.72)' : 'rgba(255, 255, 255, 0.75)');
  vars['--gp-surface-glass-border'] =
    sem.surfaces.glassBorder || (mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.5)');
  vars['--gp-blur-sm'] = prim.blur?.sm || '4px';
  vars['--gp-blur-md'] = prim.blur?.md || '12px';
  vars['--gp-blur-lg'] = prim.blur?.lg || '24px';
  vars['--gp-glow-primary'] = sem.shadows.glowPrimary || `0 0 20px ${sem.primary.light || 'rgba(99, 102, 241, 0.35)'}`;
  vars['--gp-glow-secondary'] =
    sem.shadows.glowSecondary || `0 0 20px ${sem.secondary.light || 'rgba(6, 182, 212, 0.35)'}`;

  // 11. Fluid Typography & Adaptive Spacing (CSS clamp)
  vars['--gp-fluid-font-xs'] = prim.fluidTypography?.xs || 'clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)';
  vars['--gp-fluid-font-sm'] = prim.fluidTypography?.sm || 'clamp(0.8rem, 0.75rem + 0.35vw, 0.875rem)';
  vars['--gp-fluid-font-base'] = prim.fluidTypography?.base || 'clamp(0.95rem, 0.9rem + 0.4vw, 1.05rem)';
  vars['--gp-fluid-font-lg'] = prim.fluidTypography?.lg || 'clamp(1.1rem, 1.0rem + 0.6vw, 1.25rem)';
  vars['--gp-fluid-font-xl'] = prim.fluidTypography?.xl || 'clamp(1.25rem, 1.15rem + 0.8vw, 1.5rem)';
  vars['--gp-fluid-font-2xl'] = prim.fluidTypography?.['2xl'] || 'clamp(1.5rem, 1.3rem + 1.2vw, 2rem)';
  vars['--gp-fluid-font-3xl'] = prim.fluidTypography?.['3xl'] || 'clamp(1.85rem, 1.5rem + 1.8vw, 2.75rem)';

  vars['--gp-fluid-space-sm'] = prim.fluidSpacing?.sm || 'clamp(0.5rem, 0.4rem + 0.3vw, 0.75rem)';
  vars['--gp-fluid-space-md'] = prim.fluidSpacing?.md || 'clamp(1rem, 0.85rem + 0.6vw, 1.5rem)';
  vars['--gp-fluid-space-lg'] = prim.fluidSpacing?.lg || 'clamp(1.5rem, 1.25rem + 1.0vw, 2.25rem)';
  vars['--gp-fluid-space-xl'] = prim.fluidSpacing?.xl || 'clamp(2rem, 1.5rem + 1.8vw, 3.5rem)';

  // 12. Mask
  vars['--gp-mask-bg'] = sem.mask.bg;

  // 13. Scrollbars
  if (sem.scrollbar) {
    vars['--gp-scrollbar-thumb'] = sem.scrollbar.thumb;
    vars['--gp-scrollbar-thumb-hover'] = sem.scrollbar.thumbHover;
    vars['--gp-scrollbar-track'] = sem.scrollbar.track;
    vars['--gp-scrollbar-size'] = sem.scrollbar.size;
    vars['--gp-scrollbar-radius'] = sem.scrollbar.radius;
  }

  // 14. Labels & Form Field Design Tokens
  vars['--gp-label-color'] = sem.text.primary;
  vars['--gp-label-color-secondary'] = sem.text.secondary;
  vars['--gp-label-color-muted'] = sem.text.muted;
  vars['--gp-label-font-weight'] = '600';
  vars['--gp-label-font-size-sm'] = prim.typography.fontSize.xs || '0.75rem';
  vars['--gp-label-font-size-md'] = prim.typography.fontSize.sm || '0.875rem';
  vars['--gp-label-font-size-lg'] = prim.typography.fontSize.base || '1rem';
  vars['--gp-label-required-color'] = sem.danger.main;
  vars['--gp-label-optional-color'] = sem.text.muted;
  vars['--gp-label-gap'] = '0.35rem';

  vars['--gp-float-label-active-color'] = sem.primary.main;
  vars['--gp-float-label-active-bg'] = sem.surfaces.card;
  vars['--gp-float-label-scale'] = '0.85';
  vars['--gp-float-label-transition'] =
    'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), font-size 150ms cubic-bezier(0.4, 0, 0.2, 1), top 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms ease';

  vars['--gp-inset-label-color'] = sem.text.secondary;
  vars['--gp-inset-label-active-color'] = sem.primary.main;
  vars['--gp-inset-label-font-size'] = '0.7rem';
  vars['--gp-inset-label-padding-top'] = '1.35rem';
  vars['--gp-inset-label-letter-spacing'] = '0.04em';

  vars['--gp-form-field-bg'] = sem.surfaces.card;
  vars['--gp-form-field-border'] = sem.surfaces.border;
  vars['--gp-form-field-border-focus'] = sem.primary.main;
  vars['--gp-form-field-radius'] = prim.borderRadius.base;
  vars['--gp-form-field-min-height'] = '46px';
  vars['--gp-form-field-margin-bottom'] = '1rem';

  // 15. Component Specific Tokens (Recursive Flattening & W3C Token Alias Resolution)
  const mergedComponents = deepMerge(inheritedComponentTokenDefaults, comp || {});
  const compVars = flattenComponentTokens(mergedComponents, '--gp', (val) => resolveTokenAlias(val, theme, mode));
  Object.assign(vars, compVars);

  return vars;
}

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Resolves W3C-style token aliases (e.g. "{semantic.primary.main}" or "{primitives.borderRadius.md}")
 */
export function resolveTokenAlias(val: any, theme: GpThemeDefinition, mode: 'light' | 'dark'): string {
  if (typeof val !== 'string') {
    return String(val ?? '');
  }

  const match = val.match(/^\{([^}]+)\}$/);
  if (!match) {
    return val;
  }

  const path = match[1].split('.');
  let target: any = null;

  if (path[0] === 'semantic') {
    target = mode === 'dark' ? theme.dark.semantic : theme.light.semantic;
    path.shift();
  } else if (path[0] === 'primitives') {
    target = theme.primitives;
    path.shift();
  } else if (path[0] === 'components') {
    target = mode === 'dark' ? theme.dark.components : theme.light.components;
    path.shift();
  }

  if (!target) {
    return val;
  }

  for (const key of path) {
    if (target && typeof target === 'object' && key in target) {
      target = target[key];
    } else {
      return val;
    }
  }

  if (typeof target === 'string' || typeof target === 'number') {
    return resolveTokenAlias(target, theme, mode);
  }

  return val;
}

export function flattenComponentTokens(
  obj: Record<string, any>,
  prefix = '--gp',
  resolver?: (val: any) => string
): Record<string, string> {
  const vars: Record<string, string> = {};
  if (!obj || typeof obj !== 'object') {
    return vars;
  }

  function traverse(current: any, path: string[]) {
    if (current === null || current === undefined) {
      return;
    }
    if (typeof current === 'object' && !Array.isArray(current)) {
      Object.keys(current).forEach((key) => {
        traverse(current[key], [...path, camelToKebab(key)]);
      });
    } else {
      const varName = `${prefix}-${path.join('-')}`;
      const rawVal = String(current);
      vars[varName] = resolver ? resolver(rawVal) : rawVal;
    }
  }

  traverse(obj, []);
  return vars;
}

/**
 * Compiles a Theme Definition into a formatted CSS string with Light, Dark, and Media query rules.
 */
export function themeToCss(theme: GpThemeDefinition): string {
  const lightVars = modeTokensToCssVars(theme, 'light');
  const darkVars = modeTokensToCssVars(theme, 'dark');

  const formatVars = (vars: Record<string, string>) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');

  const isDefault = theme.id === 'default' || theme.id === 'gp';

  const lightSelectors = isDefault
    ? `:root,
:root[data-gp-theme="default"],
:root[data-gp-theme="gp"],
[data-gp-theme="default"],
[data-gp-theme="gp"],
.gp-theme-default,
.gp-theme-gp,
.gp-light,
[data-gp-theme="gp-light"]`
    : `:root[data-gp-theme="${theme.id}"],
[data-gp-theme="${theme.id}"],
[data-gp-theme="${theme.id}"][data-gp-mode="light"],
.gp-theme-${theme.id},
.gp-theme-${theme.id}.gp-light`;

  const darkSelectors = isDefault
    ? `:root[data-gp-mode="dark"],
:root[data-gp-theme="default"][data-gp-mode="dark"],
:root[data-gp-theme="gp"][data-gp-mode="dark"],
[data-gp-theme="default"][data-gp-mode="dark"],
[data-gp-theme="gp"][data-gp-mode="dark"],
.gp-theme-default.gp-dark,
.gp-theme-gp.gp-dark,
.gp-dark,
[data-gp-theme="gp-dark"]`
    : `:root[data-gp-theme="${theme.id}"][data-gp-mode="dark"],
[data-gp-theme="${theme.id}"][data-gp-mode="dark"],
.gp-theme-${theme.id}.gp-dark,
[data-gp-theme="${theme.id}"].gp-dark`;

  const mediaSelectors = isDefault
    ? `  :root:not([data-gp-mode="light"]):not([data-gp-theme="gp-light"]),
  :root[data-gp-theme="default"]:not([data-gp-mode="light"]),
  :root[data-gp-theme="gp"]:not([data-gp-mode="light"]),
  [data-gp-theme="default"]:not([data-gp-mode="light"]),
  [data-gp-theme="gp"]:not([data-gp-mode="light"])`
    : `  :root[data-gp-theme="${theme.id}"]:not([data-gp-mode="light"]),
  [data-gp-theme="${theme.id}"]:not([data-gp-mode="light"]),
  .gp-theme-${theme.id}:not(.gp-light)`;

  return `/**
 * gp-ui Theme: ${theme.name}
 * Generated from TypeScript / JSON Design Tokens
 */

/* Light Mode */
${lightSelectors} {
${formatVars(lightVars)}
}

/* Dark Mode */
${darkSelectors} {
${formatVars(darkVars)}
}

/* System Dark Mode Preference */
@media (prefers-color-scheme: dark) {
${mediaSelectors} {
${formatVars(darkVars)}
  }
}
`;
}

/**
 * Converts Hex string to HSL [hue (0-360), saturation (0-1), lightness (0-1)]
 */
export function hexToHsl(hex: string): [number, number, number] {
  if (!hex || typeof hex !== 'string') {
    return [220, 0.8, 0.5];
  }
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c
      .split('')
      .map((x) => x + x)
      .join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) {
    return [220, 0.8, 0.5];
  }
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Number(s.toFixed(3)), Number(l.toFixed(3))];
}

/**
 * Converts HSL values to a Hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  const clampL = Math.max(0, Math.min(1, l));
  const clampS = Math.max(0, Math.min(1, s));
  const normH = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * clampL - 1)) * clampS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = clampL - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= normH && normH < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= normH && normH < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= normH && normH < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= normH && normH < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= normH && normH < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= normH && normH < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a full 50-950 color scale ramp from a single base color hex (base is assigned to 500)
 */
export function generateColorScale(baseHex: string): {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
} {
  const [h, s, l] = hexToHsl(baseHex);
  return {
    50: hslToHex(h, Math.min(s, 0.4), 0.96),
    100: hslToHex(h, Math.min(s, 0.5), 0.9),
    200: hslToHex(h, Math.min(s, 0.65), 0.8),
    300: hslToHex(h, s, 0.68),
    400: hslToHex(h, s, 0.56),
    500: baseHex,
    600: hslToHex(h, Math.min(s * 1.05, 1), Math.max(l * 0.82, 0.15)),
    700: hslToHex(h, Math.min(s * 1.1, 1), Math.max(l * 0.66, 0.12)),
    800: hslToHex(h, Math.min(s * 1.15, 1), Math.max(l * 0.5, 0.09)),
    900: hslToHex(h, Math.min(s * 1.2, 1), Math.max(l * 0.35, 0.06)),
    950: hslToHex(h, Math.min(s * 1.25, 1), Math.max(l * 0.2, 0.03))
  };
}

/**
 * Serializes a Theme Definition into TypeScript source code for export into Angular projects.
 */
export function themeToTypeScript(theme: GpThemeDefinition): string {
  const varName = (theme.id || 'custom').replace(/[^a-zA-Z0-9]/g, '_') + 'Theme';
  return `import { GpThemeDefinition, extendTheme } from 'gp-ui-theme';

export const ${varName}: GpThemeDefinition = extendTheme(${JSON.stringify(
    {
      id: theme.id || 'custom-theme',
      name: theme.name || 'Custom Theme',
      description: theme.description || 'Custom theme generated via gp-ui Theme Editor',
      primitives: theme.primitives,
      light: theme.light,
      dark: theme.dark
    },
    null,
    2
  )});
`;
}

/**
 * Serializes a Theme Definition into JSON tokens format.
 */
export function themeToJson(theme: GpThemeDefinition): string {
  return JSON.stringify(theme, null, 2);
}
/**
 * Returns Angular project integration code snippet for the specified theme.
 */
export function themeToAngularSetup(theme: GpThemeDefinition): string {
  const varName = (theme.id || 'custom').replace(/[^a-zA-Z0-9]/g, '_') + 'Theme';
  const themeId = theme.id || 'custom-theme';
  return `/**
 * Option 1: Angular App Initialization (main.ts or app.config.ts)
 */
import { Component, OnInit } from '@angular/core';
import { GpThemeManager } from 'gp-ui-theme';
import { ${varName} } from './custom-theme';

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // 1. Register custom theme definition
    GpThemeManager.registerTheme(${varName});

    // 2. Activate the custom theme
    GpThemeManager.setTheme('${themeId}');
  }
}

/**
 * Option 2: Pure CSS Setup (angular.json)
 * Save generated theme.css to src/assets/theme.css and reference in angular.json:
 *
 * "styles": [
 *   "src/styles.scss",
 *   "src/assets/theme.css"
 * ]
 *
 * Then activate using data attribute on <html> element:
 * <html data-gp-theme="${themeId}">
 */
`;
}
