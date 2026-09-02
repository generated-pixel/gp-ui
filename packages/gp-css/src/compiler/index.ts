import { scanContent } from './scanner.js';
import type { ScanOptions } from './scanner.js';
import { GpCssGenerator } from './generator.js';
import type { GeneratorOptions, GeneratedRule } from './generator.js';
import { processDirectives } from './directives.js';
import { defaultTokens } from '../tokens/default-tokens.js';
import type { GpThemeTokens } from '../tokens/default-tokens.js';
import { GpCssPlugin } from './plugins.js';

export interface CompileConfig {
  content?: string[];
  inputCss?: string;
  prefix?: string;
  tokens?: GpThemeTokens;
  plugins?: GpCssPlugin[];
  minify?: boolean;
}

export interface CompileResult {
  css: string;
  scannedCandidatesCount: number;
  matchedRulesCount: number;
}

export function compile(config: CompileConfig = {}): CompileResult {
  const tokens = config.tokens || defaultTokens;
  const generator = new GpCssGenerator({ tokens, prefix: config.prefix });
  const candidates = new Set<string>();

  const customUtilities = new Map<string, string>();
  const customComponents: string[] = [];

  if (config.plugins) {
    for (const plugin of config.plugins) {
      plugin({
        tokens,
        addUtility: (name, css) => customUtilities.set(name, css),
        addComponent: (selector, css) => customComponents.push(`${selector} { ${css} }`)
      });
    }
  }

  if (config.content) {
    for (const src of config.content) {
      const found = scanContent(src);
      for (const item of found) {
        candidates.add(item);
      }
    }
  }

  const standardRules: GeneratedRule[] = [];
  const mediaRules: Map<string, GeneratedRule[]> = new Map();

  for (const [name, cssText] of customUtilities.entries()) {
    standardRules.push({
      className: name,
      selector: `.${name}`,
      cssText: `.${name} { ${cssText} }`
    });
  }

  for (const candidate of candidates) {
    const rule = generator.generateRule(candidate);
    if (rule) {
      if (rule.mediaQuery) {
        if (!mediaRules.has(rule.mediaQuery)) {
          mediaRules.set(rule.mediaQuery, []);
        }
        mediaRules.get(rule.mediaQuery)!.push(rule);
      } else {
        standardRules.push(rule);
      }
    }
  }

  let utilitiesCss = standardRules.map((r) => r.cssText).join('\n');

  if (customComponents.length > 0) {
    utilitiesCss = customComponents.join('\n') + '\n' + utilitiesCss;
  }

  for (const [mediaQuery, rules] of mediaRules.entries()) {
    utilitiesCss += `\n@media ${mediaQuery} {\n` + rules.map((r) => `  ${r.cssText}`).join('\n') + '\n}';
  }

  const inputCss = config.inputCss || '@gp-css theme;\n@gp-css base;\n@gp-css components;\n@gp-css utilities;';
  const { css: finalCss, hasUtilitiesDirective } = processDirectives(inputCss, generator, utilitiesCss, tokens);

  let outputCss = finalCss;
  if (!hasUtilitiesDirective && utilitiesCss) {
    outputCss += '\n/* gp-css utilities */\n' + utilitiesCss;
  }

  if (config.minify) {
    outputCss = minifyCss(outputCss);
  }

  return {
    css: outputCss,
    scannedCandidatesCount: candidates.size,
    matchedRulesCount: standardRules.length + Array.from(mediaRules.values()).reduce((a, b) => a + b.length, 0)
  };
}

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
}
