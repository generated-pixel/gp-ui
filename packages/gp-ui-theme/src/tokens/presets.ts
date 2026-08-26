/**
 * Built-in Theme Presets for gp-ui
 * Built by extending the foundational baseTheme with specific palette and aesthetic overrides.
 */
import { GpThemeDefinition } from './types';
import { baseTheme } from './base-theme';
import { extendTheme } from './compiler';
import { defaultPrimitives } from './primitives';

export const defaultTheme: GpThemeDefinition = baseTheme;

export const oceanTheme: GpThemeDefinition = extendTheme({
  id: 'ocean',
  name: 'Ocean (Azure & Cyan)',
  description: 'Vibrant oceanic palette with refreshing cyan and deep azure hues.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.cyan,
      primary: {
        main: '#0891b2',
        text: '#ffffff',
        hover: '#0e7490',
        active: '#155e75',
        light: '#ecfeff',
        border: '#a5f3fc'
      },
      secondary: {
        main: '#475569',
        text: '#ffffff',
        hover: '#334155',
        active: '#1e293b',
        light: '#f1f5f9'
      },
      contrast: {
        main: '#082f49',
        text: '#ffffff',
        hover: '#0c4a6e'
      },
      surfaces: {
        ground: '#f0f9ff',
        section: '#e0f2fe',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#f0fdfa',
        active: '#ccfbf1',
        border: '#bae6fd',
        divider: '#e0f2fe'
      },
      text: {
        primary: '#0c4a6e',
        secondary: '#0369a1',
        muted: '#64748b',
        disabled: '#cbd5e1'
      },
      focus: {
        ring: '0 0 0 3px rgba(6, 182, 212, 0.3)',
        ringDanger: '0 0 0 3px rgba(225, 29, 72, 0.3)'
      },
      mask: {
        bg: 'rgba(8, 47, 73, 0.5)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#083344',
        100: '#164e63',
        200: '#155e75',
        300: '#0e7490',
        400: '#0891b2',
        500: '#06b6d4',
        600: '#22d3ee',
        700: '#67e8f9',
        800: '#a5f3fc',
        900: '#cffafe',
        950: '#ecfeff'
      },
      primary: {
        main: '#22d3ee',
        text: '#083344',
        hover: '#67e8f9',
        active: '#a5f3fc',
        light: 'rgba(6, 182, 212, 0.18)',
        border: 'rgba(6, 182, 212, 0.4)'
      },
      contrast: {
        main: '#f0f9ff',
        text: '#083344',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#03131e',
        section: '#072235',
        card: '#0b2d46',
        overlay: '#0b2d46',
        hover: '#123e5f',
        active: '#194f78',
        border: '#154569',
        divider: '#154569'
      },
      text: {
        primary: '#f0f9ff',
        secondary: '#7dd3fc',
        muted: '#38bdf8',
        disabled: '#475569'
      },
      focus: {
        ring: '0 0 0 3px rgba(34, 211, 238, 0.35)',
        ringDanger: '0 0 0 3px rgba(251, 113, 133, 0.35)'
      },
      mask: {
        bg: 'rgba(2, 10, 16, 0.8)'
      }
    }
  }
});

export const emeraldTheme: GpThemeDefinition = extendTheme({
  id: 'emerald',
  name: 'Emerald (Forest & Mint)',
  description: 'Natural forest green tones with crisp mint highlights.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.emerald,
      primary: {
        main: '#059669',
        text: '#ffffff',
        hover: '#047857',
        active: '#065f46',
        light: '#ecfdf5',
        border: '#a7f3d0'
      },
      contrast: {
        main: '#064e3b',
        text: '#ffffff',
        hover: '#065f46'
      },
      surfaces: {
        ground: '#f6fbf8',
        section: '#e6f4ed',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#f0fdf4',
        active: '#dcfce7',
        border: '#d1fae5',
        divider: '#e6f4ed'
      },
      text: {
        primary: '#064e3b',
        secondary: '#047857',
        muted: '#6b7280',
        disabled: '#d1d5db'
      },
      focus: {
        ring: '0 0 0 3px rgba(16, 185, 129, 0.28)',
        ringDanger: '0 0 0 3px rgba(220, 38, 38, 0.28)'
      },
      mask: {
        bg: 'rgba(6, 78, 59, 0.45)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#022c22',
        100: '#064e3b',
        200: '#065f46',
        300: '#047857',
        400: '#059669',
        500: '#10b981',
        600: '#34d399',
        700: '#6ee7b7',
        800: '#a7f3d0',
        900: '#d1fae5',
        950: '#ecfdf5'
      },
      primary: {
        main: '#34d399',
        text: '#022c22',
        hover: '#6ee7b7',
        active: '#a7f3d0',
        light: 'rgba(16, 185, 129, 0.18)',
        border: 'rgba(16, 185, 129, 0.4)'
      },
      contrast: {
        main: '#ecfdf5',
        text: '#022c22',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#021a14',
        section: '#052a21',
        card: '#0b3d30',
        overlay: '#0b3d30',
        hover: '#125443',
        active: '#176954',
        border: '#145948',
        divider: '#145948'
      },
      text: {
        primary: '#ecfdf5',
        secondary: '#a7f3d0',
        muted: '#6ee7b7',
        disabled: '#4b5563'
      },
      focus: {
        ring: '0 0 0 3px rgba(52, 211, 153, 0.35)',
        ringDanger: '0 0 0 3px rgba(248, 113, 113, 0.35)'
      },
      mask: {
        bg: 'rgba(2, 26, 20, 0.8)'
      }
    }
  }
});

