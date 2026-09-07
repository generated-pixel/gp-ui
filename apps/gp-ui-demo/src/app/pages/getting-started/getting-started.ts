import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpButton, GpTag, GpIcon, GP_UI_VERSION } from 'gp-ui';
import { DocCode } from '../../shared/doc-code';

interface GpPackageItem {
  name: string;
  npmName: string;
  description: string;
  category: string;
  icon: string;
  isDev?: boolean;
  demoRoute?: string;
  demoLabel?: string;
  tags: string[];
}

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, RouterModule, GpButton, GpTag, GpIcon, DocCode],
  templateUrl: './getting-started.html',
  styleUrl: './getting-started.scss'
})
export class GettingStarted {
  protected readonly version = GP_UI_VERSION;
  public readonly selectedPm = signal<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');

  public readonly fullSuiteCmd = computed(() => {
    switch (this.selectedPm()) {
      case 'pnpm':
        return 'pnpm add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\npnpm add -D @generatedpixel/gp-css';
      case 'yarn':
        return 'yarn add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nyarn add -D @generatedpixel/gp-css';
      case 'bun':
        return 'bun add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nbun add -d @generatedpixel/gp-css';
      default:
        return 'npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nnpm install --save-dev @generatedpixel/gp-css';
    }
  });

  public readonly coreUiCmd = computed(() => {
    switch (this.selectedPm()) {
      case 'pnpm':
        return 'pnpm add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      case 'yarn':
        return 'yarn add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      case 'bun':
        return 'bun add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      default:
        return 'npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
    }
  });

  public getInstallCmd(pkg: string, isDev = false): string {
    const pm = this.selectedPm();
    if (pm === 'pnpm') {
      return isDev ? `pnpm add -D ${pkg}` : `pnpm add ${pkg}`;
    }
    if (pm === 'yarn') {
      return isDev ? `yarn add -D ${pkg}` : `yarn add ${pkg}`;
    }
    if (pm === 'bun') {
      return isDev ? `bun add -d ${pkg}` : `bun add ${pkg}`;
    }
    return isDev ? `npm install --save-dev ${pkg}` : `npm install ${pkg}`;
  }

