import { GpCssGenerator } from "./generator.js";
import { defaultTokens } from "../tokens/default-tokens.js";
import type { GpThemeTokens } from "../tokens/default-tokens.js";

export interface DirectiveProcessResult {
  css: string;
  hasUtilitiesDirective: boolean;
}

export function processDirectives(
  cssInput: string,
  generator: GpCssGenerator,
  generatedUtilitiesCss: string,
  tokens: GpThemeTokens = defaultTokens
): DirectiveProcessResult {
  let output = cssInput;
  let hasUtilitiesDirective = false;

  // Process @gp-css theme; directive (injects CSS variable definitions for gp-theme)
  if (output.includes("@gp-css theme;")) {
    const themeVars = generateThemeCssVariables(tokens);
    output = output.replace("@gp-css theme;", themeVars);
  }

  // Process @gp-css base; directive
  if (output.includes("@gp-css base;")) {
    const baseStyles = `
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  tab-size: 4;
  font-family: ${tokens.fontFamily['sans']};
}
body {
  margin: 0;
  line-height: inherit;
  color: ${tokens.colors["text-main"]};
  background-color: ${tokens.colors["bg-top"]};
}
`;
    output = output.replace("@gp-css base;", baseStyles);
  }

  // Process @gp-css components; directive
  if (output.includes("@gp-css components;")) {
    const componentStyles = `
.gp-card {
  background: ${tokens.colors['panel']};
  border: 1px solid ${tokens.colors["panel-border"]};
  border-radius: ${tokens.borderRadius['xl']};
  padding: ${tokens.spacing["6"]};
  box-shadow: ${tokens.boxShadow['panel']};
  backdrop-filter: blur(12px);
}
.gp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing["2.5"]} ${tokens.spacing["5"]};
  font-weight: 600;
  border-radius: ${tokens.borderRadius['lg']};
  transition: all 150ms ease;
  cursor: pointer;
}
.gp-btn-primary {
  background: ${tokens.gradients['accent']};
  color: #0b1220;
}
.gp-btn-primary:hover {
  box-shadow: ${tokens.boxShadow['glow']};
  transform: translateY(-1px);
}
`;
    output = output.replace("@gp-css components;", componentStyles);
  }

  // Process @gp-css utilities; directive
  if (output.includes("@gp-css utilities;")) {
    hasUtilitiesDirective = true;
    output = output.replace("@gp-css utilities;", generatedUtilitiesCss);
  }

  // Process @apply directives within rules (e.g. .my-btn { @apply flex items-center bg-accent; })
  output = output.replace(/@apply\s+([^;}]+);?/g, (_, classesStr) => {
    const classes = classesStr.trim().split(/\s+/);
    const rules: string[] = [];
    for (const cls of classes) {
      const rule = generator.generateRule(cls);
      if (rule) {
        // Strip selector wrapper to get raw properties
        const match = rule.cssText.match(/\{([^}]+)\}/);
        if (match) {
          rules.push(match[1].trim());
        }
      }
    }
    return rules.join(" ");
  });

  return { css: output, hasUtilitiesDirective };
}

function generateThemeCssVariables(tokens: GpThemeTokens): string {
  const vars: string[] = [":root {"];
  for (const [key, val] of Object.entries(tokens.colors)) {
    if (!val.startsWith("var(")) {
      vars.push(`  --gp-color-${key}: ${val};`);
    }
  }
  for (const [key, val] of Object.entries(tokens.borderRadius)) {
    vars.push(`  --gp-radius-${key}: ${val};`);
  }
  for (const [key, val] of Object.entries(tokens.spacing)) {
    vars.push(`  --gp-space-${key}: ${val};`);
  }
  vars.push("}");
  return vars.join("\n");
}
