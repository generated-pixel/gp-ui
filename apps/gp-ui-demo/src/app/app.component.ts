import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GpButtonComponent, GpBadgeComponent, GpTagComponent, GpDirectionService } from 'gp-ui';
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
    GpTagComponent,
    GpIconComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="header-left">
          <button class="mobile-menu-btn" (click)="toggleSidebar()" aria-label="Toggle navigation">
            <gp-icon name="bars" size="1.25em" />
          </button>

          <a routerLink="/" class="app-logo">
            <span class="logo-accent">gp</span>-ui
          </a>
          <gp-tag value="v1.0.0" severity="primary" [rounded]="true" />
        </div>

        <div class="header-center">
          <div class="search-input-wrap">
            <gp-icon name="search" size="0.9em" class="search-icon" />
            <input
              type="text"
              class="search-input"
              placeholder="Search components (e.g. table, select, modal)..."
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              aria-label="Search component catalogue"
            />
          </div>
        </div>

        <div class="header-right">
          <button
            type="button"
            class="header-icon-btn"
            (click)="toggleTheme()"
            [attr.aria-label]="isDark() ? 'Switch to Light Theme' : 'Switch to Dark Theme'"
          >
            <gp-icon [name]="isDark() ? 'sun' : 'moon'" size="1.2em" />
          </button>

          <button
            type="button"
            class="header-icon-btn"
            (click)="toggleRtl()"
            aria-label="Toggle RTL Direction"
          >
            <gp-icon name="globe" size="1.2em" />
          </button>

          <a
            href="https://github.com/generated-pixel/gp-ui"
            target="_blank"
            rel="noopener noreferrer"
            class="header-icon-btn"
            aria-label="GitHub Repository"
          >
            <gp-icon name="code" size="1.2em" />
          </a>
        </div>
      </header>

      <div class="app-body">
        <!-- Sidebar Navigation -->
        <aside class="app-sidebar" [class.app-sidebar-open]="sidebarOpen()">
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

        <!-- Main Content View -->
        <main class="app-main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-header {
      height: var(--app-header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      background: var(--gp-surface-card);
      border-bottom: 1px solid var(--gp-surface-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--gp-text-color);
      cursor: pointer;
      padding: 0.25rem;
    }
    @media (max-width: 900px) {
      .mobile-menu-btn { display: inline-flex; }
    }
    .app-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--gp-text-color);
      text-decoration: none;
      letter-spacing: -0.03em;
    }
    .logo-accent {
      color: var(--gp-primary);
    }
    .header-center {
      flex: 1;
      max-width: 32rem;
      margin: 0 1.5rem;
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
      color: var(--gp-text-color-muted);
    }
    .search-input {
      width: 100%;
      height: 2.25rem;
      padding: 0 0.75rem 0 2.25rem;
      border-radius: var(--gp-border-radius-full);
      border: 1px solid var(--gp-input-border);
      background: var(--gp-input-bg);
      color: var(--gp-text-color);
      font-size: var(--gp-font-size-sm);
      outline: none;
      transition: border-color var(--gp-transition-duration);
    }
    .search-input:focus {
      border-color: var(--gp-primary);
      box-shadow: var(--gp-focus-ring);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header-icon-btn {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--gp-text-color-secondary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background var(--gp-transition-duration), color var(--gp-transition-duration);
      text-decoration: none;
    }
    .header-icon-btn:hover {
      background: var(--gp-surface-hover);
      color: var(--gp-primary);
    }
    .app-body {
      display: flex;
      flex: 1;
    }
    .app-sidebar {
      width: var(--app-sidebar-width);
      border-right: 1px solid var(--gp-surface-border);
      background: var(--gp-surface-card);
      position: sticky;
      top: var(--app-header-height);
      height: calc(100vh - var(--app-header-height));
      overflow-y: auto;
      flex-shrink: 0;
    }
    @media (max-width: 900px) {
      .app-sidebar {
        position: fixed;
        left: -100%;
        top: var(--app-header-height);
        height: calc(100vh - var(--app-header-height));
        z-index: 99;
        transition: left 0.3s ease;
      }
      .app-sidebar.app-sidebar-open {
        left: 0;
      }
    }
    .sidebar-nav {
      padding: 1.25rem 1rem;
    }
    .nav-category {
      margin-bottom: 1.5rem;
    }
    .nav-category-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--gp-text-color-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
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
      border-radius: var(--gp-border-radius);
      color: var(--gp-text-color-secondary);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      font-weight: 500;
      transition: all var(--gp-transition-duration);
    }
    .nav-link:hover {
      background: var(--gp-surface-hover);
      color: var(--gp-text-color);
    }
    .nav-link-active {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary) !important;
      font-weight: 600;
    }
    .nav-icon {
      color: inherit;
    }
    .nav-label {
      flex: 1;
    }
    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      overflow-x: hidden;
    }
  `]
})
export class AppComponent {
  private directionService = inject(GpDirectionService);

  protected searchQuery = signal<string>('');
  protected isDark = signal<boolean>(false);
  protected sidebarOpen = signal<boolean>(false);

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