  public readonly packages: GpPackageItem[] = [
    {
      name: 'Core UI Components',
      npmName: '@generatedpixel/gp-ui',
      description:
        '80+ enterprise-grade standalone Angular 19+ UI components built 100% with native Signals (input, output, model). Includes buttons, form controls, tables, trees, dialogs, drawers, and menus.',
      category: 'UI Library',
      icon: 'layers',
      isDev: false,
      demoRoute: '/component/button',
      demoLabel: 'Browse 80+ Components',
      tags: ['80+ Components', '100% Signals', 'OnPush Default', 'Zero 3rd-Party Deps']
    },
    {
      name: 'Design Tokens & Theming',
      npmName: '@generatedpixel/gp-ui-theme',
      description:
        'System-wide CSS variables, 8 preset palettes (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk), dark/light modes, WCAG AAA high-contrast modes, and runtime GpThemeManager.',
      category: 'Design System',
      icon: 'palette',
      isDev: false,
      demoRoute: '/theming',
      demoLabel: 'Theming Studio',
      tags: ['8 Color Palettes', 'CSS Variables', 'Light & Dark', 'WCAG AAA']
    },
    {
      name: 'High-Performance Utility CSS Engine',
      npmName: '@generatedpixel/gp-css',
      description:
        'Zero-runtime utility CSS engine and compiler CLI with atomic rule generation, sub-15ms project scanning, @gp-css directives, and design token integration.',
      category: 'Build Tool',
      icon: 'code',
      isDev: true,
      demoRoute: '/gp-css',
      demoLabel: 'gp-css Documentation',
      tags: ['Zero Runtime', 'CLI Compiler', 'Sub-15ms Scans', 'Token Integration']
    },
    {
      name: 'Vector Icon Registry',
      npmName: '@generatedpixel/gp-ui-icons',
      description:
        'Lightweight, tree-shakeable SVG icon collection and registry system. Includes GpIcon with automatic size scaling, semantic color inheritance, and dynamic SVG sprite loading.',
      category: 'Icons',
      icon: 'sparkles',
      isDev: false,
      demoRoute: '/component/icon',
      demoLabel: 'Icon Components',
      tags: ['500+ Vector Icons', 'SVG Registry', 'Tree-Shakeable', 'Auto Sizing']
    },
    {
      name: 'Dynamic Business Rules Engine',
      npmName: '@generatedpixel/gp-rules',
      description:
        'Declarative reactive business logic and validation rules engine. Triggers actions on keypress (with configurable debounce), blur, change, or button clicks with formula calculations and simulator.',
      category: 'Logic Engine',
      icon: 'sliders',
      isDev: false,
      demoRoute: '/rules',
      demoLabel: 'Rules Engine & Simulator',
      tags: ['Debounced Keypress', 'Formula Eval', 'Field Comparison', 'Dry-Run Simulator']
    },
    {
      name: 'Dashboard Grid & Widgets',
      npmName: '@generatedpixel/gp-grid',
      description:
        'Interactive drag-and-drop dashboard grid layout manager. Features responsive column snapping, resizable widgets, serialized layout persistence, and widget data resolvers.',
      category: 'Layout & Data',
      icon: 'grid',
      isDev: false,
      demoRoute: '/grid',
      demoLabel: 'Dashboard Grid Demo',
      tags: ['Drag & Drop', 'Resizable Widgets', 'State Persistence', 'Responsive Snapping']
    },
    {
      name: 'Application Blocks & UI Shells',
      npmName: '@generatedpixel/gp-blocks',
      description:
        '60+ ready-to-use application layouts, analytics dashboards, settings screens, form wizards, and dynamic schema-driven form renderers built natively with gp-ui and gp-css.',
      category: 'Page Templates',
      icon: 'layout',
      isDev: false,
      demoRoute: '/blocks',
      demoLabel: 'Explore 60+ Blocks',
      tags: ['60+ Ready Shells', 'JSON Schema Form Builder', 'CMS Ready', 'Zero Config']
    }
  ];

  signalsExampleCode = `import { Component, signal, computed } from '@angular/core';
import { GpInputText, GpButton, GpSelect } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [GpInputText, GpButton, GpSelect],
  template: \`
    <!-- Two-way Signal Model Binding -->
    <gp-input-text label="Username" [(value)]="username" placeholder="Enter username..." />

    <!-- Signal Inputs & Computed State -->
    <gp-button
      label="Submit"
      [disabled]="isSubmitDisabled()"
      severity="primary"
      (onClickEvent)="onSubmit()"
    />
  \`
})
export class UserProfile {
  // Define writable signals
  username = signal('');

  // Define computed signals reacting to input changes
  isSubmitDisabled = computed(() => this.username().trim().length === 0);

  onSubmit(): void {
    console.log('Submitted username:', this.username());
  }
}`;

  themeCode = `// In styles.scss:
// Import all preset themes (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk)
@import '@generatedpixel/gp-ui-theme/src/index.css';

// Or import specific theme stylesheets:
// @import '@generatedpixel/gp-ui-theme/src/themes/ocean.css';
// @import '@generatedpixel/gp-ui-theme/src/themes/emerald.css';

// Switch theme and mode dynamically in TypeScript:
import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

GpThemeManager.setTheme('ocean'); // 'default' | 'ocean' | 'emerald' | 'sunset' | 'amethyst' | 'rose' | 'nord' | 'cyberpunk'
GpThemeManager.setMode('dark');   // 'light' | 'dark' | 'system'
GpThemeManager.toggleMode();      // Toggles between light and dark mode`;

  usageCode = `import { Component } from '@angular/core';
import { GpButton, GpInputText, GpTable } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-my-view',
  standalone: true,
  imports: [GpButton, GpInputText, GpTable],
  template: \`
    <gp-button label="Save Changes" severity="primary" (onClickEvent)="onSave()" />
  \`
})
export class MyView {
  onSave(): void {
    console.log('Saved!');
  }
}`;
}
