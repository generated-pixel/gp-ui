import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButton,
  GpButtonGroup,
  GpToggleButton,
  GpInputText,
  GpTextarea,
  GpPassword,
  GpInputNumber,
  GpCheckbox,
  GpColorPicker,
  GpRadioButton,
  GpSwitch,
  GpSlider,
  GpRating,
  GpSelect,
  GpBadge,
  GpTag,
  GpProgressBar,
  GpProgressSpinner,
  GpSkeleton,
  GpMessage,
  GpAvatar,
  GpChip,
  GpBreadcrumb,
  GpTabs,
  GpTabPanel,
  GpCard,
  GpPanel,
  GpDivider,
  GpAccordion,
  GpAccordionTab,
  GpTable,
  GpColumn
} from 'gp-ui';
import {
  GpThemeManager,
  GpThemeDefinition,
  GpColorScale,
  builtInThemes,
  defaultTheme,
  generateColorScale,
  autoTuneContrast,
  evaluateContrast,
  themeToCss,
  themeToTypeScript,
  themeToJson,
  themeToAngularSetup,
  deepMerge
} from 'gp-ui-theme';
import { GpIcon } from 'gp-ui-icons';
import { DocCode } from '../../shared/doc-code';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButton,
    GpButtonGroup,
    GpToggleButton,
    GpInputText,
    GpTextarea,
    GpPassword,
    GpInputNumber,
    GpCheckbox,
    GpColorPicker,
    GpRadioButton,
    GpSwitch,
    GpSlider,
    GpRating,
    GpSelect,
    GpBadge,
    GpTag,
    GpProgressBar,
    GpProgressSpinner,
    GpSkeleton,
    GpMessage,
    GpAvatar,
    GpChip,
    GpBreadcrumb,
    GpTabs,
    GpTabPanel,
    GpCard,
    GpPanel,
    GpDivider,
    GpAccordion,
    GpAccordionTab,
    GpTable,
    GpColumn,
    GpIcon,
    DocCode
  ],
  templateUrl: './theme-editor.html',
  styleUrl: './theme-editor.scss'
})
export class ThemeEditor {
  public builtInPresets = builtInThemes;
  public selectedPresetId = signal<string>('default');

