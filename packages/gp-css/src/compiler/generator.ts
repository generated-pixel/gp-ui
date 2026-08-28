import { defaultTokens } from "../tokens/default-tokens.js";
import type { GpThemeTokens } from "../tokens/default-tokens.js";

export interface GeneratorOptions {
  tokens?: GpThemeTokens;
  prefix?: string;
}

export interface GeneratedRule {
  className: string;
  selector: string;
  mediaQuery?: string;
  cssText: string;
}

export class GpCssGenerator {
  private tokens: GpThemeTokens;
  private prefix: string;

  constructor(options: GeneratorOptions = {}) {
    this.tokens = options.tokens || defaultTokens;
    this.prefix = options.prefix || "";
  }

  public generateRule(candidate: string): GeneratedRule | null {
    let raw = candidate;

    if (this.prefix && raw.startsWith(this.prefix)) {
      raw = raw.slice(this.prefix.length);
    } else if (raw.startsWith("gp-")) {
      raw = raw.slice(3);
    }

    const parts = raw.split(":");
    const baseCandidate = parts.pop()!;
    const modifiers = parts;

    const baseCss = this.resolveBaseRule(baseCandidate);
    if (!baseCss) return null;

    let mediaQuery: string | undefined = undefined;
    const pseudoClasses: string[] = [];
    let customSelectorPrefix = "";

    for (const mod of modifiers) {
      if (this.tokens.breakpoints[mod]) {
        const bp = this.tokens.breakpoints[mod];
        if (isValidCssValue(bp)) {
          mediaQuery = `(min-width: ${bp})`;
        }
      } else if (mod === "hover") {
        pseudoClasses.push(":hover");
      } else if (mod === "focus") {
        pseudoClasses.push(":focus");
      } else if (mod === "focus-within") {
        pseudoClasses.push(":focus-within");
      } else if (mod === "focus-visible") {
        pseudoClasses.push(":focus-visible");
      } else if (mod === "active") {
        pseudoClasses.push(":active");
      } else if (mod === "disabled") {
        pseudoClasses.push(":disabled");
      } else if (mod === "first") {
        pseudoClasses.push(":first-child");
      } else if (mod === "last") {
        pseudoClasses.push(":last-child");
      } else if (mod === "odd") {
        pseudoClasses.push(":nth-child(odd)");
      } else if (mod === "even") {
        pseudoClasses.push(":nth-child(even)");
      } else if (mod === "peer-hover") {
        customSelectorPrefix = ".peer:hover ";
      } else if (mod === "peer-focus") {
        customSelectorPrefix = ".peer:focus ";
      } else if (mod === "group-hover") {
        customSelectorPrefix = ".group:hover ";
      } else if (mod === "dark") {
        customSelectorPrefix = ".dark ";
      }
    }

    const escapedClassName = escapeSelector(candidate);
    let selector = `${customSelectorPrefix}.${escapedClassName}`;

    if (pseudoClasses.length > 0) {
      selector += pseudoClasses.join("");
    }

    const cssText = `${selector} { ${baseCss} }`;

    return {
      className: candidate,
      selector,
      mediaQuery,
      cssText,
    };
  }

