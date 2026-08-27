export interface GpThemeTokens {
  colors: Record<string, string>;
  fontFamily: Record<string, string>;
  fontSize: Record<string, [string, string]>; // [fontSize, lineHeight]
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  backdropBlur: Record<string, string>;
  breakpoints: Record<string, string>;
  gradients: Record<string, string>;
  transitionDuration: Record<string, string>;
  zIndex: Record<string, string>;
  animations: Record<string, string>;
  transforms: {
    scale: Record<string, string>;
    rotate: Record<string, string>;
  };
  ringWidth: Record<string, string>;
}

export const defaultTokens: GpThemeTokens = {
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: "#000000",
    white: "#ffffff",

    // gp-theme Semantic Theme Tokens
    primary: "var(--gp-primary, #4f46e5)",
    "primary-hover": "var(--gp-primary-hover, #4338ca)",
    "primary-active": "var(--gp-primary-active, #3730a3)",
    "primary-light": "var(--gp-primary-light, #eef2ff)",
    "primary-border": "var(--gp-primary-border, #a5b4fc)",
    secondary: "var(--gp-secondary, #64748b)",
    "secondary-hover": "var(--gp-secondary-hover, #475569)",
    "secondary-light": "var(--gp-secondary-light, #f1f5f9)",
    success: "var(--gp-success, #10b981)",
    "success-hover": "var(--gp-success-hover, #059669)",
    "success-light": "var(--gp-success-light, #ecfdf5)",
    info: "var(--gp-info, #0ea5e9)",
    "info-hover": "var(--gp-info-hover, #0284c7)",
    "info-light": "var(--gp-info-light, #f0f9ff)",
    warning: "var(--gp-warning, #f59e0b)",
    "warning-hover": "var(--gp-warning-hover, #d97706)",
    "warning-light": "var(--gp-warning-light, #fffbeb)",
    danger: "var(--gp-danger, #ef4444)",
    "danger-hover": "var(--gp-danger-hover, #dc2626)",
    "danger-light": "var(--gp-danger-light, #fef2f2)",
    contrast: "var(--gp-contrast, #0f172a)",
    "contrast-text": "var(--gp-contrast-text, #ffffff)",

    // gp-theme Surface & Text Tokens
    "surface-ground": "var(--gp-surface-ground, #f8fafc)",
    "surface-section": "var(--gp-surface-section, #f1f5f9)",
    "surface-card": "var(--gp-surface-card, #ffffff)",
    "surface-overlay": "var(--gp-surface-overlay, #ffffff)",
    "surface-hover": "var(--gp-surface-hover, #f1f5f9)",
    "surface-active": "var(--gp-surface-active, #e2e8f0)",
    "surface-border": "var(--gp-surface-border, #e2e8f0)",
    "surface-divider": "var(--gp-surface-divider, #e2e8f0)",
    "text-primary": "var(--gp-text-color, #1e293b)",
    "text-secondary": "var(--gp-text-color-secondary, #64748b)",
    "text-muted": "var(--gp-text-muted, #94a3b8)",
    "text-disabled": "var(--gp-text-disabled, #cbd5e1)",

    // Generated Pixel Design Tokens
    "bg-top": "var(--gp-surface-ground, var(--bg-top, #04070f))",
    "bg-mid": "var(--bg-mid, #081224)",
    "bg-bottom": "var(--bg-bottom, #050910)",
    panel: "var(--gp-surface-card, var(--panel, rgba(15, 23, 42, 0.78)))",
    "panel-border": "var(--gp-surface-border, var(--panel-border, rgba(148, 163, 184, 0.18)))",
    "text-main": "var(--gp-text-color, var(--text-main, #e2e8f0))",
    "text-soft": "var(--gp-text-color-secondary, var(--text-soft, #cbd5e1))",
    "text-faint": "var(--gp-text-disabled, var(--text-faint, #64748b))",
    accent: "var(--gp-primary, var(--accent, #67e8f9))",
    "accent-strong": "var(--gp-primary-hover, var(--accent-strong, #22d3ee))",
    "accent-glow": "rgba(103, 232, 249, 0.25)",
    shadow: "var(--shadow, rgba(2, 6, 23, 0.5))",

    // Slate Palette
    "slate-50": "#f8fafc",
    "slate-100": "#f1f5f9",
    "slate-200": "#e2e8f0",
    "slate-300": "#cbd5e1",
    "slate-400": "#94a3b8",
    "slate-500": "#64748b",
    "slate-600": "#475569",
    "slate-700": "#334155",
    "slate-800": "#1e293b",
    "slate-900": "#0f172a",
    "slate-950": "#020617",

    // Cyan / Accent Palette
    "cyan-50": "#ecfeff",
    "cyan-100": "#cffaff",
    "cyan-200": "#a5f3fc",
    "cyan-300": "#67e8f9",
    "cyan-400": "#22d3ee",
    "cyan-500": "#06b6d4",
    "cyan-600": "#0891b2",
    "cyan-700": "#0e7490",
    "cyan-800": "#155e75",
    "cyan-900": "#164e63",

    // Teal Palette
    "teal-400": "#2dd4bf",
    "teal-500": "#14b8a6",
    "teal-600": "#0d9488",

    // Purple / Indigo Palette
    "purple-400": "#c084fc",
    "purple-500": "#a855f7",
    "purple-600": "#9333ea",
    "purple-700": "#7e22ce",
    "indigo-500": "#6366f1",
    "indigo-600": "#4f46e5",

    // Status Colors
    "emerald-400": "#34d399",
    "emerald-500": "#10b981",
    "amber-400": "#fbbf24",
    "amber-500": "#f59e0b",
    "rose-500": "#f43f5e",
  },

  fontFamily: {
    sans: 'var(--gp-font-family, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    display: '"Outfit", "Inter", sans-serif',
  },

  fontSize: {
    xs: ["0.75rem", "1rem"],
    sm: ["0.875rem", "1.25rem"],
    base: ["1rem", "1.5rem"],
    lg: ["1.125rem", "1.75rem"],
    xl: ["1.25rem", "1.75rem"],
    "2xl": ["1.5rem", "2rem"],
    "3xl": ["1.875rem", "2.25rem"],
    "4xl": ["2.25rem", "2.5rem"],
    "5xl": ["3rem", "1"],
    "6xl": ["3.75rem", "1"],
    "7xl": ["4.5rem", "1"],
  },

  spacing: {
    "0": "var(--gp-space-0, 0px)",
    px: "var(--gp-space-px, 1px)",
    "0.5": "var(--gp-space-0-5, 0.125rem)",
    "1": "var(--gp-space-1, 0.25rem)",
    "1.5": "var(--gp-space-1-5, 0.375rem)",
    "2": "var(--gp-space-2, 0.5rem)",
    "2.5": "var(--gp-space-2-5, 0.625rem)",
    "3": "var(--gp-space-3, 0.75rem)",
    "3.5": "var(--gp-space-3-5, 0.875rem)",
    "4": "var(--gp-space-4, 1rem)",
    "5": "var(--gp-space-5, 1.25rem)",
    "6": "var(--gp-space-6, 1.5rem)",
    "7": "var(--gp-space-7, 1.75rem)",
    "8": "var(--gp-space-8, 2rem)",
    "9": "var(--gp-space-9, 2.25rem)",
    "10": "var(--gp-space-10, 2.5rem)",
    "12": "var(--gp-space-12, 3rem)",
    "14": "var(--gp-space-14, 3.5rem)",
    "16": "var(--gp-space-16, 4rem)",
    "20": "var(--gp-space-20, 5rem)",
    "24": "var(--gp-space-24, 6rem)",
    "28": "var(--gp-space-28, 7rem)",
    "32": "var(--gp-space-32, 8rem)",
    "40": "var(--gp-space-40, 10rem)",
    "48": "var(--gp-space-48, 12rem)",
    "56": "var(--gp-space-56, 14rem)",
    "64": "var(--gp-space-64, 16rem)",
    full: "100%",
    auto: "auto",
  },

  borderRadius: {
    none: "0px",
    sm: "var(--gp-border-radius-sm, 0.125rem)",
    DEFAULT: "var(--gp-border-radius, 0.25rem)",
    md: "var(--gp-border-radius-md, 0.375rem)",
    lg: "var(--gp-border-radius-lg, 0.5rem)",
    xl: "var(--gp-border-radius-xl, 0.75rem)",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  boxShadow: {
    sm: "var(--gp-shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05))",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    md: "var(--gp-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))",
    lg: "var(--gp-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1))",
    xl: "var(--gp-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.1))",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    glow: "0 0 25px rgba(103, 232, 249, 0.25)",
    "glow-lg": "0 0 40px rgba(103, 232, 249, 0.4)",
    panel: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    none: "none",
  },

  backdropBlur: {
    none: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  gradients: {
    "gradient-panel": "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(8, 18, 36, 0.6))",
    accent: "linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)",
    "accent-purple": "linear-gradient(135deg, #67e8f9 0%, #a855f7 100%)",
    hero: "radial-gradient(70% 55% at 50% 0%, rgba(56, 189, 248, 0.12), transparent 65%), linear-gradient(180deg, var(--bg-top) 0%, var(--bg-mid) 55%, var(--bg-bottom) 100%)",
  },

  transitionDuration: {
    fast: "100ms",
    DEFAULT: "150ms",
    slow: "300ms",
  },

  zIndex: {
    "0": "0",
    "10": "10",
    "20": "20",
    "30": "30",
    "40": "40",
    "50": "50",
    modal: "100",
    tooltip: "200",
  },

  animations: {
    spin: "gp-spin 1s linear infinite",
    pulse: "gp-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "gp-bounce 1s infinite",
    "fade-in": "gp-fadeIn 0.3s ease-out forwards",
    "slide-up": "gp-slideUp 0.3s ease-out forwards",
    shimmer: "gp-shimmer 2s linear infinite",
    "glow-pulse": "gp-glowPulse 2s infinite alternate",
  },

  transforms: {
    scale: {
      "0": "0",
      "50": "0.5",
      "75": "0.75",
      "90": "0.9",
      "95": "0.95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5",
    },
    rotate: {
      "0": "0deg",
      "1": "1deg",
      "2": "2deg",
      "3": "3deg",
      "6": "6deg",
      "12": "12deg",
      "45": "45deg",
      "90": "90deg",
      "180": "180deg",
      "-45": "-45deg",
      "-90": "-90deg",
      "-180": "-180deg",
    },
  },

  ringWidth: {
    "0": "0px",
    "1": "1px",
    DEFAULT: "3px",
    "2": "2px",
    "4": "4px",
    "8": "8px",
  },
};
