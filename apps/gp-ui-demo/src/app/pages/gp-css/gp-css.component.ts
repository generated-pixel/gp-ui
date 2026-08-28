import { Component } from '@angular/core';
import { DocApiProperty, DocApiTableComponent } from '../../shared/doc-api-table.component';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-gp-css-page',
  standalone: true,
  imports: [DocCodeComponent, DocApiTableComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>gp-css</h1>
        <p class="page-desc">
          A utility-first CSS compiler with Generated Pixel theme tokens, responsive variants, and a programmatic API.
        </p>
      </div>

      <section class="doc-section">
        <h2 class="doc-section-title">Installation</h2>
        <p class="doc-section-desc">
          Install the compiler as a development dependency, then add directives to the application's global stylesheet.
        </p>
        <doc-code [code]="installCode" language="bash" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Directives</h2>
        <p class="doc-section-desc">
          Directives inject theme variables, base styles, component helpers, and the utilities discovered from
          application content.
        </p>
        <doc-code [code]="directivesCode" language="css" />
        <doc-api-table title="Available directives" [properties]="directives" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">CLI</h2>
        <p class="doc-section-desc">
          The CLI scans <code>src</code> and <code>public</code>, writes <code>dist/gp-css.css</code>, and uses
          <code>src/styles.css</code> as its entrypoint when present.
        </p>
        <doc-code [code]="cliCode" language="bash" />
        <doc-api-table title="CLI behavior" [properties]="cliBehavior" [hasDefaults]="false" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Content Scanning and CSS Variables</h2>
        <p class="doc-section-desc">
          Utility rules are generated only when a complete class name is found in scanned content. Use static class
          names in templates and use the emitted variables for authored CSS that should follow the active theme.
        </p>
        <doc-code [code]="scanningCode" language="html" />
        <doc-code [code]="cssVariablesCode" language="css" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Configuration</h2>
        <p class="doc-section-desc">
          Use <code>defineConfig</code> to type a compiler configuration for programmatic builds or shared build
          tooling.
        </p>
        <doc-code [code]="configCode" language="typescript" />
        <doc-api-table title="CompileConfig" [properties]="compileConfig" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Programmatic API</h2>
        <p class="doc-section-desc">
          Pass source strings to <code>compile</code> to scan utility candidates and generate a stylesheet.
        </p>
        <doc-code [code]="apiCode" language="typescript" />
        <doc-api-table title="Exports" [properties]="apiExports" [hasDefaults]="false" />
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Utility Reference</h2>
        <p class="doc-section-desc">
          Utilities are generated only when discovered in the content passed to the compiler or scanned by the CLI.
        </p>
        <div class="utility-grid">
          @for (group of utilityGroups; track group.title) {
            <div class="utility-group">
              <h3>{{ group.title }}</h3>
              <p>{{ group.description }}</p>
              <doc-code [code]="group.example" language="html" />
            </div>
          }
        </div>
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Variants and Arbitrary Values</h2>
        <p class="doc-section-desc">
          Prefix a utility with a responsive breakpoint or state variant. Values in square brackets are passed through
          as CSS values; use underscores for spaces.
        </p>
        <doc-code [code]="variantsCode" language="html" />
        <div class="variant-list">
          <code>sm:</code><code>md:</code><code>lg:</code><code>xl:</code><code>2xl:</code> <code>hover:</code
          ><code>focus:</code><code>active:</code><code>disabled:</code><code>group-hover:</code><code>dark:</code>
        </div>
      </section>

      <section class="doc-section">
        <h2 class="doc-section-title">Troubleshooting</h2>
        <doc-api-table title="Common issues" [properties]="troubleshooting" [hasDefaults]="false" />
      </section>
    </div>
  `,
  styles: [
    `
      .page-container {
        max-width: 960px;
      }
      .page-header {
        padding: 2.5rem 0 2rem;
      }
      .page-header h1 {
        margin: 0 0 0.75rem;
        font-size: 2.5rem;
        font-weight: 800;
        letter-spacing: 0;
      }
      .page-desc {
        max-width: 44rem;
        margin: 0;
        color: var(--gp-text-color-secondary);
        font-size: 1.05rem;
        line-height: 1.6;
      }
      .utility-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }
      .utility-group {
        border: 1px solid var(--gp-surface-border);
        border-radius: 6px;
        padding: 1rem;
        background: var(--gp-surface-ground);
      }
      .utility-group h3 {
        margin: 0 0 0.35rem;
        font-size: 1rem;
      }
      .utility-group p {
        min-height: 3rem;
        margin: 0 0 1rem;
        color: var(--gp-text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.45;
      }
      .utility-group .doc-code-box {
        margin: 0;
      }
      .variant-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      .variant-list code {
        padding: 0.25rem 0.45rem;
        border: 1px solid var(--gp-surface-border);
        border-radius: 4px;
        background: var(--gp-surface-ground);
        color: var(--gp-primary);
      }
      @media (max-width: 680px) {
        .utility-grid {
          grid-template-columns: 1fr;
        }
        .page-header {
          padding-top: 1.5rem;
        }
      }
    `
  ]
})
export class GpCssPageComponent {
  readonly installCode = `npm install --save-dev @generatedpixel/gp-css`;

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