  private resolveBaseRule(candidate: string): string | null {
    // 1. Flexbox, Grid, Alignment & Display Primitives
    const displayMap: Record<string, string> = {
      block: "display: block;",
      "inline-block": "display: inline-block;",
      inline: "display: inline;",
      flex: "display: flex;",
      "inline-flex": "display: inline-flex;",
      grid: "display: grid;",
      "inline-grid": "display: inline-grid;",
      hidden: "display: none;",
      "flex-row": "flex-direction: row;",
      "flex-row-reverse": "flex-direction: row-reverse;",
      "flex-col": "flex-direction: column;",
      "flex-col-reverse": "flex-direction: column-reverse;",
      "flex-wrap": "flex-wrap: wrap;",
      "flex-nowrap": "flex-wrap: nowrap;",
      "flex-1": "flex: 1 1 0%;",
      "flex-auto": "flex: 1 1 auto;",
      "flex-initial": "flex: 0 1 auto;",
      "flex-none": "flex: none;",
      grow: "flex-grow: 1;",
      "grow-0": "flex-grow: 0;",
      shrink: "flex-shrink: 1;",
      "shrink-0": "flex-shrink: 0;",

      // Align Items
      "items-start": "align-items: flex-start;",
      "items-end": "align-items: flex-end;",
      "items-center": "align-items: center;",
      "items-baseline": "align-items: baseline;",
      "items-stretch": "align-items: stretch;",

      // Justify Content
      "justify-start": "justify-content: flex-start;",
      "justify-end": "justify-content: flex-end;",
      "justify-center": "justify-content: center;",
      "justify-between": "justify-content: space-between;",
      "justify-around": "justify-content: space-around;",
      "justify-evenly": "justify-content: space-evenly;",

      // Align Self
      "self-auto": "align-self: auto;",
      "self-start": "align-self: flex-start;",
      "self-end": "align-self: flex-end;",
      "self-center": "align-self: center;",
      "self-stretch": "align-self: stretch;",

      // Align Content
      "content-center": "align-content: center;",
      "content-start": "align-content: flex-start;",
      "content-end": "align-content: flex-end;",
      "content-between": "align-content: space-between;",
      "content-around": "align-content: space-around;",

      // Place Items & Content
      "place-items-center": "place-items: center;",
      "place-items-start": "place-items: start;",
      "place-items-end": "place-items: end;",
      "place-items-stretch": "place-items: stretch;",
      "place-content-center": "place-content: center;",
      "place-content-between": "place-content: space-between;",

      // Text Alignment, Clipping & Styling
      "text-left": "text-align: left;",
      "text-center": "text-align: center;",
      "text-right": "text-align: right;",
      "text-justify": "text-align: justify;",
      uppercase: "text-transform: uppercase;",
      lowercase: "text-transform: lowercase;",
      capitalize: "text-transform: capitalize;",
      "normal-case": "text-transform: none;",
      italic: "font-style: italic;",
      "not-italic": "font-style: normal;",
      underline: "text-decoration-line: underline;",
      "line-through": "text-decoration-line: line-through;",
      "no-underline": "text-decoration-line: none;",
      truncate: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
      "bg-clip-text": "-webkit-background-clip: text; background-clip: text;",

      // Positioning Primitives
      relative: "position: relative;",
      absolute: "position: absolute;",
      fixed: "position: fixed;",
      sticky: "position: sticky;",
      "inset-0": "top: 0px; right: 0px; bottom: 0px; left: 0px;",
      "inset-x-0": "left: 0px; right: 0px;",
      "inset-y-0": "top: 0px; bottom: 0px;",
      "top-0": "top: 0px;",
      "right-0": "right: 0px;",
      "bottom-0": "bottom: 0px;",
      "left-0": "left: 0px;",

      // Sizing
      "w-full": "width: 100%;",
      "w-screen": "width: 100vw;",
      "w-auto": "width: auto;",
      "h-full": "height: 100%;",
      "h-screen": "height: 100vh;",
      "h-auto": "height: auto;",
      "min-h-screen": "min-height: 100vh;",
      "max-w-full": "max-width: 100%;",
      "overflow-hidden": "overflow: hidden;",
      "overflow-auto": "overflow: auto;",
      "overflow-scroll": "overflow: scroll;",
      "pointer-events-none": "pointer-events: none;",
      "pointer-events-auto": "pointer-events: auto;",
      "select-none": "user-select: none;",
      "select-all": "user-select: all;",
      "select-text": "user-select: text;",

      // Transforms
      transform: "transform: translate(var(--gp-translate-x, 0), var(--gp-translate-y, 0)) rotate(var(--gp-rotate, 0)) scaleX(var(--gp-scale-x, 1)) scaleY(var(--gp-scale-y, 1));",
      "transform-gpu": "transform: translate3d(var(--gp-translate-x, 0), var(--gp-translate-y, 0), 0) rotate(var(--gp-rotate, 0)) scaleX(var(--gp-scale-x, 1)) scaleY(var(--gp-scale-y, 1));",

      // Transitions & Timing
      "transition-all": "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
      transition: "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 200ms;",
      "ease-linear": "transition-timing-function: linear;",
      "ease-in": "transition-timing-function: cubic-bezier(0.4, 0, 1, 1);",
      "ease-out": "transition-timing-function: cubic-bezier(0, 0, 0.2, 1);",
      "ease-in-out": "transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);",
    };

    if (displayMap[candidate]) {
      return displayMap[candidate];
    }

    // 2. Keyframe Animations & Duration
    if (candidate.startsWith("animate-")) {
      const animKey = candidate.slice(8);
      if (this.tokens.animations[animKey]) {
        const val = this.tokens.animations[animKey];
        if (isValidCssValue(val)) return `animation: ${val};`;
      }
    }
    if (candidate.startsWith("duration-")) {
      const ms = candidate.slice(9);
      if (/^[0-9]+$/.test(ms)) return `transition-duration: ${ms}ms; animation-duration: ${ms}ms;`;
    }
    if (candidate.startsWith("delay-")) {
      const ms = candidate.slice(6);
      if (/^[0-9]+$/.test(ms)) return `transition-delay: ${ms}ms; animation-delay: ${ms}ms;`;
    }

    // 3. Transforms: Scale, Rotate, Translate
    if (candidate.startsWith("scale-")) {
      const sc = candidate.slice(6);
      if (this.tokens.transforms.scale[sc]) {
        const val = this.tokens.transforms.scale[sc];
        if (isValidCssValue(val)) return `--gp-scale-x: ${val}; --gp-scale-y: ${val}; transform: scale(${val});`;
      }
    }
    if (candidate.startsWith("rotate-")) {
      const rot = candidate.slice(7);
      if (this.tokens.transforms.rotate[rot]) {
        const val = this.tokens.transforms.rotate[rot];
        if (isValidCssValue(val)) return `--gp-rotate: ${val}; transform: rotate(${val});`;
      }
    }
    if (candidate.startsWith("-rotate-")) {
      const rot = "-" + candidate.slice(8);
      if (this.tokens.transforms.rotate[rot]) {
        const val = this.tokens.transforms.rotate[rot];
        if (isValidCssValue(val)) return `--gp-rotate: ${val}; transform: rotate(${val});`;
      }
    }

    // 4. Ring Focus Utilities
    if (candidate.startsWith("ring")) {
      if (candidate === "ring") {
        return "box-shadow: 0 0 0 var(--gp-ring-width, 3px) var(--gp-ring-color, var(--gp-primary, #6366f1));";
      }
      if (candidate.startsWith("ring-")) {
        const key = candidate.slice(5);
        if (this.tokens.ringWidth[key]) {
          const rw = this.tokens.ringWidth[key];
          if (isValidCssValue(rw)) {
            return `--gp-ring-width: ${rw}; box-shadow: 0 0 0 ${rw} var(--gp-ring-color, var(--gp-primary, #6366f1));`;
          }
        }
        const val = this.resolveValueOrArbitrary(key, this.tokens.colors);
        if (val) {
          return `--gp-ring-color: ${val}; box-shadow: 0 0 0 var(--gp-ring-width, 3px) ${val};`;
        }
      }
    }

    // 5. Preset Glassmorphism & Visual Effects
    if (candidate === "glass" || candidate === "glass-panel") {
      return "background: var(--gp-surface-card, var(--panel, rgba(15, 23, 42, 0.78))); border: 1px solid var(--gp-surface-border, var(--panel-border, rgba(148, 163, 184, 0.18))); backdrop-filter: blur(12px); box-shadow: var(--gp-shadow-md, 0 8px 32px 0 rgba(0, 0, 0, 0.37));";
    }
    if (candidate === "glow" || candidate === "glow-accent") {
      return "box-shadow: 0 0 25px rgba(103, 232, 249, 0.35);";
    }
    if (candidate === "glow-purple") {
      return "box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);";
    }

    // 6. Spacing: Padding, Margin, Gap
    const spacingPropMap: Record<string, string[]> = {
      p: ["padding"],
      px: ["padding-left", "padding-right"],
      py: ["padding-top", "padding-bottom"],
      pt: ["padding-top"],
      pr: ["padding-right"],
      pb: ["padding-bottom"],
      pl: ["padding-left"],
      m: ["margin"],
      mx: ["margin-left", "margin-right"],
      my: ["margin-top", "margin-bottom"],
      mt: ["margin-top"],
      mr: ["margin-right"],
      mb: ["margin-bottom"],
      ml: ["margin-left"],
      gap: ["gap"],
      "gap-x": ["column-gap"],
      "gap-y": ["row-gap"],
    };

    for (const [prefix, props] of Object.entries(spacingPropMap)) {
      if (candidate.startsWith(`${prefix}-`)) {
        const valKey = candidate.slice(prefix.length + 1);
        const val = this.resolveValueOrArbitrary(valKey, this.tokens.spacing);
        if (val) {
          return props.map((p) => `${p}: ${val};`).join(" ");
        }
      }
    }

    // 7. Colors: Background, Text, Border, Gradients
    if (candidate.startsWith("bg-gradient-to-")) {
      const dir = candidate.slice(15);
      const dirMap: Record<string, string> = {
        r: "to right",
        l: "to left",
        t: "to top",
        b: "to bottom",
        br: "to bottom right",
        bl: "to bottom left",
        tr: "to top right",
        tl: "to top left",
      };
      if (dirMap[dir]) {
        return `background-image: linear-gradient(${dirMap[dir]}, var(--gp-gradient-stops, var(--gp-from, transparent), var(--gp-to, transparent)));`;
      }
    }

    if (candidate.startsWith("from-")) {
      const valKey = candidate.slice(5);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `--gp-from: ${val}; --gp-gradient-stops: var(--gp-from), var(--gp-to, transparent);`;
    }
    if (candidate.startsWith("to-")) {
      const valKey = candidate.slice(3);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `--gp-to: ${val};`;
    }

    if (candidate.startsWith("bg-")) {
      const valKey = candidate.slice(3);
      if (this.tokens.gradients[valKey]) {
        const gVal = this.tokens.gradients[valKey];
        if (isValidCssValue(gVal)) return `background-image: ${gVal};`;
      }
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `background-color: ${val};`;
    }

    if (candidate.startsWith("text-")) {
      const valKey = candidate.slice(5);
      if (valKey === "transparent") return "color: transparent;";
      if (this.tokens.fontSize[valKey]) {
        const [size, leading] = this.tokens.fontSize[valKey];
        if (isValidCssValue(size) && isValidCssValue(leading)) {
          return `font-size: ${size}; line-height: ${leading};`;
        }
      }
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `color: ${val};`;
    }

    if (candidate.startsWith("border-")) {
      const valKey = candidate.slice(7);
      if (valKey === "DEFAULT" || valKey === "" || valKey === "1") {
        return "border-width: 1px; border-style: solid; border-color: var(--gp-surface-border, rgba(148, 163, 184, 0.2));";
      }
      if (/^[0-9]+px$/.test(valKey) || /^[0-9]+$/.test(valKey)) {
        const width = /^[0-9]+$/.test(valKey) ? `${valKey}px` : valKey;
        return `border-width: ${width}; border-style: solid;`;
      }
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `border-color: ${val}; border-style: solid;`;
    }

    // 8. Border Radius
    if (candidate.startsWith("rounded")) {
      if (candidate === "rounded") {
        const rDef = this.tokens.borderRadius['DEFAULT'];
        if (isValidCssValue(rDef)) return `border-radius: ${rDef};`;
      }
      const valKey = candidate.slice(8);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.borderRadius);
      if (val) return `border-radius: ${val};`;
    }

