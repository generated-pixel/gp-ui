import assert from "node:assert";
import { scanContent } from "../src/compiler/scanner.js";
import { GpCssGenerator } from "../src/compiler/generator.js";
import { compile } from "../src/compiler/index.js";
import { processDirectives } from "../src/compiler/directives.js";
import { defaultTokens } from "../src/tokens/default-tokens.js";
import { definePlugin } from "../src/compiler/plugins.js";

console.log("Running expanded gp-css test suite...");

// Test 1: Scanner
{
  const sampleHtml = `<div class="flex items-center justify-between p-4 bg-panel rounded-xl hover:bg-slate-800 sm:p-6 animate-pulse scale-105 ring-2 ring-primary"><span class="bg-clip-text text-transparent">Glow</span></div>`;
  const candidates = scanContent(sampleHtml);
  assert.ok(candidates.has("flex"), "Should scan flex");
  assert.ok(candidates.has("items-center"), "Should scan items-center");
  assert.ok(candidates.has("animate-pulse"), "Should scan animate-pulse");
  assert.ok(candidates.has("scale-105"), "Should scan scale-105");
  assert.ok(candidates.has("ring-2"), "Should scan ring-2");
  assert.ok(candidates.has("bg-clip-text"), "Should scan bg-clip-text");
  console.log("✓ Scanner test passed");
}

// Test 2: Generator Rules & Advanced Utilities
{
  const gen = new GpCssGenerator({ tokens: defaultTokens });

  const pulseRule = gen.generateRule("animate-pulse");
  assert.ok(pulseRule && pulseRule.cssText.includes("gp-pulse"));

  const scaleRule = gen.generateRule("scale-105");
  assert.ok(scaleRule && scaleRule.cssText.includes("scale(1.05)"));

  const rotateRule = gen.generateRule("rotate-45");
  assert.ok(rotateRule && rotateRule.cssText.includes("rotate(45deg)"));

  const ringRule = gen.generateRule("ring-2");
  assert.ok(ringRule && ringRule.cssText.includes("box-shadow"));

  const ringColorRule = gen.generateRule("ring-primary");
  assert.ok(ringColorRule && ringColorRule.cssText.includes("var(--gp-primary"));

  const clipTextRule = gen.generateRule("bg-clip-text");
  assert.ok(clipTextRule && clipTextRule.cssText.includes("-webkit-background-clip: text"));

  const textTransRule = gen.generateRule("text-transparent");
  assert.ok(textTransRule && textTransRule.cssText.includes("color: transparent"));

  const focusWithinRule = gen.generateRule("focus-within:bg-surface-card");
  assert.ok(focusWithinRule && focusWithinRule.selector.includes(":focus-within"));

  const peerHoverRule = gen.generateRule("peer-hover:text-primary");
  assert.ok(peerHoverRule && peerHoverRule.selector.includes(".peer:hover"));

  console.log("✓ Advanced generator rules test passed");
}

// Test 3: Plugin API
{
  const myPlugin = definePlugin(({ addUtility }) => {
    addUtility("custom-badge", "display: inline-flex; padding: 0.25rem 0.5rem; background: var(--gp-primary); color: white;");
  });

  const result = compile({
    content: [`<div class="custom-badge"></div>`],
    plugins: [myPlugin]
  });

  assert.ok(result.css.includes(".custom-badge"), "Custom plugin utility compiled");
  console.log("✓ Plugin API test passed");
}

// Test 4: Directives & Keyframes
{
  const gen = new GpCssGenerator({ tokens: defaultTokens });
  const cssInput = `
@gp-css theme;
@gp-css base;
@gp-css components;
.btn { @apply flex items-center bg-primary; }
@gp-css utilities;
`;
  const result = processDirectives(cssInput, gen, ".flex { display: flex; }", defaultTokens);
  assert.ok(result.css.includes("@keyframes gp-spin"), "Keyframes injected in base");
  assert.ok(result.css.includes("--gp-color-primary"), "Theme variables injected");
  console.log("✓ Directives & Keyframes test passed");
}

console.log("All expanded gp-css tests passed successfully!");