export const sunsetTheme: GpThemeDefinition = extendTheme({
  id: 'sunset',
  name: 'Sunset (Amber & Coral)',
  description: 'Warm golden sunset tones with energetic amber & coral accents.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.amber,
      primary: {
        main: '#d97706',
        text: '#ffffff',
        hover: '#b45309',
        active: '#92400e',
        light: '#fffbeb',
        border: '#fde68a'
      },
      contrast: {
        main: '#451a03',
        text: '#ffffff',
        hover: '#78350f'
      },
      surfaces: {
        ground: '#fffdfa',
        section: '#fef8ee',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#fff7ed',
        active: '#ffedd5',
        border: '#fed7aa',
        divider: '#fef8ee'
      },
      text: {
        primary: '#451a03',
        secondary: '#92400e',
        muted: '#a8a29e',
        disabled: '#d6d3d1'
      },
      focus: {
        ring: '0 0 0 3px rgba(245, 158, 11, 0.3)',
        ringDanger: '0 0 0 3px rgba(220, 38, 38, 0.3)'
      },
      mask: {
        bg: 'rgba(69, 26, 3, 0.45)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#451a03',
        100: '#78350f',
        200: '#92400e',
        300: '#b45309',
        400: '#d97706',
        500: '#f59e0b',
        600: '#fbbf24',
        700: '#fcd34d',
        800: '#fde68a',
        900: '#fef3c7',
        950: '#fffbeb'
      },
      primary: {
        main: '#fbbf24',
        text: '#451a03',
        hover: '#fcd34d',
        active: '#fde68a',
        light: 'rgba(245, 158, 11, 0.18)',
        border: 'rgba(245, 158, 11, 0.4)'
      },
      contrast: {
        main: '#fffbeb',
        text: '#451a03',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#1c0f06',
        section: '#2e170a',
        card: '#3f2212',
        overlay: '#3f2212',
        hover: '#542f1b',
        active: '#6c3c23',
        border: '#5a341e',
        divider: '#5a341e'
      },
      text: {
        primary: '#fffbeb',
        secondary: '#fde68a',
        muted: '#fcd34d',
        disabled: '#78716c'
      },
      focus: {
        ring: '0 0 0 3px rgba(251, 191, 36, 0.35)',
        ringDanger: '0 0 0 3px rgba(248, 113, 113, 0.35)'
      },
      mask: {
        bg: 'rgba(28, 15, 6, 0.8)'
      }
    }
  }
});

