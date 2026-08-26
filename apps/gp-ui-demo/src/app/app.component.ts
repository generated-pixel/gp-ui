import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { GpBadgeComponent, GpDirectionService, GP_UI_VERSION } from 'gp-ui';
import { GpThemeManager } from 'gp-ui-theme';
import { GpIconComponent } from 'gp-ui-icons';

export interface ComponentCatalogueItem {
  name: string;
  route: string;
  category: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GpBadgeComponent,
    GpIconComponent
  ],
  template: `
    <div class="app-layout" [class.is-docs-mode]="!isHomePage()">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="site-shell-header">
          <div class="header-left">
            @if (!isHomePage()) {
              <button class="mobile-menu-btn" (click)="toggleSidebar()" aria-label="Toggle navigation">
                <gp-icon name="bars" size="1.25em" />
              </button>
            }

            <a routerLink="/" class="brand-mark">
              <img
                src="/img/generated-pixel-logomark.svg"
                alt="Generated Pixel logo"
                class="brand-mark__logo"
              />
              <span class="brand-mark__text">
                <span class="brand-mark__name">Generated Pixel</span>
                <span class="brand-mark__tag">Software Studio</span>
              </span>
              <span class="pride-flag-small" aria-hidden="true"></span>
            </a>

            @if (!isHomePage()) {
              <a routerLink="/" class="back-to-site-btn">
                <gp-icon name="chevron-left" size="0.8em" />
                <span>Studio Website</span>
              </a>
            }
          </div>

          <!-- If in Docs Mode: Search Bar -->
          @if (!isHomePage()) {
            <div class="header-center">
              <div class="search-input-wrap">
                <gp-icon name="search" size="0.9em" class="search-icon" />
                <input
                  type="text"
                  class="search-input"
                  placeholder="Search components (e.g. table, select, dialog)..."
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                  aria-label="Search component catalogue"
                />
              </div>
            </div>
          } @else {
            <!-- If on Home: Navigation Links -->
            <nav class="home-nav-links">
              <a href="#services" class="nav-anchor">Services</a>
              <a href="#portfolio" class="nav-anchor">Portfolio</a>
              <a href="#contact" class="nav-anchor">Contact</a>
              <a routerLink="/getting-started" class="nav-docs-badge">
                <gp-icon name="layer-group" size="0.9em" />
                <span>gp-ui Docs &amp; Demo</span>
              </a>
            </nav>
          }

          <div class="header-right">
            @if (isHomePage()) {
              <a href="#contact" class="cta-link-header">Book Call</a>
            }

            <!-- Theme Palette Selector Dropdown -->
            <div class="theme-switcher-container">
              <button
                type="button"
                class="header-icon-btn theme-palette-btn"
                (click)="toggleThemeMenu()"
                [attr.aria-expanded]="themeMenuOpen()"
                aria-label="Select Theme Preset"
                title="Theme: {{ currentThemeName() }} (Click to Change)"
              >
                <gp-icon name="palette" size="1.2em" />
                <span class="theme-dot-indicator" [style.backgroundColor]="currentThemeColor()"></span>
              </button>

              @if (themeMenuOpen()) {
                <div class="theme-dropdown-backdrop" (click)="closeThemeMenu()"></div>
                <div class="theme-dropdown-menu">
                  <div class="theme-dropdown-header">
                    <span>Theme Presets</span>
                    <span class="theme-mode-badge">{{ isDark() ? 'Dark Mode' : 'Light Mode' }}</span>
                  </div>
                  <div class="theme-list">
                    @for (t of availableThemes; track t.id) {
                      <button
                        type="button"
                        class="theme-option-btn"
                        [class.theme-option-active]="activeThemeId() === t.id"
                        (click)="selectTheme(t.id)"
                      >
                        <div class="theme-swatch-pair">
                          <span class="theme-swatch" [style.backgroundColor]="t.primaryColor"></span>
                          <span class="theme-swatch" [style.backgroundColor]="t.accentColor"></span>
                        </div>
                        <div class="theme-meta">
                          <span class="theme-name">{{ t.name }}</span>
                        </div>
                        @if (activeThemeId() === t.id) {
                          <gp-icon name="check" size="0.9em" class="theme-check-icon" />
                        }
                      </button>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Light / Dark Mode Toggle Button -->
            <button
              type="button"
              class="header-icon-btn"
              (click)="toggleThemeMode()"
              [attr.aria-label]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              [title]="isDark() ? 'Mode: Dark (Click for Light)' : 'Mode: Light (Click for Dark)'"
            >
              <gp-icon [name]="isDark() ? 'sun' : 'moon'" size="1.2em" />
            </button>

            @if (!isHomePage()) {
              <button
                type="button"
                class="header-icon-btn"
                (click)="toggleRtl()"
                aria-label="Toggle RTL Direction"
                title="Toggle Text Direction (LTR / RTL)"
              >
                <gp-icon name="globe" size="1.2em" />
              </button>
            }

            <a
              href="https://github.com/generated-pixel/gp-ui"
              target="_blank"
              rel="noopener noreferrer"
              class="header-icon-btn"
              aria-label="GitHub Repository"
              title="GitHub Repository"
            >
              <gp-icon name="code" size="1.2em" />
            </a>
          </div>
        </div>
        <div class="pride-flag-banner" aria-hidden="true"></div>
      </header>

      <!-- Layout Body -->
      @if (isHomePage()) {
        <!-- Full-Width Website Homepage -->
        <main class="app-main-home">
          <router-outlet />
        </main>
      } @else {
        <!-- Documentation & Interactive User Guide Mode with Sidebar -->
        <div class="app-body">
          <!-- Sidebar Navigation -->
          <aside class="app-sidebar" [class.app-sidebar-open]="sidebarOpen()">
            <div class="sidebar-header-note">
              <span>gp-ui Framework v{{ version }}</span>
            </div>
            <nav class="sidebar-nav">
              @for (cat of categories(); track cat) {
                <div class="nav-category">
                  <div class="nav-category-title">{{ cat }}</div>
                  <ul class="nav-items">
                    @for (item of getItemsForCategory(cat); track item.route) {
                      <li class="nav-item">
                        <a
                          [routerLink]="item.route"
                          routerLinkActive="nav-link-active"
                          class="nav-link"
                          (click)="closeSidebarOnMobile()"
                        >
                          <gp-icon [name]="item.icon" size="0.9em" class="nav-icon" />
                          <span class="nav-label">{{ item.name }}</span>
                          @if (item.badge) {
                            <gp-badge [value]="item.badge" severity="primary" size="sm" />
                          }
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </nav>
          </aside>

          <!-- Main Docs View -->
          <main class="app-main-docs">
            <router-outlet />
          </main>
        </div>
      }
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--gp-surface-ground, #0b0f19);
      color: var(--gp-text-color, #f8fafc);
    }
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(18px);
      background: var(--gp-surface-card, #0f172a);
      border-bottom: 1px solid var(--gp-surface-border, rgba(51, 65, 85, 0.4));
      transition: background-color var(--gp-transition-duration, 150ms) ease, border-color var(--gp-transition-duration, 150ms) ease;
    }
    .site-shell-header {
      width: min(100% - 3rem, 74rem);
      margin-inline: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .brand-mark {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .brand-mark__logo {
      width: 2.5rem;
      height: 2.5rem;
    }
    .brand-mark__text {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .brand-mark__name {
      color: var(--gp-text-color, #ffffff);
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .brand-mark__tag {
      color: var(--gp-text-color-secondary, #94a3b8);
      font-size: 0.68rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
    }
    .pride-flag-small {
      width: 2rem;
      height: 1.35rem;
      border-radius: 3px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
      background: linear-gradient(
        180deg,
        #e40303 0%,
        #e40303 16.666%,
        #ff8c00 16.666%,
        #ff8c00 33.333%,
        #ffed00 33.333%,
        #ffed00 50%,
        #008026 50%,
        #008026 66.666%,
        #004dff 66.666%,
        #004dff 83.333%,
        #750787 83.333%,
        #750787 100%
      );
    }
    .back-to-site-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.08));
      border: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.15));
      color: var(--gp-text-color-secondary, #cbd5e1);
      font-size: 0.8rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .back-to-site-btn:hover {
      background: var(--gp-surface-active, rgba(255, 255, 255, 0.16));
      color: var(--gp-text-color, #ffffff);
    }
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--gp-text-color, #e2e8f0);
      cursor: pointer;
      padding: 0.25rem;
    }
    @media (max-width: 900px) {
      .mobile-menu-btn { display: inline-flex; }
    }
    .home-nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .home-nav-links { display: none; }
    }
    .nav-anchor {
      color: var(--gp-text-color-secondary, #cbd5e1);
      font-size: 0.95rem;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .nav-anchor:hover {
      color: var(--gp-primary, #67e8f9);
    }
    .nav-docs-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      background: var(--gp-primary-light, rgba(14, 165, 233, 0.15));
      border: 1px solid var(--gp-primary-border, rgba(14, 165, 233, 0.5));
      color: var(--gp-primary, #67e8f9);
      font-size: 0.85rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-docs-badge:hover {
      background: var(--gp-primary, #0ea5e9);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .header-center {
      flex: 1;
      max-width: 28rem;
      margin: 0 1rem;
    }
    @media (max-width: 600px) {
      .header-center { display: none; }
    }
    .search-input-wrap {
      position: relative;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gp-text-color-muted, #94a3b8);
    }
    .search-input {
      width: 100%;
      height: 2.25rem;
      padding: 0 0.75rem 0 2.25rem;
      border-radius: 999px;
      border: 1px solid var(--gp-input-border, rgba(255, 255, 255, 0.15));
      background: var(--gp-input-bg, rgba(15, 23, 42, 0.6));
      color: var(--gp-text-color, #ffffff);
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.15s ease, background-color 0.15s ease;
    }
    .search-input:focus {
      border-color: var(--gp-primary, #38bdf8);
      box-shadow: var(--gp-focus-ring);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cta-link-header {
      display: inline-flex;
      align-items: center;
      padding: 0.45rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.25));
      color: var(--gp-text-color, #ffffff);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .cta-link-header:hover {
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.1));
      border-color: var(--gp-primary, #ffffff);
    }
    .header-icon-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--gp-text-color-secondary, #cbd5e1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      position: relative;
    }
    .header-icon-btn:hover {
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.1));
      color: var(--gp-primary, #38bdf8);
    }
    .theme-switcher-container {
      position: relative;
    }
    .theme-dot-indicator {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1px solid var(--gp-surface-card);
    }
    .theme-dropdown-backdrop {
      position: fixed;
      inset: 0;
      z-index: 150;
    }
    .theme-dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 17.5rem;
      background: var(--gp-surface-card, #0f172a);
      border: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.15));
      border-radius: var(--gp-border-radius-md, 8px);
      box-shadow: var(--gp-shadow-xl);
      padding: 0.5rem;
      z-index: 160;
      animation: gp-slide-down 0.15s ease-out;
    }
    .theme-dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.4rem 0.5rem 0.5rem;
      border-bottom: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.1));
      margin-bottom: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--gp-text-color-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .theme-mode-badge {
      font-size: 0.7rem;
      color: var(--gp-primary);
      text-transform: none;
      font-weight: 600;
    }
    .theme-list {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      max-height: 20rem;
      overflow-y: auto;
    }
    .theme-option-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.5rem 0.6rem;
      border-radius: var(--gp-border-radius, 6px);
      border: none;
      background: transparent;
      color: var(--gp-text-color);
      cursor: pointer;
      text-align: left;
      font-size: 0.85rem;
      font-weight: 500;
      transition: background-color 0.12s ease;
    }
    .theme-option-btn:hover {
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.08));
    }
    .theme-option-active {
      background: var(--gp-primary-light, rgba(99, 102, 241, 0.15)) !important;
      color: var(--gp-primary) !important;
      font-weight: 700;
    }
    .theme-swatch-pair {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .theme-swatch {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    }
    .theme-meta {
      flex: 1;
    }
    .theme-name {
      display: block;
      font-size: 0.85rem;
    }
    .theme-check-icon {
      color: var(--gp-primary);
    }
    .pride-flag-banner {
      height: 4px;
      background: linear-gradient(
        90deg,
        #e40303 0%,
        #e40303 16.666%,
        #ff8c00 16.666%,
        #ff8c00 33.333%,
        #ffed00 33.333%,
        #ffed00 50%,
        #008026 50%,
        #008026 66.666%,
        #004dff 66.666%,
        #004dff 83.333%,
        #750787 83.333%,
        #750787 100%
      );
    }
    .app-main-home {
      flex: 1;
      width: 100%;
    }
    .app-body {
      display: flex;
      flex: 1;
    }
    .app-sidebar {
      width: 18rem;
      border-right: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.1));
      background: var(--gp-surface-card, #0f172a);
      position: sticky;
      top: 3.75rem;
      height: calc(100vh - 3.75rem);
      overflow-y: auto;
      flex-shrink: 0;
      transition: background-color var(--gp-transition-duration, 150ms) ease, border-color var(--gp-transition-duration, 150ms) ease;
    }
    @media (max-width: 900px) {
      .app-sidebar {
        position: fixed;
        left: -100%;
        top: 3.75rem;
        height: calc(100vh - 3.75rem);
        z-index: 99;
        transition: left 0.3s ease;
      }
      .app-sidebar.app-sidebar-open {
        left: 0;
      }
    }
    .sidebar-header-note {
      padding: 1rem 1.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--gp-primary, #38bdf8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .sidebar-nav {
      padding: 0.75rem 1rem 2rem;
    }
    .nav-category {
      margin-bottom: 1.5rem;
    }
    .nav-category-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--gp-text-color-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.4rem;
      padding: 0 0.5rem;
    }
    .nav-items {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--gp-border-radius, 6px);
      color: var(--gp-text-color-secondary, #cbd5e1);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .nav-link:hover {
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.06));
      color: var(--gp-text-color, #ffffff);
    }
    .nav-link-active {
      background: var(--gp-primary-light, rgba(14, 165, 233, 0.18)) !important;
      color: var(--gp-primary, #38bdf8) !important;
      font-weight: 700;
    }
    .nav-icon {
      color: inherit;
    }
    .nav-label {
      flex: 1;
    }
    .app-main-docs {
      flex: 1;
      padding: 2rem 2.5rem;
      max-width: 1200px;
      overflow-x: hidden;
    }
    @media (max-width: 600px) {
      .app-main-docs { padding: 1.25rem; }
    }
  `]
})
export class AppComponent {
  protected readonly version = GP_UI_VERSION;
  private router = inject(Router);
  private directionService = inject(GpDirectionService);

