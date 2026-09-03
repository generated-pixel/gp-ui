import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import {
  GpBadge,
  GpButton,
  GpDirectionService,
  GpInputText,
  GP_UI_VERSION,
  GpCommandPalette,
  GpCommandPaletteService,
  GpCommandItem
} from 'gp-ui';
import { GpThemeManager } from 'gp-ui-theme';
import { GpIcon } from 'gp-ui-icons';
import { ThemeEditorDialog } from './pages/theming/theme-editor-dialog';
import { ThemeEditorService } from './pages/theming/theme-editor.service';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export interface ComponentCatalogueItem {
  name: string;
  route: string;
  category: string;
  icon: string;
  badge?: string;
  children?: ComponentCatalogueItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, FormsModule, GpBadge, GpButton, GpInputText, GpIcon, GpCommandPalette, ThemeEditorDialog],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly version = GP_UI_VERSION;
  public themeEditorService = inject(ThemeEditorService);
  private router = inject(Router);
  private directionService = inject(GpDirectionService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  protected currentUrl = signal<string>('/');
  protected searchQuery = signal<string>('');
  protected isDark = signal<boolean>(true);
  protected activeThemeId = signal<string>('default');
  protected sidebarOpen = signal<boolean>(false);
  protected sidebarCollapsed = signal<boolean>(false);
  protected sidebarTransitioning = signal<boolean>(false);
  private transitionTimer: any = null;
  protected activeFlyoutCategory = signal<string | null>(null);
  protected flyoutTop = signal<number>(80);
  private flyoutTimer: any = null;
  protected themeMenuOpen = signal<boolean>(false);

  public availableThemes = GpThemeManager.getAvailableThemes();

  protected currentThemeName = computed(() => {
    const id = this.activeThemeId();
    const match = this.availableThemes.find((t) => t.id === id);
    return match ? match.name : id;
  });

  protected currentThemeColor = computed(() => {
    const id = this.activeThemeId();
    const match = this.availableThemes.find((t) => t.id === id);
    return match ? match.primaryColor : '#6366f1';
  });

  catalogueItems: ComponentCatalogueItem[] = [
    { name: 'Getting Started', route: '/getting-started', category: 'General', icon: 'file' },
    {
      name: 'Business Rules Engine',
      route: '/rules',
      category: 'General',
      icon: 'sliders',
      badge: 'New'
    },
    { name: 'UI Blocks Gallery', route: '/blocks', category: 'General', icon: 'grid', badge: '60+ Blocks' },
    {
      name: 'JSON Schema Studio',
      route: '/blocks-playground',
      category: 'General',
      icon: 'sparkles',
      badge: 'Dynamic'
    },
    { name: 'Grid & Dashboard', route: '/grid', category: 'General', icon: 'layout-grid', badge: 'New' },
    { name: 'gp-css Engine', route: '/gp-css', category: 'General', icon: 'sparkles', badge: `v${GP_UI_VERSION}` },
    { name: 'Theming Playground', route: '/theming', category: 'General', icon: 'palette', badge: 'Multi-Theme' },
    { name: 'i18n & RTL', route: '/i18n', category: 'General', icon: 'globe' },
    { name: 'Button', route: '/component/button', category: 'Components', icon: 'check' },
    { name: 'Split Button', route: '/component/split-button', category: 'Components', icon: 'check' },
    { name: 'Speed Dial', route: '/component/speed-dial', category: 'Components', icon: 'check' },
    { name: 'Button Group', route: '/component/button-group', category: 'Components', icon: 'layer-group' },
    { name: 'Toggle Button', route: '/component/toggle-button', category: 'Components', icon: 'toggle-on' },
    { name: 'Label', route: '/component/label', category: 'Form Controls', icon: 'tag', badge: 'New' },
    { name: 'Float Label', route: '/component/float-label', category: 'Form Controls', icon: 'arrow-up', badge: 'New' },
    {
      name: 'Inset Label',
      route: '/component/inset-label',
      category: 'Form Controls',
      icon: 'square-check',
      badge: 'New'
    },
    { name: 'Form Field', route: '/component/form-field', category: 'Form Controls', icon: 'square', badge: 'Updated' },
    { name: 'Input Text', route: '/component/input-text', category: 'Form Controls', icon: 'edit' },
    { name: 'Textarea', route: '/component/textarea', category: 'Form Controls', icon: 'align-left' },
    { name: 'Password', route: '/component/password', category: 'Form Controls', icon: 'lock' },
    { name: 'Input Number', route: '/component/input-number', category: 'Form Controls', icon: 'calculator' },
    { name: 'Checkbox', route: '/component/checkbox', category: 'Form Controls', icon: 'check-square' },
    { name: 'Radio Button', route: '/component/radio-button', category: 'Form Controls', icon: 'circle-dot' },
    { name: 'Switch', route: '/component/switch', category: 'Form Controls', icon: 'toggle-on' },
    { name: 'Slider', route: '/component/slider', category: 'Form Controls', icon: 'sliders' },
    { name: 'Rating', route: '/component/rating', category: 'Form Controls', icon: 'star' },
    { name: 'Color Picker', route: '/component/color-picker', category: 'Form Controls', icon: 'palette' },
    { name: 'Input Mask', route: '/component/input-mask', category: 'Form Controls', icon: 'grid' },
    { name: 'Select', route: '/component/select', category: 'Form Controls', icon: 'edit' },
    { name: 'Multi Select', route: '/component/multi-select', category: 'Form Controls', icon: 'list-check' },
    { name: 'Listbox', route: '/component/listbox', category: 'Form Controls', icon: 'list' },
    { name: 'Autocomplete', route: '/component/autocomplete', category: 'Form Controls', icon: 'search' },
    { name: 'Cascade Select', route: '/component/cascade-select', category: 'Form Controls', icon: 'sitemap' },
    { name: 'Tree Select', route: '/component/tree-select', category: 'Form Controls', icon: 'folder-tree' },
    { name: 'Date Picker', route: '/component/date-picker', category: 'Form Controls', icon: 'calendar' },
    {
      name: 'Date Range Picker',
      route: '/component/date-range-picker',
      category: 'Form Controls',
      icon: 'calendar',
      badge: 'New'
    },
    { name: 'Time Picker', route: '/component/time-picker', category: 'Form Controls', icon: 'clock' },
    { name: 'File Upload', route: '/component/file-upload', category: 'Form Controls', icon: 'upload' },
    { name: 'HTML Editor', route: '/component/html-editor', category: 'Form Controls', icon: 'edit', badge: 'New' },
    {
      name: 'Markdown Editor',
      route: '/component/md-editor',
      category: 'Form Controls',
      icon: 'file-text',
      badge: 'New'
    },
    { name: 'Paginator', route: '/component/paginator', category: 'Data Presentation', icon: 'bars' },
    { name: 'Column', route: '/component/column', category: 'Data Presentation', icon: 'table' },
    { name: 'Table', route: '/component/table', category: 'Data Presentation', icon: 'bars' },
    { name: 'Tree Table', route: '/component/tree-table', category: 'Data Presentation', icon: 'sitemap' },
    { name: 'Data View', route: '/component/data-view', category: 'Data Presentation', icon: 'list' },
    { name: 'Virtual Scroller', route: '/component/virtual-scroller', category: 'Data Presentation', icon: 'scroll' },
    { name: 'Tree', route: '/component/tree', category: 'Tree & Hierarchy', icon: 'folder-tree' },
    { name: 'Org Chart', route: '/component/org-chart', category: 'Tree & Hierarchy', icon: 'network' },
    { name: 'Menu', route: '/component/menu', category: 'Navigation', icon: 'menu' },
    { name: 'Menubar', route: '/component/menubar', category: 'Navigation', icon: 'bars' },
    { name: 'Context Menu', route: '/component/context-menu', category: 'Navigation', icon: 'context-menu' },
    { name: 'Tiered Menu', route: '/component/tiered-menu', category: 'Navigation', icon: 'sitemap' },
    { name: 'Mega Menu', route: '/component/mega-menu', category: 'Navigation', icon: 'grid' },
    { name: 'Panel Menu', route: '/component/panel-menu', category: 'Navigation', icon: 'folder' },
    { name: 'Breadcrumb', route: '/component/breadcrumb', category: 'Navigation', icon: 'home' },
    { name: 'Tabs', route: '/component/tabs', category: 'Navigation', icon: 'window' },
    { name: 'Stepper', route: '/component/stepper', category: 'Navigation', icon: 'route' },
    { name: 'Dock', route: '/component/dock', category: 'Navigation', icon: 'dock' },
    { name: 'Toolbar', route: '/component/toolbar', category: 'Navigation', icon: 'tool' },
    { name: 'Dialog', route: '/component/dialog', category: 'Overlays', icon: 'sliders' },
    { name: 'Confirm Dialog', route: '/component/confirm-dialog', category: 'Overlays', icon: 'confirm' },
    { name: 'Drawer', route: '/component/drawer', category: 'Overlays', icon: 'panel-right' },
    { name: 'Popover', route: '/component/popover', category: 'Overlays', icon: 'message-circle' },
    { name: 'Grid & Dashboard', route: '/grid', category: 'Panels', icon: 'layout-grid', badge: 'New' },
    { name: 'Card', route: '/component/card', category: 'Panels', icon: 'layer-group' },
    { name: 'Accordion', route: '/component/accordion', category: 'Panels', icon: 'chevron-down' },
    { name: 'Fieldset', route: '/component/fieldset', category: 'Panels', icon: 'window' },
    { name: 'Divider', route: '/component/divider', category: 'Panels', icon: 'separator' },
    { name: 'Splitter', route: '/component/splitter', category: 'Panels', icon: 'resize' },
    { name: 'Scroll Panel', route: '/component/scroll-panel', category: 'Panels', icon: 'scroll' },
    { name: 'Toast', route: '/component/toast', category: 'Feedback', icon: 'bell' },
    { name: 'Message', route: '/component/message', category: 'Feedback', icon: 'info-circle' },
    { name: 'Progress Bar', route: '/component/progress-bar', category: 'Feedback', icon: 'progress' },
    { name: 'Progress Spinner', route: '/component/progress-spinner', category: 'Feedback', icon: 'spinner' },
    { name: 'Skeleton', route: '/component/skeleton', category: 'Feedback', icon: 'shimmer' },
    { name: 'Badge', route: '/component/badge', category: 'Feedback', icon: 'info-circle' },
    { name: 'Tag', route: '/component/tag', category: 'Feedback', icon: 'tag' },
    { name: 'Chip', route: '/component/chip', category: 'Display', icon: 'chip' },
    { name: 'Image', route: '/component/image', category: 'Display', icon: 'image' },
    { name: 'Icon', route: '/component/icon', category: 'Display', icon: 'star' },
    { name: 'Avatar', route: '/component/avatar', category: 'Display', icon: 'star' },
    { name: 'Carousel', route: '/component/carousel', category: 'Display', icon: 'slides' },
    { name: 'Timeline', route: '/component/timeline', category: 'Display', icon: 'timeline' },
    { name: 'Meter Group', route: '/component/meter-group', category: 'Display', icon: 'meter' },
    { name: 'Empty State', route: '/component/empty-state', category: 'Display', icon: 'sparkles' }
  ];

  constructor() {
    // Initialize theme based on OS system setting (or saved user preference)
    GpThemeManager.initSystemTheme();

    // Subscribe to real-time theme manager changes
    GpThemeManager.onChange((state) => {
      this.isDark.set(state.isDark);
      this.activeThemeId.set(state.theme);
    });

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = e.urlAfterRedirects || e.url || '/';
      this.currentUrl.set(url);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const PAGE_SEO: Record<string, { title: string; desc: string }> = {
        '/': {
          title: 'gp-ui — Next-Generation Angular UI Component Library & Design System',
          desc: 'Modern, enterprise-grade Angular 19+ UI component library with signals, 75+ accessible components, responsive blocks, and rich design tokens.'
        },
        '/getting-started': {
          title: 'Getting Started — gp-ui Angular UI Documentation',
          desc: 'Quick start guide, installation, npm packages, standalone component imports, and configuration for @generatedpixel/gp-ui.'
        },
        '/blocks': {
          title: 'Pre-built Blocks & Page Templates — gp-ui',
          desc: 'Production-ready dashboard layouts, multi-column workspace templates, headers, and full-page blocks built with gp-ui.'
        },
        '/blocks-playground': {
          title: 'Interactive Blocks Playground — gp-ui',
          desc: 'Customize, edit, and preview enterprise page templates and application layout blocks in real time.'
        },
        '/theming': {
          title: 'Theme Studio & Design Tokens — gp-ui',
          desc: 'Interactive color palette customization, typography scaling, border radiuses, dark mode presets, and CSS custom property export.'
        },
        '/gp-css': {
          title: 'gp-css Atomic Utility Engine — gp-ui',
          desc: 'Zero-dependency atomic CSS compiler generating scoped utility classes and design token integration for Angular.'
        },
        '/i18n': {
          title: 'Internationalization & RTL Support — gp-ui',
          desc: 'Runtime language translation dictionary, RTL layout flipping, and localized calendar formats for Angular applications.'
        },
        '/grid': {
          title: 'Draggable Dashboard Grid & Widget Engine — gp-ui',
          desc: 'Responsive drag-and-drop dashboard grid layout with collision resolution and compacting algorithms for Angular.'
        },
        '/rules': {
          title: 'Reactive Business Rule Engine & Visual Builder — gp-ui',
          desc: 'Dynamic JSON-based rule engine with condition inspectors, directive bindings, and visual expression builders for Angular.'
        }
      };

      const matched = PAGE_SEO[url];
      if (matched) {
        this.titleService.setTitle(matched.title);
        this.metaService.updateTag({ name: 'description', content: matched.desc });
        this.metaService.updateTag({ property: 'og:title', content: matched.title });
        this.metaService.updateTag({ property: 'og:description', content: matched.desc });
      }

      if (typeof window.gtag === 'function') {
        window.gtag('config', 'G-E0GPEPPLFV', {
          page_path: url
        });
      }
    });
  }

  protected filteredCatalogue = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) {
      return this.catalogueItems;
    }
    return this.catalogueItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  });

  public commandPaletteItems: GpCommandItem[] = [
    // Direct Navigation Items
    ...this.catalogueItems.map((item) => ({
      id: `nav-${item.route}`,
      title: `Go to ${item.name}`,
      category: item.category,
      icon: item.icon,
      badge: item.badge,
      action: () => this.router.navigateByUrl(item.route)
    })),
    // Theme Switcher Actions
    {
      id: 'theme-studio',
      title: 'Open Theme Studio Dialog',
      category: 'Theming & Customization',
      icon: 'sliders',
      badge: 'Interactive',
      action: () => this.themeEditorService.open()
    },
    {
      id: 'theme-toggle-mode',
      title: 'Toggle Light / Dark Color Mode',
      category: 'Theming & Customization',
      icon: 'moon',
      shortcut: 'T M',
      action: () => GpThemeManager.toggleMode()
    },
    {
      id: 'theme-high-contrast',
      title: 'Switch to High Contrast Dark (WCAG AAA)',
      category: 'Theming & Customization',
      icon: 'check',
      badge: 'WCAG AAA',
      action: () => GpThemeManager.setTheme('high-contrast-dark')
    }
  ];

  public onCommandSelected(item: GpCommandItem): void {
    if (item.action) {
      item.action();
    }
  }

  protected readonly categoryItemsMap = computed<Record<string, ComponentCatalogueItem[]>>(() => {
    const map: Record<string, ComponentCatalogueItem[]> = {};
    this.filteredCatalogue().forEach((item) => {
      const category = item.category;
      if (!map[category]) {
        map[category] = [];
      }
      map[category].push(item);
    });
    return map;
  });

  protected readonly categoryNames = computed(() => Object.keys(this.categoryItemsMap()));

  public getItemsForCategory(category: string): ComponentCatalogueItem[] {
    return this.categoryItemsMap()[category] ?? [];
  }

  public onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  public toggleThemeMenu(): void {
    this.themeMenuOpen.update((v) => !v);
  }

  public closeThemeMenu(): void {
    this.themeMenuOpen.set(false);
  }

  public selectTheme(themeId: string): void {
    GpThemeManager.setTheme(themeId);
    this.themeMenuOpen.set(false);
  }

  public toggleThemeMode(): void {
    GpThemeManager.toggleMode();
  }

  public toggleRtl(): void {
    this.directionService.toggle();
  }

  public toggleSidebar(): void {
    if (typeof window !== 'undefined' && window.innerWidth <= 900) {
      this.sidebarOpen.update((v) => !v);
    } else {
      this.sidebarTransitioning.set(true);
      if (this.transitionTimer) {
        clearTimeout(this.transitionTimer);
      }
      this.sidebarCollapsed.update((v) => !v);
      this.transitionTimer = setTimeout(() => {
        this.sidebarTransitioning.set(false);
      }, 260);
    }
  }

  public closeSidebarOnMobile(): void {
    this.sidebarOpen.set(false);
  }

  public getCategoryIcon(category: string): string {
    switch (category) {
      case 'General':
        return 'sparkles';
      case 'Components':
        return 'box';
      case 'Form Controls':
        return 'edit';
      case 'Data Presentation':
        return 'table';
      case 'Tree & Hierarchy':
        return 'folder-tree';
      case 'Navigation':
        return 'menu';
      case 'Panels':
        return 'layers';
      case 'Overlays':
        return 'window';
      case 'Feedback':
        return 'bell';
      case 'Display':
        return 'image';
      default:
        return 'circle';
    }
  }

  public getCategoryAbbr(category: string): string {
    switch (category) {
      case 'General':
        return 'General';
      case 'Components':
        return 'Buttons';
      case 'Form Controls':
        return 'Forms';
      case 'Data Presentation':
        return 'Data';
      case 'Tree & Hierarchy':
        return 'Tree';
      case 'Navigation':
        return 'Nav';
      case 'Panels':
        return 'Panels';
      case 'Overlays':
        return 'Overlay';
      case 'Feedback':
        return 'Feedback';
      case 'Display':
        return 'Display';
      default:
        return category.slice(0, 5);
    }
  }

  public isCategoryActive(category: string): boolean {
    const items = this.categoryItemsMap()[category];
    if (!items) {
      return false;
    }
    const url = this.currentUrl();
    return items.some((item) => item.route === url || (item.route !== '/' && url.startsWith(item.route)));
  }

  public isFlyoutMulticol(cat?: string | null): boolean {
    if (cat) {
      const items = this.categoryItemsMap()[cat] || [];
      return items.length > 12;
    }
    return this.getFlyoutItems().length > 12;
  }

  public openFlyout(cat: string, event: MouseEvent): void {
    if (this.flyoutTimer) {
      clearTimeout(this.flyoutTimer);
      this.flyoutTimer = null;
    }
    const target = (event.currentTarget as HTMLElement) || (event.target as HTMLElement);
    if (target) {
      const rect = target.getBoundingClientRect();
      const items = this.categoryItemsMap()[cat] || [];
      const multicol = this.isFlyoutMulticol(cat);
      const rowCount = multicol ? Math.ceil(items.length / 2) : items.length;
      const estimatedHeight = Math.min(
        typeof window !== 'undefined' ? window.innerHeight - 80 : 500,
        56 + rowCount * 36
      );
      const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
      const spaceBelow = viewportHeight - rect.top;

      let top: number;
      if (spaceBelow < estimatedHeight + 16) {
        top = Math.max(65, viewportHeight - estimatedHeight - 16);
      } else {
        top = Math.max(65, rect.top - 6);
      }
      this.flyoutTop.set(Math.round(top));
    }
    this.activeFlyoutCategory.set(cat);
  }

  public scheduleCloseFlyout(): void {
    if (this.flyoutTimer) {
      clearTimeout(this.flyoutTimer);
    }
    this.flyoutTimer = setTimeout(() => {
      this.activeFlyoutCategory.set(null);
    }, 160);
  }

  public cancelCloseFlyout(): void {
    if (this.flyoutTimer) {
      clearTimeout(this.flyoutTimer);
      this.flyoutTimer = null;
    }
  }

  public closeFlyoutImmediate(): void {
    if (this.flyoutTimer) {
      clearTimeout(this.flyoutTimer);
      this.flyoutTimer = null;
    }
    this.activeFlyoutCategory.set(null);
  }

  public getFlyoutItems(): ComponentCatalogueItem[] {
    const cat = this.activeFlyoutCategory();
    if (!cat) {
      return [];
    }
    return this.categoryItemsMap()[cat] ?? [];
  }
}
