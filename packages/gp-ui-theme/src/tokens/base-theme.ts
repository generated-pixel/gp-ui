/**
 * gp-ui Base Theme Definition
 * The foundational theme definition containing complete Primitives, Semantic (Light & Dark),
 * and Component styling layers.
 */
import { GpThemeDefinition } from './types';
import { defaultPrimitives } from './primitives';

export const baseTheme: GpThemeDefinition = {
  id: 'default',
  name: 'Default (Indigo & Slate)',
  description: 'Clean, modern enterprise styling with deep indigo accents.',
  author: 'Generated Pixel',
  primitives: defaultPrimitives,
  light: {
    semantic: {
      primaryScale: defaultPrimitives.colors.indigo,
      primary: {
        main: '#4f46e5',
        text: '#ffffff',
        hover: '#4338ca',
        active: '#3730a3',
        light: '#eef2ff',
        border: '#a5b4fc'
      },
      secondary: {
        main: '#64748b',
        text: '#ffffff',
        hover: '#475569',
        active: '#334155',
        light: '#f1f5f9'
      },
      success: {
        main: '#10b981',
        text: '#ffffff',
        hover: '#059669',
        active: '#047857',
        light: '#ecfdf5',
        border: '#a7f3d0'
      },
      info: {
        main: '#0ea5e9',
        text: '#ffffff',
        hover: '#0284c7',
        active: '#0369a1',
        light: '#f0f9ff',
        border: '#bae6fd'
      },
      warning: {
        main: '#f59e0b',
        text: '#ffffff',
        hover: '#d97706',
        active: '#b45309',
        light: '#fffbeb',
        border: '#fde68a'
      },
      danger: {
        main: '#ef4444',
        text: '#ffffff',
        hover: '#dc2626',
        active: '#b91c1c',
        light: '#fef2f2',
        border: '#fecaca'
      },
      contrast: {
        main: '#0f172a',
        text: '#ffffff',
        hover: '#1e293b'
      },
      surfaces: {
        ground: '#f8fafc',
        section: '#f1f5f9',
        card: '#ffffff',
        overlay: '#ffffff',
        hover: '#f1f5f9',
        active: '#e2e8f0',
        border: '#e2e8f0',
        divider: '#e2e8f0'
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        muted: '#94a3b8',
        disabled: '#cbd5e1'
      },
      focus: {
        ring: '0 0 0 3px rgba(99, 102, 241, 0.25)',
        ringDanger: '0 0 0 3px rgba(239, 68, 68, 0.25)'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      },
      mask: {
        bg: 'rgba(15, 23, 42, 0.45)'
      },
      scrollbar: {
        thumb: 'rgba(100, 116, 139, 0.32)',
        thumbHover: 'rgba(100, 116, 139, 0.55)',
        track: 'transparent',
        size: '8px',
        radius: '4px'
      }
    },
    components: {
      button: {
        height: '2.5rem',
        paddingX: '1rem',
        paddingY: '0.5rem',
        borderRadius: '6px',
        fontWeight: 600
      },
      input: {
        bg: '#ffffff',
        border: '#cbd5e1',
        borderHover: '#94a3b8',
        borderFocus: '#4f46e5',
        paddingX: '0.75rem',
        paddingY: '0.5rem',
        height: '2.5rem',
        borderRadius: '6px'
      },
      inputNumber: {
        buttonBackground: 'transparent',
        buttonWidth: '1.75rem',
        horizontalButtonWidth: '2.5rem'
      },
      datePicker: {
        triggerColor: '{semantic.text.muted}',
        panelBackground: '{semantic.surfaces.overlay}',
        panelBorderColor: '{semantic.surfaces.border}',
        panelShadow: '{semantic.shadows.lg}',
        dayHoverBackground: '{semantic.surfaces.hover}',
        selectedBackground: '{semantic.primary.main}',
        selectedColor: '{semantic.primary.text}'
      },
      card: {
        bg: '#ffffff',
        border: '#e2e8f0',
        borderRadius: '8px',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      },
      tooltip: {
        bg: '#0f172a',
        text: '#ffffff',
        fontSize: '0.75rem',
        borderRadius: '6px',
        paddingX: '0.75rem',
        paddingY: '0.375rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)'
      },
      autocomplete: {
        background: '#ffffff',
        borderColor: '#cbd5e1',
        borderRadius: '6px',
        dropdown: {
          width: '2.25rem',
          background: '#f1f5f9',
          borderColor: '#cbd5e1',
          color: '#64748b',
          hoverBackground: '#e2e8f0'
        },
        overlay: {
          background: '#ffffff',
          borderColor: '#e2e8f0',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        item: {
          padding: '0.5rem 0.75rem',
          borderRadius: '4px',
          focusBackground: '#f1f5f9',
          focusColor: '#1e293b',
          selectedBackground: '#eef2ff',
          selectedColor: '#4f46e5'
        }
      },
      select: {
        background: '#ffffff',
        borderColor: '#cbd5e1',
        borderHover: '#94a3b8',
        borderFocus: '#4f46e5',
        borderRadius: '6px',
        placeholderColor: '#94a3b8',
        overlay: {
          background: '#ffffff',
          borderColor: '#e2e8f0',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        item: {
          padding: '0.5rem 0.75rem',
          focusBackground: '#f1f5f9',
          selectedBackground: '#eef2ff'
        }
      },
      dialog: {
        background: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: '8px',
        shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        header: {
          padding: '1.25rem 1.5rem',
          fontSize: '1.25rem',
          fontWeight: 600
        },
        content: {
          padding: '1.5rem'
        },
        footer: {
          padding: '1rem 1.5rem'
        }
      },
      table: {
        background: '#ffffff',
        borderColor: '#e2e8f0',
        header: {
          background: '#f8fafc',
          color: '#1e293b',
          padding: '0.75rem 1rem',
          fontWeight: 600
        },
        row: {
          hoverBackground: '#f1f5f9',
          stripedBackground: '#f8fafc',
          selectedBackground: '#eef2ff'
        },
        cell: {
          padding: '0.75rem 1rem'
        }
      },
      toast: {
        borderRadius: '8px',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '1rem'
      },
      grid: {
        padding: '0',
        margin: '0',
        gap: '1rem',
        rowGap: '1rem',
        columnGap: '1rem',
        spacing: '1rem',
        guideBorderColor: 'rgba(148, 163, 184, 0.12)',
        placeholderBorderColor: '#6366f1',
        placeholderBackground: 'rgba(99, 102, 241, 0.08)'
      },
      gridWidget: {
        background: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderRadius: '10px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        padding: '0',
        margin: '0',
        gap: '0.5rem',
        spacing: '0.5rem',
        headerBackground: '#f8fafc',
        headerBorderColor: 'rgba(148, 163, 184, 0.15)',
        headerPadding: '0.625rem 0.875rem',
        headerMargin: '0',
        bodyPadding: '0.875rem',
        footerPadding: '0.625rem 0.875rem',
        dragHandleColor: '#94a3b8',
        dragHandleHoverColor: '#6366f1',
        resizeHandleColor: '#94a3b8',
        lockedBorderColor: '#f59e0b'
      },
      blockCard: {
        background: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        padding: '1.75rem',
        margin: '0',
        gap: '1.25rem',
        spacing: '1.25rem',
        headerBackground: '#f8fafc',
        headerBorderColor: 'rgba(148, 163, 184, 0.15)',
        headerPadding: '1.25rem 1.75rem',
        bodyPadding: '1.75rem',
        footerPadding: '1.25rem 1.75rem'
      },
      sidebar: {
        width: '260px',
        padding: '1rem 0.75rem',
        margin: '0',
        gap: '0.75rem',
        spacing: '0.75rem',
        navItemPadding: '0.55rem 0.85rem',
        navItemMargin: '0.15rem 0',
        navItemGap: '0.65rem',
        darkBackground: '#0f172a',
        lightBackground: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.15)',
        navItemHoverBackground: 'rgba(0, 0, 0, 0.04)',
        navItemActiveBackground: 'rgba(99, 102, 241, 0.1)',
        navItemActiveColor: '#4f46e5'
      },
      kpiCard: {
        background: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.15)',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        margin: '0',
        gap: '0.5rem',
        spacing: '0.5rem',
        trendGap: '0.35rem',
        labelColor: '#64748b',
        valueColor: '#0f172a',
        valueFontSize: '1.75rem',
        iconBackground: 'rgba(99, 102, 241, 0.1)',
        trendPositiveColor: '#16a34a',
        trendNegativeColor: '#ef4444',
        trendNeutralColor: '#64748b'
      }
    }
  },
  dark: {
    semantic: {
      primaryScale: {
        50: '#1e1b4b',
        100: '#312e81',
        200: '#3730a3',
        300: '#4338ca',
        400: '#4f46e5',
        500: '#6366f1',
        600: '#818cf8',
        700: '#a5b4fc',
        800: '#c7d2fe',
        900: '#e0e7ff',
        950: '#eef2ff'
      },
      primary: {
        main: '#818cf8',
        text: '#0f172a',
        hover: '#a5b4fc',
        active: '#c7d2fe',
        light: 'rgba(99, 102, 241, 0.15)',
        border: 'rgba(99, 102, 241, 0.4)'
      },
      secondary: {
        main: '#94a3b8',
        text: '#0f172a',
        hover: '#cbd5e1',
        active: '#e2e8f0',
        light: 'rgba(148, 163, 184, 0.15)'
      },
      success: {
        main: '#34d399',
        text: '#022c22',
        hover: '#6ee7b7',
        active: '#a7f3d0',
        light: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.35)'
      },
      info: {
        main: '#38bdf8',
        text: '#082f49',
        hover: '#7dd3fc',
        active: '#bae6fd',
        light: 'rgba(14, 165, 233, 0.15)',
        border: 'rgba(14, 165, 233, 0.35)'
      },
      warning: {
        main: '#fbbf24',
        text: '#451a03',
        hover: '#fcd34d',
        active: '#fde68a',
        light: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.35)'
      },
      danger: {
        main: '#f87171',
        text: '#450a0a',
        hover: '#fca5a5',
        active: '#fecaca',
        light: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.35)'
      },
      contrast: {
        main: '#f8fafc',
        text: '#0f172a',
        hover: '#ffffff'
      },
      surfaces: {
        ground: '#0b0f19',
        section: '#111827',
        card: '#1e293b',
        overlay: '#1e293b',
        hover: '#334155',
        active: '#475569',
        border: '#334155',
        divider: '#334155'
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8',
        muted: '#64748b',
        disabled: '#475569'
      },
      focus: {
        ring: '0 0 0 3px rgba(129, 140, 248, 0.35)',
        ringDanger: '0 0 0 3px rgba(248, 113, 113, 0.35)'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)'
      },
      mask: {
        bg: 'rgba(0, 0, 0, 0.75)'
      },
      scrollbar: {
        thumb: 'rgba(148, 163, 184, 0.35)',
        thumbHover: 'rgba(148, 163, 184, 0.55)',
        track: 'transparent',
        size: '8px',
        radius: '4px'
      }
    },
    components: {
      button: {
        height: '2.5rem',
        paddingX: '1rem',
        paddingY: '0.5rem',
        borderRadius: '6px',
        fontWeight: 600
      },
      input: {
        bg: '#0f172a',
        border: '#334155',
        borderHover: '#64748b',
        borderFocus: '#818cf8',
        paddingX: '0.75rem',
        paddingY: '0.5rem',
        height: '2.5rem',
        borderRadius: '6px'
      },
      inputNumber: {
        buttonBackground: 'transparent',
        buttonWidth: '1.75rem',
        horizontalButtonWidth: '2.5rem'
      },
      datePicker: {
        triggerColor: '{semantic.text.muted}',
        panelBackground: '{semantic.surfaces.overlay}',
        panelBorderColor: '{semantic.surfaces.border}',
        panelShadow: '{semantic.shadows.lg}',
        dayHoverBackground: '{semantic.surfaces.hover}',
        selectedBackground: '{semantic.primary.main}',
        selectedColor: '{semantic.primary.text}'
      },
      card: {
        bg: '#1e293b',
        border: '#334155',
        borderRadius: '8px',
        shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.5)'
      },
      tooltip: {
        bg: '#f8fafc',
        text: '#0f172a',
        fontSize: '0.75rem',
        borderRadius: '6px',
        paddingX: '0.75rem',
        paddingY: '0.375rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
      },
      autocomplete: {
        background: '#0f172a',
        borderColor: '#334155',
        borderRadius: '6px',
        dropdown: {
          width: '2.25rem',
          background: '#1e293b',
          borderColor: '#334155',
          color: '#94a3b8',
          hoverBackground: '#334155'
        },
        overlay: {
          background: '#1e293b',
          borderColor: '#334155',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
        },
        item: {
          padding: '0.5rem 0.75rem',
          borderRadius: '4px',
          focusBackground: '#334155',
          focusColor: '#f8fafc',
          selectedBackground: 'rgba(99, 102, 241, 0.25)',
          selectedColor: '#818cf8'
        }
      },
      select: {
        background: '#0f172a',
        borderColor: '#334155',
        borderHover: '#64748b',
        borderFocus: '#818cf8',
        borderRadius: '6px',
        placeholderColor: '#64748b',
        overlay: {
          background: '#1e293b',
          borderColor: '#334155',
          shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)'
        },
        item: {
          padding: '0.5rem 0.75rem',
          focusBackground: '#334155',
          selectedBackground: 'rgba(99, 102, 241, 0.25)'
        }
      },
      dialog: {
        background: '#1e293b',
        borderColor: '#334155',
        borderRadius: '8px',
        shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
        header: {
          padding: '1.25rem 1.5rem',
          fontSize: '1.25rem',
          fontWeight: 600
        },
        content: {
          padding: '1.5rem'
        },
        footer: {
          padding: '1rem 1.5rem'
        }
      },
      table: {
        background: '#1e293b',
        borderColor: '#334155',
        header: {
          background: '#111827',
          color: '#f8fafc',
          padding: '0.75rem 1rem',
          fontWeight: 600
        },
        row: {
          hoverBackground: '#334155',
          stripedBackground: '#111827',
          selectedBackground: 'rgba(99, 102, 241, 0.25)'
        },
        cell: {
          padding: '0.75rem 1rem'
        }
      },
      toast: {
        borderRadius: '8px',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        padding: '1rem'
      },
      grid: {
        padding: '0',
        margin: '0',
        gap: '1rem',
        rowGap: '1rem',
        columnGap: '1rem',
        spacing: '1rem',
        guideBorderColor: 'rgba(148, 163, 184, 0.08)',
        placeholderBorderColor: '#818cf8',
        placeholderBackground: 'rgba(99, 102, 241, 0.15)'
      },
      gridWidget: {
        background: '#0f172a',
        borderColor: 'rgba(148, 163, 184, 0.15)',
        borderRadius: '10px',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        padding: '0',
        margin: '0',
        gap: '0.5rem',
        spacing: '0.5rem',
        headerBackground: 'rgba(255, 255, 255, 0.02)',
        headerBorderColor: 'rgba(148, 163, 184, 0.1)',
        headerPadding: '0.625rem 0.875rem',
        headerMargin: '0',
        bodyPadding: '0.875rem',
        footerPadding: '0.625rem 0.875rem',
        dragHandleColor: '#94a3b8',
        dragHandleHoverColor: '#818cf8',
        resizeHandleColor: '#64748b',
        lockedBorderColor: '#f59e0b'
      },
      blockCard: {
        background: '#0f172a',
        borderColor: 'rgba(148, 163, 184, 0.15)',
        borderRadius: '12px',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        padding: '1.75rem',
        margin: '0',
        gap: '1.25rem',
        spacing: '1.25rem',
        headerBackground: 'rgba(255, 255, 255, 0.02)',
        headerBorderColor: 'rgba(148, 163, 184, 0.1)',
        headerPadding: '1.25rem 1.75rem',
        bodyPadding: '1.75rem',
        footerPadding: '1.25rem 1.75rem'
      },
      sidebar: {
        width: '260px',
        padding: '1rem 0.75rem',
        margin: '0',
        gap: '0.75rem',
        spacing: '0.75rem',
        navItemPadding: '0.55rem 0.85rem',
        navItemMargin: '0.15rem 0',
        navItemGap: '0.65rem',
        darkBackground: '#0b0f19',
        lightBackground: '#1e293b',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        navItemHoverBackground: 'rgba(255, 255, 255, 0.06)',
        navItemActiveBackground: 'rgba(99, 102, 241, 0.2)',
        navItemActiveColor: '#818cf8'
      },
      kpiCard: {
        background: '#0f172a',
        borderColor: 'rgba(148, 163, 184, 0.15)',
        borderRadius: '10px',
        padding: '1.25rem 1.5rem',
        margin: '0',
        gap: '0.5rem',
        spacing: '0.5rem',
        trendGap: '0.35rem',
        labelColor: '#94a3b8',
        valueColor: '#f8fafc',
        valueFontSize: '1.75rem',
        iconBackground: 'rgba(99, 102, 241, 0.15)',
        trendPositiveColor: '#22c55e',
        trendNegativeColor: '#ef4444',
        trendNeutralColor: '#94a3b8'
      }
    }
  }
};