  protected currentUrl = signal<string>('/');
  protected searchQuery = signal<string>('');
  protected isDark = signal<boolean>(true);
  protected activeThemeId = signal<string>('default');
  protected sidebarOpen = signal<boolean>(false);
  protected themeMenuOpen = signal<boolean>(false);

  public availableThemes = GpThemeManager.getAvailableThemes();

  protected currentThemeName = computed(() => {
    const id = this.activeThemeId();
    const match = this.availableThemes.find(t => t.id === id);
    return match ? match.name : id;
  });

  protected currentThemeColor = computed(() => {
    const id = this.activeThemeId();
    const match = this.availableThemes.find(t => t.id === id);
    return match ? match.primaryColor : '#6366f1';
  });

  protected isHomePage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '' || url.startsWith('/#') || url.startsWith('/?');
  });

  catalogueItems: ComponentCatalogueItem[] = [
    { name: 'Getting Started', route: '/getting-started', category: 'General', icon: 'file' },
    { name: 'Theming Playground', route: '/theming', category: 'General', icon: 'palette', badge: 'Multi-Theme' },
    { name: 'i18n & RTL', route: '/i18n', category: 'General', icon: 'globe' },
    { name: 'Buttons & Actions', route: '/buttons', category: 'Components', icon: 'check' },
    { name: 'Form Controls (20)', route: '/forms', category: 'Components', icon: 'edit', badge: '20' },
    { name: 'Data Presentation', route: '/data', category: 'Components', icon: 'bars' },
    { name: 'Tree & Hierarchies', route: '/tree', category: 'Components', icon: 'folder' },
    { name: 'Navigation & Menus', route: '/navigation', category: 'Components', icon: 'window' },
    { name: 'Overlays & Dialogs', route: '/overlays', category: 'Components', icon: 'sliders' },
    { name: 'Panels & Layouts', route: '/panels', category: 'Components', icon: 'layer-group' },
    { name: 'Feedback & Messages', route: '/feedback', category: 'Components', icon: 'info-circle' },
    { name: 'Display & Media', route: '/display', category: 'Components', icon: 'star' }
  ];

  constructor() {
    // Initialize theme based on OS system setting (or saved user preference)
    GpThemeManager.initSystemTheme();

    // Subscribe to real-time theme manager changes
    GpThemeManager.onChange((state) => {
      this.isDark.set(state.isDark);
      this.activeThemeId.set(state.theme);
    });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentUrl.set(e.urlAfterRedirects || e.url || '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  protected filteredCatalogue = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.catalogueItems;
    return this.catalogueItems.filter(item =>
      item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  });

  protected categories = computed(() => {
    const set = new Set<string>();
    this.filteredCatalogue().forEach(item => set.add(item.category));
    return Array.from(set);
  });

  public getItemsForCategory(category: string): ComponentCatalogueItem[] {
    return this.filteredCatalogue().filter(item => item.category === category);
  }

  public onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  public toggleThemeMenu(): void {
    this.themeMenuOpen.update(v => !v);
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
    this.sidebarOpen.update(v => !v);
  }

  public closeSidebarOnMobile(): void {
    this.sidebarOpen.set(false);
  }
}

