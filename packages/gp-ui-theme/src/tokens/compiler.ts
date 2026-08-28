/**
 * Design Token Compiler & Theme Extender for gp-ui
 * Transforms TypeScript & JSON theme structures into CSS custom properties and stylesheets.
 */
import { GpThemeDefinition, GpThemeOverride } from './types';
import { baseTheme } from './base-theme';

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
  const comp = modeData.components || {};

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

  // 9. Transitions
  vars['--gp-transition-duration'] = prim.transitions.duration.normal;
  vars['--gp-transition-timing'] = prim.transitions.timing.ease;

  // 10. Mask
  vars['--gp-mask-bg'] = sem.mask.bg;

  // 11. Component Specific Tokens (Recursive Flattening & W3C Token Alias Resolution)
  if (comp) {
    const compVars = flattenComponentTokens(comp, '--gp', (val) => resolveTokenAlias(val, theme, mode));
    Object.assign(vars, compVars);
  }

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
