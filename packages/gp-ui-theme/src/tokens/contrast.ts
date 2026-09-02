/**
 * WCAG 2.2 Relative Luminance and Contrast Calculation Utilities for gp-ui-theme
 */

export interface ContrastEvaluation {
  ratio: number;
  formattedRatio: string;
  aaNormal: boolean; // >= 4.5:1
  aaLarge: boolean; // >= 3:1
  aaaNormal: boolean; // >= 7:1
  aaaLarge: boolean; // >= 4.5:1
  grade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

/**
 * Converts a 3, 6, or 8 character hex color code to sRGB [0..1, 0..1, 0..1]
 */
export function hexToRgb01(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length >= 6) {
    clean = clean.slice(0, 6);
  } else {
    return [0, 0, 0];
  }

  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
}

/**
 * Calculates WCAG relative luminance from an sRGB [0..1] triplet.
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const transform = (c: number) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates relative luminance directly from a hex color string.
 */
export function hexLuminance(hex: string): number {
  const [r, g, b] = hexToRgb01(hex);
  return getRelativeLuminance(r, g, b);
}

/**
 * Calculates contrast ratio between two hex colors according to WCAG 2.2 formula:
 * (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color.
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = hexLuminance(color1);
  const l2 = hexLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Evaluates full WCAG compliance metrics between foreground and background colors.
 */
export function evaluateContrast(fgHex: string, bgHex: string): ContrastEvaluation {
  const ratio = getContrastRatio(fgHex, bgHex);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  let grade: 'AAA' | 'AA' | 'AA Large' | 'Fail' = 'Fail';
  if (aaaNormal) {
    grade = 'AAA';
  } else if (aaNormal) {
    grade = 'AA';
  } else if (aaLarge) {
    grade = 'AA Large';
  }

  return {
    ratio,
    formattedRatio: `${ratio}:1`,
    aaNormal,
    aaLarge,
    aaaNormal,
    aaaLarge,
    grade
  };
}

/**
 * Automatically adjusts the lightness of a foreground color along its HSL axis
 * until it achieves the target WCAG contrast ratio against the specified background.
 *
 * @param hexColor Initial color to adjust (preserves hue and saturation)
 * @param targetRatio Desired minimum contrast ratio (e.g. 4.5 for AA, 7.0 for AAA)
 * @param backgroundHex Background color to evaluate contrast against
 * @returns An adjusted hex color code meeting the target ratio
 */
export function autoTuneContrast(hexColor: string, targetRatio = 7.0, backgroundHex = '#ffffff'): string {
  if (getContrastRatio(hexColor, backgroundHex) >= targetRatio) {
    return hexColor;
  }

  // Parse color to RGB
  const [r, g, b] = hexToRgb01(hexColor);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

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

  const hueDeg = Math.round(h * 360);
  const satPercent = Math.round(s * 100);
  const bgLum = hexLuminance(backgroundHex);

  // If dark background, increase lightness; if light background, decrease lightness
  const step = bgLum < 0.5 ? 1 : -1;
  let currentL = Math.round(l * 100);

  const formatHslToHex = (hDeg: number, sPct: number, lPct: number): string => {
    const sat = sPct / 100;
    const light = lPct / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs(((hDeg / 60) % 2) - 1));
    const m = light - c / 2;
    let red = 0,
      green = 0,
      blue = 0;

    if (0 <= hDeg && hDeg < 60) {
      red = c;
      green = x;
      blue = 0;
    } else if (60 <= hDeg && hDeg < 120) {
      red = x;
      green = c;
      blue = 0;
    } else if (120 <= hDeg && hDeg < 180) {
      red = 0;
      green = c;
      blue = x;
    } else if (180 <= hDeg && hDeg < 240) {
      red = 0;
      green = x;
      blue = c;
    } else if (240 <= hDeg && hDeg < 300) {
      red = x;
      green = 0;
      blue = c;
    } else if (300 <= hDeg && hDeg < 360) {
      red = c;
      green = 0;
      blue = x;
    }

    const rHex = Math.round((red + m) * 255)
      .toString(16)
      .padStart(2, '0');
    const gHex = Math.round((green + m) * 255)
      .toString(16)
      .padStart(2, '0');
    const bHex = Math.round((blue + m) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${rHex}${gHex}${bHex}`;
  };

  while (currentL >= 0 && currentL <= 100) {
    const candidateHex = formatHslToHex(hueDeg, satPercent, currentL);
    if (getContrastRatio(candidateHex, backgroundHex) >= targetRatio) {
      return candidateHex;
    }
    currentL += step;
  }

  // Fallback to extreme if unreachable with saturation
  return bgLum < 0.5 ? '#ffffff' : '#000000';
}