export const amethystTheme: GpThemeDefinition = extendTheme({
  id: 'amethyst',
  name: 'Amethyst (Royal Violet)',
  description: 'Sophisticated luxury royal violet & lavender accents.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.violet,
      primary: {
        main: '#9333ea',
        text: '#ffffff',
        hover: '#7e22ce',
        active: '#6b21a8',
        light: '#faf5ff',
        border: '#e9d5ff'
      },
      contrast: {
        main: '#3b0764',
        text: '#ffffff',
        hover: '#581c87'
      },
      surfaces: {
        ground: '#faf7fd',
        section: '#f3ecfb',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#faf5ff',
        active: '#f3e8ff',
        border: '#e9d5ff',
        divider: '#f3ecfb'
      },
      text: {
        primary: '#3b0764',
        secondary: '#7e22ce',
        muted: '#a855f7',
        disabled: '#cbd5e1'
      },
      focus: {
        ring: '0 0 0 3px rgba(168, 85, 247, 0.28)',
        ringDanger: '0 0 0 3px rgba(239, 68, 68, 0.28)'
      },
      mask: {
        bg: 'rgba(59, 7, 100, 0.45)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#3b0764',
        100: '#581c87',
        200: '#6b21a8',
        300: '#7e22ce',
        400: '#9333ea',
        500: '#a855f7',
        600: '#c084fc',
        700: '#d8b4fe',
        800: '#e9d5ff',
        900: '#f3e8ff',
        950: '#faf5ff'
      },
      primary: {
        main: '#c084fc',
        text: '#3b0764',
        hover: '#d8b4fe',
        active: '#e9d5ff',
        light: 'rgba(168, 85, 247, 0.18)',
        border: 'rgba(168, 85, 247, 0.4)'
      },
      contrast: {
        main: '#faf5ff',
        text: '#3b0764',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#140824',
        section: '#220e3a',
        card: '#2e144f',
        overlay: '#2e144f',
        hover: '#401d6d',
        active: '#53268c',
        border: '#441f73',
        divider: '#441f73'
      },
      text: {
        primary: '#faf5ff',
        secondary: '#e9d5ff',
        muted: '#c084fc',
        disabled: '#64748b'
      },
      focus: {
        ring: '0 0 0 3px rgba(192, 132, 252, 0.35)',
        ringDanger: '0 0 0 3px rgba(248, 113, 113, 0.35)'
      },
      mask: {
        bg: 'rgba(20, 8, 36, 0.8)'
      }
    }
  }
});

export const roseTheme: GpThemeDefinition = extendTheme({
  id: 'rose',
  name: 'Rose (Ruby & Rose)',
  description: 'Modern and energetic pink ruby with refined rose accents.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.rose,
      primary: {
        main: '#e11d48',
        text: '#ffffff',
        hover: '#be123c',
        active: '#9f1239',
        light: '#fff1f2',
        border: '#fecdd3'
      },
      contrast: {
        main: '#4c0519',
        text: '#ffffff',
        hover: '#881337'
      },
      surfaces: {
        ground: '#fffafa',
        section: '#fef1f3',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#fff1f2',
        active: '#ffe4e6',
        border: '#fecdd3',
        divider: '#fef1f3'
      },
      text: {
        primary: '#4c0519',
        secondary: '#9f1239',
        muted: '#f43f5e',
        disabled: '#cbd5e1'
      },
      focus: {
        ring: '0 0 0 3px rgba(244, 63, 94, 0.28)',
        ringDanger: '0 0 0 3px rgba(159, 18, 57, 0.28)'
      },
      mask: {
        bg: 'rgba(76, 5, 25, 0.45)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#4c0519',
        100: '#881337',
        200: '#9f1239',
        300: '#be123c',
        400: '#e11d48',
        500: '#f43f5e',
        600: '#fb7185',
        700: '#fda4af',
        800: '#fecdd3',
        900: '#ffe4e6',
        950: '#fff1f2'
      },
      primary: {
        main: '#fb7185',
        text: '#4c0519',
        hover: '#fda4af',
        active: '#fecdd3',
        light: 'rgba(244, 63, 94, 0.18)',
        border: 'rgba(244, 63, 94, 0.4)'
      },
      contrast: {
        main: '#fff1f2',
        text: '#4c0519',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#1c050c',
        section: '#2e0915',
        card: '#420f1f',
        overlay: '#420f1f',
        hover: '#58162b',
        active: '#6e1d37',
        border: '#5d192f',
        divider: '#5d192f'
      },
      text: {
        primary: '#fff1f2',
        secondary: '#fecdd3',
        muted: '#fb7185',
        disabled: '#64748b'
      },
      focus: {
        ring: '0 0 0 3px rgba(251, 113, 133, 0.35)',
        ringDanger: '0 0 0 3px rgba(252, 165, 165, 0.35)'
      },
      mask: {
        bg: 'rgba(28, 5, 12, 0.8)'
      }
    }
  }
});