  public inspirationColors = [
    { name: 'Indigo Brand', hex: '#4f46e5' },
    { name: 'Electric Sky', hex: '#0284c7' },
    { name: 'Ocean Cyan', hex: '#06b6d4' },
    { name: 'Teal Mint', hex: '#0d9488' },
    { name: 'Emerald Forest', hex: '#059669' },
    { name: 'Lime Zest', hex: '#65a30d' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Sunset Orange', hex: '#ea580c' },
    { name: 'Crimson Rose', hex: '#e11d48' },
    { name: 'Fuchsia Pink', hex: '#c026d3' },
    { name: 'Violet Purple', hex: '#7c3aed' },
    { name: 'Modern Slate', hex: '#475569' },
    { name: 'Cyberpunk Neon', hex: '#f43f5e' },
    { name: 'Midnight Navy', hex: '#1e3a8a' },
    { name: 'Warm Terracotta', hex: '#b45309' },
    { name: 'Pure Obsidian', hex: '#18181b' }
  ];

  public themeColorPresets = ['#6366f1', '#0ea5e9', '#14b8a6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#64748b'];
  public componentOptions = [
    { label: 'Button', value: 'button' },
    { label: 'Button Group', value: 'buttonGroup' },
    { label: 'Split Button', value: 'splitButton' },
    { label: 'Speed Dial', value: 'speedDial' },
    { label: 'Toggle Button', value: 'toggleButton' },
    { label: 'Input / Input Text', value: 'input' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Password', value: 'password' },
    { label: 'Input Number', value: 'inputNumber' },
    { label: 'Input Mask', value: 'inputMask' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Radio Button', value: 'radioButton' },
    { label: 'Switch', value: 'switch' },
    { label: 'Slider', value: 'slider' },
    { label: 'Rating', value: 'rating' },
    { label: 'Color Picker', value: 'colorPicker' },
    { label: 'Select', value: 'select' },
    { label: 'MultiSelect', value: 'multiSelect' },
    { label: 'Listbox', value: 'listbox' },
    { label: 'Autocomplete', value: 'autocomplete' },
    { label: 'Cascade Select', value: 'cascadeSelect' },
    { label: 'Tree Select', value: 'treeSelect' },
    { label: 'Date Picker', value: 'datePicker' },
    { label: 'Time Picker', value: 'timePicker' },
    { label: 'File Upload', value: 'fileUpload' },
    { label: 'Table', value: 'table' },
    { label: 'Column', value: 'column' },
    { label: 'Tree Table', value: 'treeTable' },
    { label: 'Data View', value: 'dataView' },
    { label: 'Paginator', value: 'paginator' },
    { label: 'Virtual Scroller', value: 'virtualScroller' },
    { label: 'Avatar', value: 'avatar' },
    { label: 'Chip', value: 'chip' },
    { label: 'Badge', value: 'badge' },
    { label: 'Tag', value: 'tag' },
    { label: 'Image', value: 'image' },
    { label: 'Carousel', value: 'carousel' },
    { label: 'Timeline', value: 'timeline' },
    { label: 'Meter Group', value: 'meterGroup' },
    { label: 'Empty State', value: 'emptyState' },
    { label: 'Toast', value: 'toast' },
    { label: 'Message', value: 'message' },
    { label: 'Progress Bar', value: 'progressBar' },
    { label: 'Progress Spinner', value: 'progressSpinner' },
    { label: 'Skeleton', value: 'skeleton' },
    { label: 'Menu', value: 'menu' },
    { label: 'Menubar', value: 'menubar' },
    { label: 'Context Menu', value: 'contextMenu' },
    { label: 'Tiered Menu', value: 'tieredMenu' },
    { label: 'Mega Menu', value: 'megaMenu' },
    { label: 'Panel Menu', value: 'panelMenu' },
    { label: 'Breadcrumb', value: 'breadcrumb' },
    { label: 'Tabs', value: 'tabs' },
    { label: 'Stepper', value: 'stepper' },
    { label: 'Dock', value: 'dock' },
    { label: 'Toolbar', value: 'toolbar' },
    { label: 'Dialog', value: 'dialog' },
    { label: 'Confirm Dialog', value: 'confirmDialog' },
    { label: 'Drawer', value: 'drawer' },
    { label: 'Popover', value: 'popover' },
    { label: 'Card', value: 'card' },
    { label: 'Panel', value: 'panel' },
    { label: 'Accordion', value: 'accordion' },
    { label: 'Fieldset', value: 'fieldset' },
    { label: 'Divider', value: 'divider' },
    { label: 'Splitter', value: 'splitter' },
    { label: 'Scroll Panel', value: 'scrollPanel' },
    { label: 'Tree', value: 'tree' },
    { label: 'Tree Node', value: 'treeNode' },
    { label: 'Org Chart', value: 'orgChart' }
  ];

  public themeName = signal<string>('My Custom Theme');
  public themeId = computed(() =>
    this.themeName()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  );

  public editMode = signal<'light' | 'dark'>('light');
  public activeTab = signal<'primitives' | 'semantics' | 'components' | 'export'>('primitives');
  public exportFormat = signal<'css' | 'typescript' | 'json' | 'angular'>('css');

  public hue = signal<number>(238);
  public saturation = signal<number>(84);
  public lightness = signal<number>(59);

  public copied = signal<boolean>(false);
  public previewSwitch = true;
  public previewSliderValue = 65;
  public toggleState = true;
  public checkboxState = true;
  public radioState = 'A';
  public ratingValue = 4;

  public sampleOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
  ];

  public breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Theme Editor' }
  ];

  public tableData = [
    { name: 'Alex Smith', role: 'Lead Architect', status: 'Active' },
    { name: 'Maria Garcia', role: 'UI Engineer', status: 'In Review' }
  ];

  public colorScaleSteps: (keyof GpColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  public selectedComponent = signal<string>('button');

  // Working state theme definition
  public currentTheme = signal<GpThemeDefinition>(
    deepMerge(defaultTheme, { id: 'my-custom-theme', name: 'My Custom Theme' })
  );

  public primaryBaseColor = computed(() => this.currentTheme().light.semantic.primary.main || '#4f46e5');

  public activeSemantic = computed(() =>
    this.editMode() === 'dark' ? this.currentTheme().dark.semantic : this.currentTheme().light.semantic
  );

  public contrastInfo = computed(() => {
    const hex = this.primaryBaseColor();
    const [r, g, b] = hexToRgb(hex);
    const sRGB = [r / 255, g / 255, b / 255].map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    );
    const L = 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    const contrastWhite = 1.05 / (L + 0.05);
    const contrastBlack = (L + 0.05) / 0.05;

    if (contrastWhite >= 4.5) {
      return {
        label: `WCAG AA (${contrastWhite.toFixed(1)}:1 vs White)`,
        severity: 'success' as const,
        tooltip: 'High contrast against white text for buttons and badges.'
      };
    } else if (contrastBlack >= 4.5) {
      return {
        label: `WCAG AA (${contrastBlack.toFixed(1)}:1 vs Dark)`,
        severity: 'success' as const,
        tooltip: 'High contrast against dark text for buttons and badges.'
      };
    } else {
      return {
        label: `Ratio (${Math.max(contrastWhite, contrastBlack).toFixed(1)}:1)`,
        severity: 'warning' as const,
        tooltip: 'Moderate contrast. Optimal for accents and subtle elements.'
      };
    }
  });

  constructor() {
    const initialHex = this.currentTheme().light.semantic.primary.main || '#4f46e5';
    const [h, s, l] = hexToHsl(initialHex);
    this.hue.set(h);
    this.saturation.set(s);
    this.lightness.set(l);

    // Automatically re-inject theme CSS whenever working theme changes
    effect(() => {
      const theme = this.currentTheme();
      const updatedTheme: GpThemeDefinition = {
        ...theme,
        id: this.themeId(),
        name: this.themeName()
      };
      GpThemeManager.registerTheme(updatedTheme);
      GpThemeManager.setTheme(updatedTheme);
    });
  }

  public onThemeNameChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.themeName.set(val || 'Custom Theme');
  }

