import assert from 'node:assert';
import { scanContent } from '../src/compiler/scanner.js';
import { GpCssGenerator } from '../src/compiler/generator.js';
import { compile } from '../src/compiler/index.js';
import { processDirectives } from '../src/compiler/directives.js';
import { defaultTokens } from '../src/tokens/default-tokens.js';
console.log('Running gp-css test suite...');
// Test 1: Scanner
{
  const sampleHtml = `<div class="flex items-center justify-between p-4 bg-panel rounded-xl hover:bg-slate-800 sm:p-6">`;
  const candidates = scanContent(sampleHtml);
  assert.ok(candidates.has('flex'), 'Should scan flex');
  assert.ok(candidates.has('items-center'), 'Should scan items-center');
  assert.ok(candidates.has('p-4'), 'Should scan p-4');
  assert.ok(candidates.has('bg-panel'), 'Should scan bg-panel');
  assert.ok(candidates.has('hover:bg-slate-800'), 'Should scan hover modifier candidate');
  assert.ok(candidates.has('sm:p-6'), 'Should scan sm breakpoint modifier candidate');
  console.log('✓ Scanner test passed');
}
// Test 2: Generator rules & gp-theme tokens
{
  const gen = new GpCssGenerator({ tokens: defaultTokens });
  const flexRule = gen.generateRule('flex');
  assert.ok(flexRule && flexRule.cssText.includes('display: flex;'));
  const bgPanelRule = gen.generateRule('bg-panel');
  assert.ok(bgPanelRule && bgPanelRule.cssText.includes('var(--panel'));
  const glassRule = gen.generateRule('glass');
  assert.ok(glassRule && glassRule.cssText.includes('backdrop-filter: blur'));
  const glowRule = gen.generateRule('glow');
  assert.ok(glowRule && glowRule.cssText.includes('box-shadow: 0 0 25px'));
  const hoverRule = gen.generateRule('hover:text-accent');
  assert.ok(hoverRule && hoverRule.selector.includes(':hover'));
  const mediaRule = gen.generateRule('sm:p-6');
  assert.ok(mediaRule && mediaRule.mediaQuery === '(min-width: 640px)');
  const arbitraryRule = gen.generateRule('p-[24px]');
  assert.ok(arbitraryRule && arbitraryRule.cssText.includes('padding: 24px;'));
  console.log('✓ Generator test passed');
}
// Test 3: Directives & @apply
{
  const gen = new GpCssGenerator({ tokens: defaultTokens });
  const cssInput = `
@gp-css theme;
@gp-css base;
@gp-css components;
.custom-btn {
  @apply flex items-center bg-accent;
}
@gp-css utilities;
`;
  const result = processDirectives(cssInput, gen, '.flex { display: flex; }', defaultTokens);
  assert.ok(result.css.includes('--gp-color-accent'), 'Theme variables injected');
  assert.ok(result.css.includes('.gp-card'), 'Components injected');
  assert.ok(result.css.includes('display: flex'), '@apply flex resolved');
  assert.ok(result.hasUtilitiesDirective, 'Utilities directive identified');
  console.log('✓ Directives test passed');
}
// Test 4: Full Compilation
{
  const sampleContent = `<section class="flex flex-col gap-4 p-8 bg-top glass rounded-2xl md:flex-row hover:shadow-glow"></section>`;
  const result = compile({
    content: [sampleContent],
    minify: false
  });
  assert.ok(result.css.includes('.flex'), 'Includes .flex rule');
  assert.ok(result.css.includes('backdrop-filter: blur'), 'Includes glass rule');
  assert.ok(result.css.includes('@media (min-width: 768px)'), 'Includes md: breakpoint media query');
  assert.ok(result.scannedCandidatesCount > 0, 'Scanned candidates count > 0');
  assert.ok(result.matchedRulesCount > 0, 'Matched rules count > 0');
  console.log('✓ Full compilation test passed');
}
console.log('All gp-css tests passed successfully!');
