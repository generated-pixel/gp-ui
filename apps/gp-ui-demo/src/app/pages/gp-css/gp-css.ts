import { Component } from '@angular/core';
import { DocApiProperty, DocApiTable } from '../../shared/doc-api-table';
import { DocCode } from '../../shared/doc-code';

@Component({
  selector: 'app-gp-css-page',
  standalone: true,
  imports: [DocCode, DocApiTable],
  templateUrl: './gp-css.html',
  styleUrl: './gp-css.scss'
})
export class GpCssPage {
  readonly installCode = 'npm install --save-dev @generatedpixel/gp-css';

  readonly directivesCode = `/* src/styles.css */
@gp-css theme;
@gp-css base;
@gp-css components;

.profile-card {
  @apply flex items-center gap-4 p-6 bg-surface-card rounded-xl shadow-md;
}

@gp-css utilities;`;

  readonly cliCode = `npx gp-css init
npx gp-css build --minify
npx gp-css watch`;

  readonly cliBehavior: DocApiProperty[] = [
    { name: 'init', type: 'command', description: 'Creates gp-css.config.mjs in the current directory.' },
    { name: 'build', type: 'command', description: 'Scans src and public, then writes dist/gp-css.css.' },
    { name: 'watch', type: 'command', description: 'Runs the same compilation path as build.' },
    {
      name: 'scanned files',
      type: 'extensions',
      description:
        '.html, .ts, .tsx, .js, .jsx, .vue, .svelte, and .css; node_modules, dist, and hidden directories are skipped.'
    },
    { name: '--minify', type: 'flag', description: 'Removes comments and unnecessary whitespace from build output.' }
  ];

  readonly scanningCode = `<div class="md:grid md:grid-cols-2 gap-4 hover:shadow-glow">
  Static class names are discoverable by the scanner.
</div>

<!-- Prefer complete classes over runtime fragments such as bg-{{ color }}. -->`;

  readonly cssVariablesCode = `.notice {
  background: var(--gp-color-panel);
  border: 1px solid var(--gp-color-panel-border);
  border-radius: var(--gp-radius-lg);
  padding: var(--gp-space-4);
  color: var(--gp-color-text-main);
}`;

  readonly configCode = `import { defineConfig } from '@generatedpixel/gp-css';

export default defineConfig({
  content: ['<div class="flex p-4 bg-primary"></div>'],
  prefix: '',
  minify: true
});`;

  readonly apiCode = `import { compile } from '@generatedpixel/gp-css';

const result = compile({
  content: ['<button class="flex items-center gap-2 p-3 bg-primary text-white rounded-lg"></button>'],
  inputCss: '@gp-css utilities;',
  minify: true
});

console.log(result.css);
console.log(result.scannedCandidatesCount, result.matchedRulesCount);`;

  readonly variantsCode = `<div class="p-[18px] md:flex hover:bg-primary focus:bg-secondary">
  <span class="text-[1.125rem] lg:text-xl">Responsive content</span>
</div>`;

  readonly directives: DocApiProperty[] = [
    {
      name: '@gp-css theme;',
      type: 'CSS directive',
      description: 'Adds CSS custom properties for non-variable default theme tokens.'
    },
    {
      name: '@gp-css base;',
      type: 'CSS directive',
      description: 'Adds the compiler base reset and document-level defaults.'
    },
    {
      name: '@gp-css components;',
      type: 'CSS directive',
      description: 'Adds gp-card, gp-btn, and gp-btn-primary helper classes.'
    },
    {
      name: '@gp-css utilities;',
      type: 'CSS directive',
      description: 'Replaces the directive with generated utility rules.'
    },
    {
      name: '@apply',
      type: 'CSS directive',
      description: 'Expands recognized utilities into declarations within a CSS rule.'
    }
  ];

  readonly compileConfig: DocApiProperty[] = [
    { name: 'content', type: 'string[]', default: '[]', description: 'Source strings scanned for utility candidates.' },
    {
      name: 'inputCss',
      type: 'string',
      default: 'default directives',
      description: 'CSS entrypoint containing gp-css directives.'
    },
    {
      name: 'prefix',
      type: 'string',
      default: "''",
      description: 'Optional prefix removed before a utility is resolved.'
    },
    {
      name: 'tokens',
      type: 'GpThemeTokens',
      default: 'defaultTokens',
      description: 'Token set for generated colors, spacing, breakpoints, and effects.'
    },
    {
      name: 'minify',
      type: 'boolean',
      default: 'false',
      description: 'Removes comments and unnecessary whitespace from output.'
    }
  ];

  readonly apiExports: DocApiProperty[] = [
    {
      name: 'compile(config)',
      type: 'CompileResult',
      description: 'Scans content and returns CSS plus candidate and rule counts.'
    },
    { name: 'defineConfig(config)', type: 'CompileConfig', description: 'Returns a typed compiler configuration.' },
    {
      name: 'scanContent(content)',
      type: 'Set<string>',
      description: 'Extracts utility candidates from a source string.'
    },
    { name: 'GpCssGenerator', type: 'class', description: 'Generates a CSS rule for an individual utility candidate.' },
    {
      name: 'processDirectives(css, generator, utilities)',
      type: 'DirectiveProcessResult',
      description: 'Expands directives and @apply rules.'
    },
    {
      name: 'defaultTokens',
      type: 'GpThemeTokens',
      description: 'Default colors, typography, spacing, breakpoints, and effects.'
    }
  ];

  readonly troubleshooting: DocApiProperty[] = [
    {
      name: 'Missing utility',
      type: 'content',
      description:
        'Confirm the full class name is under src or public, uses a supported extension, and is included in content for programmatic builds.'
    },
    {
      name: '@apply has no output',
      type: 'utility',
      description: 'Only utilities supported by the generator can be expanded; unsupported classes are ignored.'
    },
    {
      name: 'No generated utilities',
      type: 'directive',
      description:
        'Keep @gp-css utilities; in the input stylesheet and verify that content contains utility candidates.'
    },
    {
      name: 'Runtime theme changes',
      type: 'gp-ui-theme',
      description:
        'gp-css is build-time CSS. Use GpThemeManager and --gp-* variables from @generatedpixel/gp-ui-theme for runtime switching.'
    }
  ];

  readonly utilityGroups = [
    {
      title: 'Layout',
      description: 'Display, flex direction and behavior, alignment, positioning, sizing, overflow, and selection.',
      example: '<div class="flex flex-col items-center justify-between w-full min-h-screen overflow-auto"></div>'
    },
    {
      title: 'Grid',
      description: 'Grid display, column and row counts, and column or row spans.',
      example: '<div class="grid grid-cols-3 gap-4"><article class="col-span-2"></article></div>'
    },
    {
      title: 'Spacing',
      description: 'Padding, margin, and gap use the configured spacing scale or arbitrary values.',
      example: '<div class="p-6 mx-auto gap-x-4 mt-[18px]"></div>'
    },
    {
      title: 'Colors and Type',
      description: 'Backgrounds, text colors, text sizes, alignment, decoration, weight, and families.',
      example: '<p class="text-lg font-semibold text-primary text-center"></p>'
    },
    {
      title: 'Borders and Effects',
      description: 'Border widths and colors, radius, shadows, backdrop blur, glass, and glow.',
      example: '<div class="border border-surface-border rounded-xl shadow-lg glass glow"></div>'
    },
    {
      title: 'State and Layering',
      description: 'Opacity, z-index, transitions, pointer events, and interactive modifiers.',
      example: '<button class="z-modal opacity-90 transition hover:bg-primary disabled:opacity-50"></button>'
    }
  ];
}