  public setEditMode(mode: 'light' | 'dark'): void {
    this.editMode.set(mode);
    GpThemeManager.setMode(mode);
  }

  public setActiveTab(tab: 'primitives' | 'semantics' | 'components' | 'export'): void {
    this.activeTab.set(tab);
  }

  public onPresetSelect(presetId: string): void {
    this.selectedPresetId.set(presetId);
    const found = builtInThemes.find((t) => t.id === presetId);
    if (found) {
      const cloned = JSON.parse(JSON.stringify(found));
      cloned.id = this.themeId();
      cloned.name = this.themeName();
      this.currentTheme.set(cloned);
      const baseHex = cloned.light.semantic.primary.main || '#4f46e5';
      const [h, s, l] = hexToHsl(baseHex);
      this.hue.set(h);
      this.saturation.set(s);
      this.lightness.set(l);
    }
  }

  public resetToPreset(): void {
    const found = builtInThemes.find((t) => t.id === this.selectedPresetId()) || defaultTheme;
    const cloned = JSON.parse(JSON.stringify(found));
    cloned.id = this.themeId();
    cloned.name = this.themeName();
    this.currentTheme.set(cloned);
    const baseHex = cloned.light.semantic.primary.main || '#4f46e5';
    const [h, s, l] = hexToHsl(baseHex);
    this.hue.set(h);
    this.saturation.set(s);
    this.lightness.set(l);
  }

  public getPrimaryScaleStep(step: keyof GpColorScale): string {
    const lightSemantic = this.currentTheme().light.semantic;
    if (lightSemantic.primaryScale && (lightSemantic.primaryScale as any)[step]) {
      return (lightSemantic.primaryScale as any)[step];
    }
    const colors = this.currentTheme().primitives.colors;
    const scale =
      colors['primary'] || colors['indigo'] || colors['blue'] || colors['emerald'] || Object.values(colors)[0];
    return scale ? (scale as any)[step] || '#4f46e5' : '#4f46e5';
  }

  public onHexTextInput(rawVal: string): void {
    if (!rawVal) {
      return;
    }
    let hex = rawVal.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    this.onPrimaryHexChange(hex);
  }

