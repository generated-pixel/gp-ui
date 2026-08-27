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

    for (const mod of modifiers) {
      if (this.tokens.breakpoints[mod]) {
        mediaQuery = `(min-width: ${this.tokens.breakpoints[mod]})`;
      } else if (mod === "hover") {
        pseudoClasses.push(":hover");
      } else if (mod === "focus") {
        pseudoClasses.push(":focus");
      } else if (mod === "active") {
        pseudoClasses.push(":active");
      } else if (mod === "disabled") {
        pseudoClasses.push(":disabled");
      } else if (mod === "group-hover") {
        // Selector transform
      } else if (mod === "dark") {
        // Dark mode selector transform
      }
    }

    const escapedClassName = escapeSelector(candidate);
    let selector = `.${escapedClassName}`;

    if (modifiers.includes("group-hover")) {
      selector = `.group:hover .${escapedClassName}`;
    }
    if (modifiers.includes("dark")) {
      selector = `.dark .${escapedClassName}`;
    }
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

      // Text Alignment & Styling
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

      // Transitions
      "transition-all": "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
      transition: "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 200ms;",
    };

    if (displayMap[candidate]) {
      return displayMap[candidate];
    }

    // 2. gp-theme Preset Glassmorphism & Visual Effects
    if (candidate === "glass" || candidate === "glass-panel") {
      return "background: var(--gp-surface-card, var(--panel, rgba(15, 23, 42, 0.78))); border: 1px solid var(--gp-surface-border, var(--panel-border, rgba(148, 163, 184, 0.18))); backdrop-filter: blur(12px); box-shadow: var(--gp-shadow-md, 0 8px 32px 0 rgba(0, 0, 0, 0.37));";
    }
    if (candidate === "glow" || candidate === "glow-accent") {
      return "box-shadow: 0 0 25px rgba(103, 232, 249, 0.35);";
    }
    if (candidate === "glow-purple") {
      return "box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);";
    }

    // 3. Spacing: Padding, Margin, Gap
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

    // 4. Colors: Background, Text, Border
    if (candidate.startsWith("bg-")) {
      const valKey = candidate.slice(3);
      if (this.tokens.gradients[valKey]) {
        return `background-image: ${this.tokens.gradients[valKey]};`;
      }
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.colors);
      if (val) return `background-color: ${val};`;
    }

    if (candidate.startsWith("text-")) {
      const valKey = candidate.slice(5);
      if (this.tokens.fontSize[valKey]) {
        const [size, leading] = this.tokens.fontSize[valKey];
        return `font-size: ${size}; line-height: ${leading};`;
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

    // 5. Border Radius
    if (candidate.startsWith("rounded")) {
      if (candidate === "rounded") {
        return `border-radius: ${this.tokens.borderRadius['DEFAULT']};`;
      }
      const valKey = candidate.slice(8);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.borderRadius);
      if (val) return `border-radius: ${val};`;
    }

    // 6. Font Weight
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

    // 7. Font Family
    if (candidate.startsWith("font-")) {
      const familyKey = candidate.slice(5);
      if (this.tokens.fontFamily[familyKey]) {
        return `font-family: ${this.tokens.fontFamily[familyKey]};`;
      }
    }

    // 8. Box Shadow
    if (candidate.startsWith("shadow")) {
      if (candidate === "shadow") return `box-shadow: ${this.tokens.boxShadow['DEFAULT']};`;
      const valKey = candidate.slice(7);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.boxShadow);
      if (val) return `box-shadow: ${val};`;
    }

    // 9. Backdrop Blur
    if (candidate.startsWith("backdrop-blur")) {
      if (candidate === "backdrop-blur") return `backdrop-filter: blur(${this.tokens.backdropBlur['DEFAULT']});`;
      const valKey = candidate.slice(14);
      const val = this.resolveValueOrArbitrary(valKey, this.tokens.backdropBlur);
      if (val) return `backdrop-filter: blur(${val});`;
    }

    // 10. Grid Columns & Rows
    if (candidate.startsWith("grid-cols-")) {
      const cols = candidate.slice(10);
      if (cols === "none") return "grid-template-columns: none;";
      if (/^[0-9]+$/.test(cols)) return `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`;
      if (cols.startsWith("[") && cols.endsWith("]")) return `grid-template-columns: ${cols.slice(1, -1)};`;
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

    // 11. Opacity
    if (candidate.startsWith("opacity-")) {
      const op = candidate.slice(8);
      if (/^[0-9]+$/.test(op)) {
        const opacityVal = Number(op) / 100;
        return `opacity: ${opacityVal};`;
      }
    }

    // 12. Z-Index
    if (candidate.startsWith("z-")) {
      const zKey = candidate.slice(2);
      if (this.tokens.zIndex[zKey]) return `z-index: ${this.tokens.zIndex[zKey]};`;
      if (/^[0-9]+$/.test(zKey)) return `z-index: ${zKey};`;
    }

    // 13. Width & Height sizing utilities
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
    if (tokenDict[key]) return tokenDict[key];
    if (key.startsWith("[") && key.endsWith("]")) {
      return key.slice(1, -1).replace(/_/g, " ");
    }
    return null;
  }
}

function escapeSelector(str: string): string {
  return str.replace(/([:\[\]#%.\\/()])/g, "\\$1");
}