    // 9. Font Weight
    const fontWeightMap: Record<string, string> = {
      "font-thin": "font-weight: 100;",
      "font-extralight": "font-weight: 200;",
      "font-light": "font-weight: 300;",
      "font-normal": "font-weight: 400;",
      "font-medium": "font-weight: 500;",
      "font-semibold": "font-weight: 600;",
      "font-bold": "font-weight: 700;",
      "font-extrabold": "font-weight: 800;",
      "font-black": "font-weight: 900;",
    };
    if (fontWeightMap[candidate]) return fontWeightMap[candidate];

    // 10. Font Family
    if (candidate.startsWith("font-")) {
      const familyKey = candidate.slice(5);
      if (this.tokens.fontFamily[familyKey]) {
        const val = this.tokens.fontFamily[familyKey];
        if (isValidCssValue(val)) return `font-family: ${val};`;
      }
    }

    // 11. Box Shadow
    if (candidate.startsWith("shadow")) {
      if (candidate === "shadow") {
        const sDef = this.tokens.boxShadow['DEFAULT'];
        if (isValidCssValue(sDef)) return `box-shadow: ${sDef};`;
      }
      const valKey = candidate.slice(7);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.boxShadow);
      if (val) return `box-shadow: ${val};`;
    }

    // 12. Backdrop Blur & Filters
    if (candidate.startsWith("backdrop-blur")) {
      if (candidate === "backdrop-blur") {
        const bDef = this.tokens.backdropBlur['DEFAULT'];
        if (isValidCssValue(bDef)) return `backdrop-filter: blur(${bDef});`;
      }
      const valKey = candidate.slice(14);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.backdropBlur);
      if (val) return `backdrop-filter: blur(${val});`;
    }

    // 13. Grid Columns & Rows & Order
    if (candidate.startsWith("grid-cols-")) {
      const cols = candidate.slice(10);
      if (cols === "none") return "grid-template-columns: none;";
      if (/^[0-9]+$/.test(cols)) return `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`;
      if (cols.startsWith("[") && cols.endsWith("]")) {
        const arbitrary = this.resolveValueOrArbitrary(cols, {});
        if (arbitrary) return `grid-template-columns: ${arbitrary};`;
      }
    }
    if (candidate.startsWith("col-span-")) {
      const span = candidate.slice(9);
      if (span === "full") return "grid-column: 1 / -1;";
      if (/^[0-9]+$/.test(span)) return `grid-column: span ${span} / span ${span};`;
    }

    if (candidate.startsWith("grid-rows-")) {
      const rows = candidate.slice(10);
      if (rows === "none") return "grid-template-rows: none;";
      if (/^[0-9]+$/.test(rows)) return `grid-template-rows: repeat(${rows}, minmax(0, 1fr));`;
    }
    if (candidate.startsWith("row-span-")) {
      const span = candidate.slice(9);
      if (span === "full") return "grid-row: 1 / -1;";
      if (/^[0-9]+$/.test(span)) return `grid-row: span ${span} / span ${span};`;
    }

    if (candidate.startsWith("order-")) {
      const ord = candidate.slice(6);
      if (ord === "first") return "order: -9999;";
      if (ord === "last") return "order: 9999;";
      if (ord === "none") return "order: 0;";
      if (/^[0-9]+$/.test(ord)) return `order: ${ord};`;
    }

    // 14. Opacity & Z-Index
    if (candidate.startsWith("opacity-")) {
      const op = candidate.slice(8);
      if (/^[0-9]+$/.test(op)) {
        const opacityVal = Number(op) / 100;
        return `opacity: ${opacityVal};`;
      }
    }

    if (candidate.startsWith("z-")) {
      const zKey = candidate.slice(2);
      if (this.tokens.zIndex[zKey]) {
        const zVal = this.tokens.zIndex[zKey];
        if (isValidCssValue(zVal)) return `z-index: ${zVal};`;
      }
      if (/^[0-9]+$/.test(zKey)) return `z-index: ${zKey};`;
    }

    // 15. Width & Height Sizing
    if (candidate.startsWith("w-")) {
      const valKey = candidate.slice(2);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.spacing);
      if (val) return `width: ${val};`;
    }
    if (candidate.startsWith("h-")) {
      const valKey = candidate.slice(2);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.spacing);
      if (val) return `height: ${val};`;
    }
    if (candidate.startsWith("min-h-")) {
      const valKey = candidate.slice(6);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.spacing);
      if (val) return `min-height: ${val};`;
    }

    return null;
  }

  private resolveValueOrArbitrary(key: string, tokenDict: Record<string, string>): string | null {
    if (tokenDict[key]) {
      const tokenVal = tokenDict[key];
      return isValidCssValue(tokenVal) ? tokenVal : null;
    }

    if (key.startsWith("[") && key.endsWith("]")) {
      const rawVal = key.slice(1, -1).trim().replace(/_/g, " ");

      if (!isValidCssValue(rawVal)) {
        return null; // Reject candidate value if it fails strict CSS value validation
      }

      return rawVal;
    }
    return null;
  }
}

/**
 * Validates that a string contains safe and syntactically valid CSS value grammar,
 * rejecting any dangerous code injection vectors, script tags, or broken structures.
 */
function isValidCssValue(val: string): boolean {
  if (!val || typeof val !== "string") return false;
  if (val.length > 200) return false; // Guard against ReDoS and oversized input

  // Reject known CSS injection patterns
  if (/[;{}<>]|javascript:|expression\(|url\(\s*["']?data:|@import|@charset/i.test(val)) {
    return false;
  }

  // Parentheses balance check
  let depth = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i] === "(") depth++;
    else if (val[i] === ")") depth--;
    if (depth < 0) return false;
  }
  if (depth !== 0) return false;

  // Allow standard CSS value grammar: hex colors, numbers, units, calc/rgb/hsl/var functions, keywords
  return /^([a-zA-Z0-9_\-\.\#\,\%\s\(\)\'\"]|var\(--[a-zA-Z0-9_\-]+\))+$/.test(val);
}

/**
 * Escapes characters in class names to ensure compliant CSS selector formatting.
 */
function escapeSelector(str: string): string {
  return str.replace(/([\0-\x1f\x7f-\x9f!\"#$%&'()*+,./:;<=>?@[\]^ `{|}~])/g, "\\$1");
}
