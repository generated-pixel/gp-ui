import { Component, signal, computed, inject } from '@angular/core';
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
  imports: [
    RouterModule,
    FormsModule,
    GpBadge,
    GpButton,
    GpInputText,
    GpIcon,
    GpCommandPalette,
    ThemeEditorDialog
  ],
  template: `
    <div class="app-layout">
      <!-- Top Navigation Header -->
      <header class="app-header">
        <div class="site-shell-header">
          <div class="header-left">
            <gp-button
              icon="bars"
              [iconOnly]="true"
              variant="text"
              styleClass="mobile-menu-btn"
              ariaLabel="Toggle navigation"
              (onClickEvent)="toggleSidebar()"
            />

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

            <!-- Buy Me A Coffee Donation CTA (Prominently next to Generated Pixel Logo) -->
<a href="https://www.buymeacoffee.com/generatedpixel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 36px !important;width: 130px !important;" ></a>
          </div>

          <!-- Component Search Bar -->
          <div class="header-center">
            <div class="search-input-wrap">
              <gp-icon name="search" size="0.9em" class="search-icon" />
              <gp-input-text
                styleClass="search-input"
                placeholder="Search components (e.g. table, select, dialog)..."
                [value]="searchQuery()"
                (onInputEvent)="onSearchInput($event)"
                ariaLabel="Search component catalogue"
              />
            </div>
          </div>

          <div class="header-right">
            <!-- Prominent Theme Studio Launch Button -->
            <gp-button
              label="Theme Studio"
              icon="sliders"
              styleClass="header-theme-studio-btn"
              (onClickEvent)="themeEditorService.open()"
              title="Open Interactive Theme Editor Dialog"
            />

            <!-- Theme Palette Selector Dropdown -->
            <div class="theme-switcher-container">
              <gp-button
                icon="palette"
                [iconOnly]="true"
                variant="text"
                styleClass="header-icon-btn theme-palette-btn"
                (onClickEvent)="toggleThemeMenu()"
                [attr.aria-expanded]="themeMenuOpen()"
                ariaLabel="Select Theme Preset"
                title="Theme: {{ currentThemeName() }} (Click to Change)"
              >
                <span class="theme-dot-indicator" [style.backgroundColor]="currentThemeColor()"></span>
              </gp-button>

              @if (themeMenuOpen()) {
                <div class="theme-dropdown-backdrop" (click)="closeThemeMenu()"></div>
                <div class="theme-dropdown-menu">
                  <div class="theme-dropdown-header">
                    <span>Theme Presets</span>
                    <span class="theme-mode-badge">{{ isDark() ? 'Dark Mode' : 'Light Mode' }}</span>
                  </div>
                  <div class="theme-dropdown-studio-cta">
                    <gp-button
                      label="Open Theme Editor Studio..."
                      icon="sliders"
                      variant="text"
                      styleClass="dropdown-studio-btn"
                      (onClickEvent)="themeEditorService.open(); closeThemeMenu()"
                    />
                  </div>
                  <div class="theme-list">
                    @for (t of availableThemes; track t.id) {
                      <gp-button
                        variant="text"
                        [styleClass]="'theme-option-btn' + (activeThemeId() === t.id ? ' theme-option-active' : '')"
                        [ariaLabel]="'Select ' + t.name + ' theme'"
                        (onClickEvent)="selectTheme(t.id)"
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
                      </gp-button>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Light / Dark Mode Toggle Button -->
            <gp-button
              [icon]="isDark() ? 'sun' : 'moon'"
              [iconOnly]="true"
              variant="text"
              styleClass="header-icon-btn"
              (onClickEvent)="toggleThemeMode()"
              [ariaLabel]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              [title]="isDark() ? 'Mode: Dark (Click for Light)' : 'Mode: Light (Click for Dark)'"
            />

            <!-- RTL Direction Toggle Button -->
            <gp-button
              icon="globe"
              [iconOnly]="true"
              variant="text"
              styleClass="header-icon-btn"
              (onClickEvent)="toggleRtl()"
              ariaLabel="Toggle RTL Direction"
              title="Toggle Text Direction (LTR / RTL)"
            />

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
          <div class="sidebar-help-card">
            <gp-icon name="envelope" size="0.9em" class="sidebar-help-icon" />
            <div class="sidebar-help-body">
              <span class="sidebar-help-title">Want to help?</span>
              <a class="sidebar-help-link" href="mailto:hello@generatedpixel.dev"
                >Email us at hello&#64;generatedpixel.dev</a
              >
            </div>
          </div>
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
          <div class="site-footer__powered">
            <span class="site-footer__label">Powered by</span>
            <a class="site-footer__link" href="https://generatedpixel.dev/" target="_blank" rel="noopener noreferrer">
              Generated Pixel
            </a>
          </div>
          <span class="site-footer__divider" aria-hidden="true">&bull;</span>
          <div class="site-footer__help">
            <span class="site-footer__help-prompt">Want to help?</span>
            <a class="site-footer__link" href="mailto:hello@generatedpixel.dev"
              >Email us at hello&#64;generatedpixel.dev</a
            >
          </div>
        </div>
      </footer>

      <!-- Universal Command Palette -->
      <gp-command-palette [items]="commandPaletteItems" (onSelect)="onCommandSelected($event)" />
    </div>
  `,
  styles: [
    `
      .app-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--gp-surface-ground);
        color: var(--gp-text-color);
      }
      .app-header {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(18px);
        background: var(--gp-surface-card);
        border-bottom: 1px solid var(--gp-surface-border);
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
        border: 1px solid var(--gp-primary-border, rgba(96, 165, 250, 0.5));
        background: var(--gp-primary-light, rgba(59, 130, 246, 0.15));
        color: var(--gp-text-color);
        text-decoration: none;
        font-weight: 700;
        box-shadow: var(--gp-shadow-sm);
        transition:
          transform 150ms ease,
          border-color 150ms ease,
          background-color 150ms ease;
      }
      .company-link:hover {
        transform: translateY(-1px);
        border-color: var(--gp-primary);
        background: var(--gp-primary-hover);
        color: var(--gp-primary-text, #fff);
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
        color: var(--gp-text-color);
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .brand-mark__tag {
        color: var(--gp-text-color-secondary);
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
        color: var(--gp-text-color);
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
        color: var(--gp-text-color-secondary);
      }
      .search-input {
        width: 100%;
        height: 2.25rem;
        padding: 0 0.75rem 0 2.25rem;
        border-radius: 999px;
        border: 1px solid var(--gp-input-border, var(--gp-surface-border));
        background: var(--gp-input-bg, var(--gp-surface-ground));
        color: var(--gp-input-text, var(--gp-text-color));
        font-size: 0.85rem;
        outline: none;
        transition:
          border-color 0.15s ease,
          background-color 0.15s ease;
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
        text-decoration: none;
        transition: all 0.15s ease;
        position: relative;
      }
      .header-icon-btn:hover {
        background: var(--gp-surface-hover);
        color: var(--gp-primary);
      }
      .bmc-donation-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.42rem 0.95rem;
        border-radius: 999px;
        background: linear-gradient(135deg, #FFDD00 0%, #F59E0B 100%);
        color: #000000 !important;
        font-weight: 800;
        font-size: 0.84rem;
        text-decoration: none !important;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow:
          0 2px 10px rgba(245, 158, 11, 0.4),
          0 0 0 1px rgba(255, 221, 0, 0.3);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        flex-shrink: 0;
      }
      .bmc-donation-btn:hover {
        transform: translateY(-2px) scale(1.04);
        box-shadow:
          0 6px 20px rgba(245, 158, 11, 0.65),
          0 0 0 2px rgba(255, 221, 0, 0.5);
        background: linear-gradient(135deg, #FFE54C 0%, #D97706 100%);
        color: #000000 !important;
      }
      .bmc-cup-icon {
        font-size: 1.15rem;
        line-height: 1;
        display: inline-block;
        animation: bmcWiggle 3s ease-in-out infinite;
        transform-origin: bottom center;
      }
      @keyframes bmcWiggle {
        0%, 75%, 100% { transform: rotate(0deg) scale(1); }
        80% { transform: rotate(-12deg) scale(1.15); }
        85% { transform: rotate(12deg) scale(1.15); }
        90% { transform: rotate(-6deg) scale(1.1); }
        95% { transform: rotate(6deg) scale(1.05); }
      }
      @media (max-width: 768px) {
        .bmc-btn-text {
          display: none;
        }
        .bmc-donation-btn {
          padding: 0.38rem 0.6rem;
        }
      }
      .header-theme-studio-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        border: 1px solid var(--gp-primary);
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.15));
        color: var(--gp-primary);
        font-size: 0.82rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .header-theme-studio-btn:hover {
        background: var(--gp-primary);
        color: var(--gp-primary-text, #ffffff);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
        transform: translateY(-1px);
      }
      .theme-dropdown-studio-cta {
        padding: 0.5rem;
        border-bottom: 1px solid var(--gp-surface-border);
      }
      .dropdown-studio-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        padding: 0.5rem;
        border-radius: 0.375rem;
        border: 1px solid var(--gp-primary);
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.15));
        color: var(--gp-primary);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .dropdown-studio-btn:hover {
        background: var(--gp-primary);
        color: var(--gp-primary-text, #ffffff);
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
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
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
        border-bottom: 1px solid var(--gp-surface-border);
        margin-bottom: 0.4rem;
        font-size: 0.78rem;
        font-weight: 700;
        color: var(--gp-text-color-secondary);
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
        background: var(--gp-surface-hover);
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
        border-right: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-card);
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
        color: var(--gp-primary);
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
        border: 1px solid var(--gp-primary);
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.15));
        color: var(--gp-primary);
        font-size: 0.72rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .sidebar-studio-btn:hover {
        background: var(--gp-primary);
        color: var(--gp-primary-text, #ffffff);
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
        color: var(--gp-text-color-secondary);
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
        color: var(--gp-text-color-secondary);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.15s ease;
      }
      .nav-link:hover {
        background: var(--gp-surface-hover);
        color: var(--gp-text-color);
      }
      .nav-link-active {
        background: var(--gp-primary-light, rgba(14, 165, 233, 0.18)) !important;
        color: var(--gp-primary) !important;
        font-weight: 700;
      }
      .nav-link-sub {
        margin-left: 0.8rem;
        padding-left: 0.8rem;
        font-size: 0.82rem;
        border-left: 1px solid var(--gp-surface-border);
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
        border-top: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-card);
      }
      .site-footer__inner {
        width: min(100% - 3rem, 74rem);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 1rem 0 1.25rem;
        font-size: 0.8rem;
        color: var(--gp-text-color-secondary);
      }
      .site-footer__powered,
      .site-footer__help {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .site-footer__divider {
        color: var(--gp-surface-border);
      }
      .site-footer__label {
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.68rem;
      }
      .site-footer__help-prompt {
        color: var(--gp-text-color);
        font-weight: 500;
      }
      .site-footer__link {
        color: var(--gp-primary);
        text-decoration: none;
        font-weight: 600;
      }
      .site-footer__link:hover {
        text-decoration: underline;
      }
      .sidebar-help-card {
        margin: 0 1rem 1.5rem;
        padding: 0.75rem 0.85rem;
        border-radius: var(--gp-border-radius, 8px);
        background: var(--gp-surface-section, rgba(0, 0, 0, 0.02));
        border: 1px dashed var(--gp-surface-border);
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
      }
      .sidebar-help-icon {
        color: var(--gp-primary);
        margin-top: 0.15rem;
        flex-shrink: 0;
      }
      .sidebar-help-body {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .sidebar-help-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gp-text-color);
      }
      .sidebar-help-link {
        font-size: 0.75rem;
        color: var(--gp-primary);
        text-decoration: none;
        word-break: break-all;
        font-weight: 600;
      }
      .sidebar-help-link:hover {
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
    { name: 'Markdown Editor', route: '/component/md-editor', category: 'Form Controls', icon: 'file-text', badge: 'New' },
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
