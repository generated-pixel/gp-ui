import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { GpBadgeComponent, GpDirectionService } from 'gp-ui';
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

            <button
              type="button"
              class="header-icon-btn"
              (click)="toggleTheme()"
              [attr.aria-label]="isDark() ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
              [title]="isDark() ? 'Theme: Dark (Click for Light)' : 'Theme: Light (Click for Dark)'"
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
              <span>gp-ui Framework v0.1.0</span>
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
      width: 2.25rem;
      height: 1.5rem;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      background: repeating-linear-gradient(
        90deg,
        #e40303 0,
        #e40303 calc(100% / 7),
        #ff8c00 calc(100% / 7),
        #ff8c00 calc(100% * 2 / 7),
        #ffff41 calc(100% * 2 / 7),
        #ffff41 calc(100% * 3 / 7),
        #008026 calc(100% * 3 / 7),
        #008026 calc(100% * 4 / 7),
        #0000f9 calc(100% * 4 / 7),
        #0000f9 calc(100% * 5 / 7),
        #86007d calc(100% * 5 / 7),
        #86007d calc(100% * 6 / 7),
        #e40303 calc(100% * 6 / 7),
        #e40303 100%
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
    }
    .header-icon-btn:hover {
      background: var(--gp-surface-hover, rgba(255, 255, 255, 0.1));
      color: var(--gp-primary, #38bdf8);
    }
    .pride-flag-banner {
      height: 4px;
      background: repeating-linear-gradient(
        90deg,
        #e40303 0,
        #e40303 calc(100% / 7),
        #ff8c00 calc(100% / 7),
        #ff8c00 calc(100% * 2 / 7),
        #ffff41 calc(100% * 2 / 7),
        #ffff41 calc(100% * 3 / 7),
        #008026 calc(100% * 3 / 7),
        #008026 calc(100% * 4 / 7),
        #0000f9 calc(100% * 4 / 7),
        #0000f9 calc(100% * 5 / 7),
        #86007d calc(100% * 5 / 7),
        #86007d calc(100% * 6 / 7),
        #e40303 calc(100% * 6 / 7),
        #e40303 100%
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
  private router = inject(Router);
  private directionService = inject(GpDirectionService);

  protected currentUrl = signal<string>('/');
  protected searchQuery = signal<string>('');
  protected isDark = signal<boolean>(true);
  protected sidebarOpen = signal<boolean>(false);

  protected isHomePage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '' || url.startsWith('/#') || url.startsWith('/?');
  });

  catalogueItems: ComponentCatalogueItem[] = [
    { name: 'Getting Started', route: '/getting-started', category: 'General', icon: 'file' },
    { name: 'Theming Playground', route: '/theming', category: 'General', icon: 'palette', badge: 'New' },
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
    const active = GpThemeManager.initSystemTheme();
    this.isDark.set(active === 'gp-dark');

    // Dynamically react to OS system dark/light mode preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (GpThemeManager.getTheme() === 'system') {
          this.isDark.set(e.matches);
        }
      });
    }

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

  public toggleTheme(): void {
    const next = GpThemeManager.toggleTheme();
    this.isDark.set(next === 'gp-dark');
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