  public onPrimaryHexChange(rawHex: string): void {
    if (!rawHex) {
      return;
    }
    let hex = rawHex.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    if (hex.length !== 7 && hex.length !== 4) {
      return;
    }
    if (!/^#[0-9A-Fa-f]{3,6}$/.test(hex)) {
      return;
    }

    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    const [h, s, l] = hexToHsl(hex);
    this.hue.set(h);
    this.saturation.set(s);
    this.lightness.set(l);

    const newScale = generateColorScale(hex);
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));

    // Update primary scale ramp
    curr.primitives.colors['indigo'] = newScale;
    curr.primitives.colors['primary'] = newScale;

    // Update Light mode semantic primary
    curr.light.semantic.primary.main = hex;
    curr.light.semantic.primary.hover = newScale[600];
    curr.light.semantic.primary.active = newScale[700];
    curr.light.semantic.primary.light = newScale[100];
    curr.light.semantic.primaryScale = newScale;

    // Update Dark mode semantic primary
    curr.dark.semantic.primary.main = newScale[400];
    curr.dark.semantic.primary.hover = newScale[300];
    curr.dark.semantic.primary.active = newScale[200];
    curr.dark.semantic.primary.light = newScale[900];
    curr.dark.semantic.primaryScale = newScale;

    this.currentTheme.set(curr);
  }

  public onHueSlider(val: number | string): void {
    this.hue.set(Number(val));
    this.applyHslUpdate();
  }

  public onSaturationSlider(val: number | string): void {
    this.saturation.set(Number(val));
    this.applyHslUpdate();
  }

  public onLightnessSlider(val: number | string): void {
    this.lightness.set(Number(val));
    this.applyHslUpdate();
  }

  private applyHslUpdate(): void {
    const hex = hslToHex(this.hue(), this.saturation(), this.lightness());
    this.onPrimaryHexChange(hex);
  }

  public randomizePrimaryColor(): void {
    const randomHue = Math.floor(Math.random() * 360);
    const hex = hslToHex(randomHue, 80, 52);
    this.onPrimaryHexChange(hex);
  }

  public autoTunePrimaryContrast(): void {
    const current = this.primaryBaseColor();
    const bg = this.editMode() === 'dark' ? '#121212' : '#ffffff';
    const tuned = autoTuneContrast(current, 7.0, bg);
    this.onPrimaryHexChange(tuned);
  }

  public getBestContrastTextColor(hex: string): string {
    const [r, g, b] = hexToRgb(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#0f172a' : '#ffffff';
  }

  public updateRadius(key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.borderRadius as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateFont(key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.typography.fontFamily as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateFontSize(key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.typography.fontSize as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateSemantic(group: string, key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    if (modeObj[group]) {
      modeObj[group][key] = val;
    }
    this.currentTheme.set(curr);
  }

  public updateSurface(key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    modeObj.surfaces[key] = val;
    this.currentTheme.set(curr);
  }

  public updateTextToken(key: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    modeObj.text[key] = val;
    this.currentTheme.set(curr);
  }

  public getCompToken(comp: string, tokenKey: string): string {
    const modeObj = this.editMode() === 'dark' ? this.currentTheme().dark : this.currentTheme().light;
    const compObj = modeObj.components?.[comp];
    return compObj?.[tokenKey] || '';
  }

  public updateCompToken(comp: string, tokenKey: string, val: string): void {
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark : curr.light;
    if (!modeObj.components) {
      modeObj.components = {};
    }
    if (!modeObj.components[comp]) {
      modeObj.components[comp] = {};
    }
    modeObj.components[comp][tokenKey] = val;
    this.currentTheme.set(curr);
  }

  public currentExportCode = computed(() => {
    const theme = this.currentTheme();
    const activeIdTheme = { ...theme, id: this.themeId(), name: this.themeName() };
    switch (this.exportFormat()) {
      case 'css':
        return themeToCss(activeIdTheme);
      case 'typescript':
        return themeToTypeScript(activeIdTheme);
      case 'json':
        return themeToJson(activeIdTheme);
      case 'angular':
        return themeToAngularSetup(activeIdTheme);
    }
  });

  public exportLanguage = computed(() => {
    switch (this.exportFormat()) {
      case 'css':
        return 'css';
      case 'typescript':
        return 'typescript';
      case 'json':
        return 'json';
      case 'angular':
        return 'typescript';
    }
  });

  public copyToClipboard(): void {
    const code = this.currentExportCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  public downloadExportFile(): void {
    const code = this.currentExportCode();
    const format = this.exportFormat();
    const ext = format === 'css' ? 'css' : format === 'json' ? 'json' : 'ts';
    const filename = `${this.themeId()}.${ext}`;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (hex.length !== 6) {
    return [79, 70, 229];
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

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
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const val = Math.max(0, Math.min(255, Math.round((n + m) * 255))).toString(16);
    return val.length === 1 ? '0' + val : val;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