export const nordTheme: GpThemeDefinition = extendTheme({
  id: 'nord',
  name: 'Nord (Arctic & Frost)',
  description: 'Arctic ice tones with cool muted polar slate surfaces.',
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.teal,
      primary: {
        main: '#0d9488',
        text: '#ffffff',
        hover: '#0f766e',
        active: '#115e59',
        light: '#f0fdfa',
        border: '#99f6e4'
      },
      contrast: {
        main: '#2e3440',
        text: '#eceff4',
        hover: '#3b4252'
      },
      surfaces: {
        ground: '#eceff4',
        section: '#e5e9f0',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#e5e9f0',
        active: '#d8dee9',
        border: '#d8dee9',
        divider: '#e5e9f0'
      },
      text: {
        primary: '#2e3440',
        secondary: '#4c566a',
        muted: '#88c0d0',
        disabled: '#d8dee9'
      },
      focus: {
        ring: '0 0 0 3px rgba(13, 148, 136, 0.28)',
        ringDanger: '0 0 0 3px rgba(191, 97, 106, 0.28)'
      },
      mask: {
        bg: 'rgba(46, 52, 64, 0.45)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#042f2e',
        100: '#134e4a',
        200: '#115e59',
        300: '#0f766e',
        400: '#0d9488',
        500: '#14b8a6',
        600: '#2dd4bf',
        700: '#5eead4',
        800: '#99f6e4',
        900: '#ccfbf1',
        950: '#f0fdfa'
      },
      primary: {
        main: '#88c0d0',
        text: '#2e3440',
        hover: '#81a1c1',
        active: '#8fbcbb',
        light: 'rgba(136, 192, 208, 0.18)',
        border: 'rgba(136, 192, 208, 0.4)'
      },
      contrast: {
        main: '#eceff4',
        text: '#2e3440',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#242933',
        section: '#2e3440',
        card: '#3b4252',
        overlay: '#3b4252',
        hover: '#434c5e',
        active: '#4c566a',
        border: '#4c566a',
        divider: '#4c566a'
      },
      text: {
        primary: '#eceff4',
        secondary: '#d8dee9',
        muted: '#88c0d0',
        disabled: '#4c566a'
      },
      focus: {
        ring: '0 0 0 3px rgba(136, 192, 208, 0.35)',
        ringDanger: '0 0 0 3px rgba(191, 97, 106, 0.35)'
      },
      mask: {
        bg: 'rgba(36, 41, 51, 0.8)'
      }
    }
  }
});

export const cyberpunkTheme: GpThemeDefinition = extendTheme({
  id: 'cyberpunk',
  name: 'Cyberpunk (Neon Amber & Cyan)',
  description: 'High-contrast tech palette with luminous neon amber and cyan in obsidian space.',
  primitives: {
    typography: {
      fontFamily: {
        sans: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      }
    },
    borderRadius: {
      base: '4px',
      sm: '2px',
      md: '6px',
      lg: '8px'
    }
  },
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.cyberpunk,
      primary: {
        main: '#ca8a04',
        text: '#000000',
        hover: '#a16207',
        active: '#854d0e',
        light: '#fef9c3',
        border: '#facc15'
      },
      contrast: {
        main: '#0f172a',
        text: '#facc15',
        hover: '#1e293b'
      },
      surfaces: {
        ground: '#f8fafc',
        section: '#f1f5f9',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#fef9c3',
        active: '#fef08a',
        border: '#e2e8f0',
        divider: '#e2e8f0'
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#94a3b8',
        disabled: '#cbd5e1'
      },
      focus: {
        ring: '0 0 0 3px rgba(234, 179, 8, 0.4)',
        ringDanger: '0 0 0 3px rgba(244, 63, 94, 0.4)'
      },
      mask: {
        bg: 'rgba(15, 23, 42, 0.5)'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#422006',
        100: '#713f12',
        200: '#854d0e',
        300: '#a16207',
        400: '#ca8a04',
        500: '#eab308',
        600: '#facc15',
        700: '#fde047',
        800: '#fef08a',
        900: '#fef9c3',
        950: '#fefce8'
      },
      primary: {
        main: '#facc15',
        text: '#050505',
        hover: '#fde047',
        active: '#fef08a',
        light: 'rgba(250, 204, 21, 0.2)',
        border: 'rgba(250, 204, 21, 0.5)'
      },
      secondary: {
        main: '#00f0ff',
        text: '#050505',
        hover: '#70f7ff',
        active: '#00c8d6',
        light: 'rgba(0, 240, 255, 0.2)'
      },
      contrast: {
        main: '#00f0ff',
        text: '#050505',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#07070a',
        section: '#0e0e14',
        card: '#151520',
        overlay: '#151520',
        hover: '#222233',
        active: '#2f2f47',
        border: '#28283c',
        divider: '#28283c'
      },
      text: {
        primary: '#fefce8',
        secondary: '#00f0ff',
        muted: '#ca8a04',
        disabled: '#475569'
      },
      focus: {
        ring: '0 0 0 3px rgba(250, 204, 21, 0.4)',
        ringDanger: '0 0 0 3px rgba(255, 0, 85, 0.4)'
      },
      mask: {
        bg: 'rgba(5, 5, 8, 0.85)'
      }
    }
  }
});

export const builtInThemes: GpThemeDefinition[] = [
  defaultTheme,
  oceanTheme,
  emeraldTheme,
  sunsetTheme,
  amethystTheme,
  roseTheme,
  nordTheme,
  cyberpunkTheme
];
