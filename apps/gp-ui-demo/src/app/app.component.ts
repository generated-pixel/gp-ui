import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { GpBadgeComponent, GpDirectionService, GP_UI_VERSION } from 'gp-ui';
import { GpThemeManager } from 'gp-ui-theme';
import { GpIconComponent } from 'gp-ui-icons';
import { ThemeEditorDialogComponent } from './pages/theming/theme-editor-dialog.component';
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
  imports: [CommonModule, RouterModule, FormsModule, GpBadgeComponent, GpIconComponent, ThemeEditorDialogComponent],
  template: `
    <div class="app-layout">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="site-shell-header">
          <div class="header-left">
            <button class="mobile-menu-btn" (click)="toggleSidebar()" aria-label="Toggle navigation">
              <gp-icon name="bars" size="1.25em" />
            </button>

            <a routerLink="/" class="brand-mark">
              <img src="/img/generated-pixel-logomark.svg" alt="Generated Pixel logo" class="brand-mark__logo" />
              <span class="brand-mark__text">
                <span class="brand-mark__name">gp-ui</span>
                <span class="brand-mark__tag">Component Library</span>
              </span>
              <span class="pride-flag-small" aria-hidden="true"></span>
            </a>

            <a
              class="company-link"
              href="https://generatedpixel.dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Generated Pixel home"
              title="Generated Pixel"
            >
              <span class="company-link__label">Built by</span>
              <span class="company-link__brand">Generated Pixel</span>
            </a>
          </div>

          <!-- Component Search Bar -->
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

          <div class="header-right">
            <!-- Prominent Theme Studio Launch Button -->
            <button
              type="button"
              class="header-theme-studio-btn"
              (click)="themeEditorService.open()"
              title="Open Interactive Theme Editor Dialog"
            >
              <gp-icon name="sliders" size="1.1em" />
              <span>Theme Studio</span>
            </button>

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
                  <div class="theme-dropdown-studio-cta">
                    <button
                      type="button"
                      class="dropdown-studio-btn"
                      (click)="themeEditorService.open(); closeThemeMenu()"
                    >
                      <gp-icon name="sliders" size="1em" />
                      <span>Open Theme Editor Studio...</span>
                    </button>
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

            <!-- RTL Direction Toggle Button -->
            <button
              type="button"
              class="header-icon-btn"
              (click)="toggleRtl()"
              aria-label="Toggle RTL Direction"
              title="Toggle Text Direction (LTR / RTL)"
            >
              <gp-icon name="globe" size="1.2em" />
            </button>

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

      <!-- Layout Body (Docs Mode with Sidebar) -->
      <div class="app-body">
        <!-- Sidebar Navigation -->
        <aside class="app-sidebar" [class.app-sidebar-open]="sidebarOpen()">
          <div class="sidebar-header-note">
            <span>gp-ui Framework v{{ version }}</span>
            <button
              type="button"
              class="sidebar-studio-btn"
              (click)="themeEditorService.open(); closeSidebarOnMobile()"
            >
              <gp-icon name="sliders" size="0.9em" />
              <span>Theme Studio</span>
            </button>
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

                      @if (item.children?.length) {
                        <ul class="nav-subitems">
                          @for (child of item.children; track child.route) {
                            <li class="nav-subitem">
                              <a
                                [routerLink]="child.route"
                                routerLinkActive="nav-link-active"
                                class="nav-link nav-link-sub"
                                (click)="closeSidebarOnMobile()"
                              >
                                <gp-icon [name]="child.icon" size="0.85em" class="nav-icon" />
                                <span class="nav-label">{{ child.name }}</span>
                              </a>
                            </li>
                          }
                        </ul>
                      }
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

      <!-- Global Theme Editor Dialog Window -->
      <app-theme-editor-dialog />

      <footer class="site-footer">
        <div class="site-footer__inner">
          <span class="site-footer__label">Powered by</span>
          <a class="site-footer__link" href="https://generatedpixel.dev/" target="_blank" rel="noopener noreferrer">
            Generated Pixel
          </a>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
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
        transition:
          background-color var(--gp-transition-duration, 150ms) ease,
          border-color var(--gp-transition-duration, 150ms) ease;
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
      .company-link {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 0.75rem;
        border-radius: 999px;
        border: 1px solid rgba(96, 165, 250, 0.5);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(168, 85, 247, 0.1));
        color: var(--gp-text-color, #ffffff);
        text-decoration: none;
        font-weight: 700;
        box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.08);
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          background-color 150ms ease;
      }
      .company-link:hover {
        transform: translateY(-1px);
        border-color: rgba(96, 165, 250, 0.8);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.14));
      }
      .company-link__label {
        font-size: 0.62rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.8;
      }
      .company-link__brand {
        font-size: 0.82rem;
        line-height: 1;
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
      .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: var(--gp-text-color, #e2e8f0);
        cursor: pointer;
        padding: 0.25rem;
      }
      @media (max-width: 900px) {
        .mobile-menu-btn {
          display: inline-flex;
        }
      }
      .header-center {
        flex: 1;
        max-width: 28rem;
        margin: 0 1rem;
      }
      @media (max-width: 600px) {
        .header-center {
          display: none;
        }
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
        transition:
          border-color 0.15s ease,
          background-color 0.15s ease;
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
      .header-theme-studio-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        border: 1px solid var(--gp-primary, #6366f1);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.15));
        color: var(--gp-text-color, #ffffff);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .header-theme-studio-btn:hover {
        background: var(--gp-primary, #6366f1);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        transform: translateY(-1px);
      }
      .theme-dropdown-studio-cta {
        padding: 0.5rem;
        border-bottom: 1px solid var(--gp-surface-border, rgba(255, 255, 255, 0.1));
      }
      .dropdown-studio-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid var(--gp-primary, #6366f1);
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.15));
        color: var(--gp-primary, #6366f1);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .dropdown-studio-btn:hover {
        background: var(--gp-primary, #6366f1);
        color: #ffffff;
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
        transition:
          background-color var(--gp-transition-duration, 150ms) ease,
          border-color var(--gp-transition-duration, 150ms) ease;
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .sidebar-studio-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        border: 1px solid var(--gp-primary, #6366f1);
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.15));
        color: var(--gp-primary, #6366f1);
        font-size: 0.72rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .sidebar-studio-btn:hover {
        background: var(--gp-primary, #6366f1);
        color: #ffffff;
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
      .nav-link-sub {
        margin-left: 0.8rem;
        padding-left: 0.8rem;
        font-size: 0.82rem;
        border-left: 1px solid var(--gp-surface-border, rgba(148, 163, 184, 0.2));
      }
      .nav-icon {
        color: inherit;
      }
      .nav-label {
        flex: 1;
      }
      .nav-subitems {
        list-style: none;
        margin: 0.25rem 0 0.5rem;
        padding: 0;
      }
      .nav-subitem {
        list-style: none;
      }
      .app-main-docs {
        flex: 1;
        padding: 2rem 2.5rem;
        max-width: 1200px;
        overflow-x: hidden;
      }
      .site-footer {
        border-top: 1px solid var(--gp-surface-border, rgba(51, 65, 85, 0.4));
        background: rgba(15, 23, 42, 0.7);
      }
      .site-footer__inner {
        width: min(100% - 3rem, 74rem);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 0 1.25rem;
        font-size: 0.8rem;
        color: var(--gp-text-color-secondary, #94a3b8);
      }
      .site-footer__label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.68rem;
      }
      .site-footer__link {
        color: var(--gp-primary, #60a5fa);
        text-decoration: none;
        font-weight: 700;
      }
      .site-footer__link:hover {
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        .app-main-docs {
          padding: 1.25rem;
        }
        .site-footer__inner {
          width: min(100% - 1.5rem, 74rem);
        }
      }
    `
  ]
})
export class AppComponent {
  protected readonly version = GP_UI_VERSION;
  public themeEditorService = inject(ThemeEditorService);
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
    { name: 'gp-css Engine', route: '/gp-css', category: 'General', icon: 'sparkles', badge: `v${GP_UI_VERSION}` },
    { name: 'Theming Playground', route: '/theming', category: 'General', icon: 'palette', badge: 'Multi-Theme' },
    { name: 'i18n & RTL', route: '/i18n', category: 'General', icon: 'globe' },
    { name: 'Button', route: '/component/button', category: 'Components', icon: 'check' },
    { name: 'Split Button', route: '/component/split-button', category: 'Components', icon: 'check' },
    { name: 'Speed Dial', route: '/component/speed-dial', category: 'Components', icon: 'check' },
    { name: 'Button Group', route: '/component/button-group', category: 'Components', icon: 'layer-group' },
    { name: 'Toggle Button', route: '/component/toggle-button', category: 'Components', icon: 'toggle-on' },
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
    { name: 'Time Picker', route: '/component/time-picker', category: 'Form Controls', icon: 'clock' },
    { name: 'File Upload', route: '/component/file-upload', category: 'Form Controls', icon: 'upload' },
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

  protected categories = computed(() => {
    const set = new Set<string>();
    this.filteredCatalogue().forEach((item) => set.add(item.category));
    return Array.from(set);
  });

  public getItemsForCategory(category: string): ComponentCatalogueItem[] {
    return this.filteredCatalogue().filter((item) => item.category === category);
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
    this.sidebarOpen.update((v) => !v);
  }

  public closeSidebarOnMobile(): void {
    this.sidebarOpen.set(false);
  }
}
