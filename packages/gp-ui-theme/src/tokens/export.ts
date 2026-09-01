/**
 * Design Token Exporters for gp-ui-theme
 * Converts GpThemeDefinition into W3C Design Tokens Community Group (DTCG) standard format,
 * utility CSS config extension format, and formatted CSS custom properties.
 */
import { GpThemeDefinition } from './types';
import { modeTokensToCssVars } from './compiler';

/**
 * Converts a GpThemeDefinition into standard W3C Design Tokens Community Group (DTCG) JSON format.
 */
export function exportToW3C(theme: GpThemeDefinition): string {
  const dtcg: Record<string, any> = {
    $schema: 'https://design-tokens.github.io/community-group/format/',
    name: theme.name,
    description: theme.description,
    color: {},
    dimension: {
      spacing: {},
      borderRadius: {},
      fontSize: {}
    },
    shadow: {},
    semantic: {
      light: {},
      dark: {}
    }
  };

  // Export primitive colors
  if (theme.primitives?.colors) {
    Object.entries(theme.primitives.colors).forEach(([colorFamily, value]) => {
      if (typeof value === 'object') {
        dtcg['color'][colorFamily] = {};
        Object.entries(value).forEach(([shade, hex]) => {
          dtcg['color'][colorFamily][shade] = {
            $value: hex,
            $type: 'color'
          };
        });
      } else {
        dtcg['color'][colorFamily] = {
          $value: value,
          $type: 'color'
        };
      }
    });
  }

  // Export spacing
  if (theme.primitives?.spacing) {
    Object.entries(theme.primitives.spacing).forEach(([spaceKey, val]) => {
      dtcg['dimension']['spacing'][spaceKey] = {
        $value: val,
        $type: 'dimension'
      };
    });
  }

  // Export border radius
  if (theme.primitives?.borderRadius) {
    Object.entries(theme.primitives.borderRadius).forEach(([radKey, val]) => {
      dtcg['dimension']['borderRadius'][radKey] = {
        $value: val,
        $type: 'dimension'
      };
    });
  }

  // Export font sizes
  if (theme.primitives?.typography?.fontSize) {
    Object.entries(theme.primitives.typography.fontSize).forEach(([fontKey, val]) => {
      dtcg['dimension']['fontSize'][fontKey] = {
        $value: val,
        $type: 'dimension'
      };
    });
  }

  // Export semantic light & dark tokens
  if (theme.light?.semantic) {
    dtcg['semantic']['light'] = formatDtcgObject(theme.light.semantic);
  }
  if (theme.dark?.semantic) {
    dtcg['semantic']['dark'] = formatDtcgObject(theme.dark.semantic);
  }

  return JSON.stringify(dtcg, null, 2);
}

function formatDtcgObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = formatDtcgObject(val);
    } else if (typeof val === 'string') {
      const isColor = val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl');
      result[key] = {
        $value: val,
        $type: isColor ? 'color' : 'string'
      };
    }
  });
  return result;
}

/**
 * Converts a GpThemeDefinition into a utility / atomic CSS theme configuration object.
 */
export function exportToUtilityConfig(theme: GpThemeDefinition): Record<string, any> {
  const utilityConfig: Record<string, any> = {
    colors: {
      primary: {
        DEFAULT: 'var(--gp-primary)',
        hover: 'var(--gp-primary-hover)',
        active: 'var(--gp-primary-active)',
        light: 'var(--gp-primary-light)',
        border: 'var(--gp-primary-border)'
      },
      surface: {
        ground: 'var(--gp-surface-ground)',
        section: 'var(--gp-surface-section)',
        card: 'var(--gp-surface-card)',
        overlay: 'var(--gp-surface-overlay)',
        border: 'var(--gp-surface-border)',
        divider: 'var(--gp-surface-divider)'
      },
      text: {
        primary: 'var(--gp-text-primary)',
        secondary: 'var(--gp-text-secondary)',
        muted: 'var(--gp-text-muted)',
        disabled: 'var(--gp-text-disabled)'
      }
    },
    borderRadius: {},
    spacing: {},
    boxShadow: {
      sm: 'var(--gp-shadow-sm)',
      md: 'var(--gp-shadow-md)',
      lg: 'var(--gp-shadow-lg)',
      xl: 'var(--gp-shadow-xl)'
    }
  };

  if (theme.primitives?.borderRadius) {
    Object.entries(theme.primitives.borderRadius).forEach(([k, v]) => {
      utilityConfig['borderRadius'][k] = v;
    });
  }

  if (theme.primitives?.spacing) {
    Object.entries(theme.primitives.spacing).forEach(([k, v]) => {
      utilityConfig['spacing'][k] = v;
    });
  }

  return utilityConfig;
}

/**
 * Converts theme definitions into formatted CSS Custom Properties string.
 */
export function exportToCssVariables(theme: GpThemeDefinition): string {
  const lightVars = modeTokensToCssVars(theme, 'light');
  const darkVars = modeTokensToCssVars(theme, 'dark');

  let output = `/* gp-ui CSS Variables - ${theme.name} */\n\n`;
  output += `:root, [data-gp-theme="${theme.id}"] {\n`;
  Object.entries(lightVars).forEach(([k, v]) => {
    output += `  ${k}: ${v};\n`;
  });
  output += '}\n\n';

  output += `[data-gp-mode="dark"], [data-gp-theme="${theme.id}"][data-gp-mode="dark"], .gp-dark {\n`;
  Object.entries(darkVars).forEach(([k, v]) => {
    output += `  ${k}: ${v};\n`;
  });
  output += '}\n';

  return output;
}
