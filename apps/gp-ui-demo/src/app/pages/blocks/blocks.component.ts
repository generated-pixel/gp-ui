import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpCarouselComponent } from 'gp-ui';

// Import Layouts
import {
  GpLayoutThreeColumnFluidComponent,
  GpLayoutTwoColumnSplitComponent,
  GpLayoutThreeColumnWorkspaceComponent,
  GpLayoutFourColumnGridComponent,
  GpLayoutSidebarDarkComponent,
  GpLayoutSidebarLightComponent,
  GpLayoutSidebarMiniComponent,
  GpLayoutSidebarDualComponent,
  GpLayoutSidebarFloatingComponent,
  GpLayoutSidebarGradientComponent,
  GpLayoutSidebarHeaderOverComponent,
  GpLayoutSidebarWorkspaceComponent,
  GpLayoutSidebarSearchTreeComponent,
  GpLayoutSidebarPinnedStatusComponent,
  GpLayoutSidebarOffcanvasComponent,
  GpLayoutSidebarMinimalComponent,
  GpLayoutSidebarStepperComponent,
  GpLayoutSidebarAccordionComponent,
  GpLayoutStackedClassicComponent,
  GpLayoutStackedSubnavTabsComponent,
  GpLayoutStackedHeroBannerComponent,
  GpLayoutStackedFloatingCardComponent,
  GpLayoutStackedStickyActionBarComponent,
  GpLayoutStackedBottomDockComponent
} from 'gp-blocks';

// Import Dashboards
import {
  GpDashboardSaasOverviewComponent,
  GpDashboardEcommerceComponent,
  GpDashboardAnalyticsComponent,
  GpDashboardFinanceComponent,
  GpDashboardProjectManagementComponent,
  GpDashboardOperationsComponent
} from 'gp-blocks';

// Import Settings & Details
import {
  GpSettingsProfileComponent,
  GpSettingsSecurityComponent,
  GpSettingsBillingComponent,
  GpSettingsNotificationsComponent,
  GpSettingsTeamRolesComponent,
  GpSettingsApiKeysComponent,
  GpSettingsDangerZoneComponent,
  GpDetailsCustomerOverviewComponent,
  GpDetailsOrderSummaryComponent
} from 'gp-blocks';

// Import Headings
import {
  GpHeaderPageWithActionsComponent,
  GpHeaderSearchFiltersComponent,
  GpHeaderSectionTabsComponent,
  GpHeaderWithStatsComponent,
  GpHeaderCompactBreadcrumbComponent,
  GpHeaderProfileBannerComponent
} from 'gp-blocks';

// Import Data Displays
import {
  GpDataDisplayKpiCardsComponent,
  GpDataDisplayDescriptionListComponent,
  GpDataDisplayTimelineStreamComponent,
  GpDataDisplayMeterMetricsComponent,
  GpDataDisplayBadgeClustersComponent,
  GpDataDisplayStatsCounterComponent
} from 'gp-blocks';

// Import Lists
import {
  GpListDataGridComponent,
  GpListStackedFeedComponent,
  GpListCardGridComponent,
  GpListTransactionsComponent,
  GpListUserDirectoryComponent,
  GpListFileListDownloadComponent
} from 'gp-blocks';

// Import Forms
import {
  GpFormMultiStepWizardComponent,
  GpFormAuthSplitComponent,
  GpFormUserProfileComponent,
  GpFormCheckoutPaymentComponent,
  GpFormContactFeedbackComponent,
  GpFormAdvancedFilterBuilderComponent
} from 'gp-blocks';

// Import Feedbacks
import {
  GpFeedbackAlertBannersComponent,
  GpFeedbackEmptyStatesComponent,
  GpFeedbackConfirmModalsComponent,
  GpFeedbackToastStatusComponent,
  GpFeedbackRatingReviewComponent
} from 'gp-blocks';

// Import Navigations & Overlays
import {
  GpNavResponsiveTopBarComponent,
  GpOverlayCommandPaletteComponent,
  GpOverlaySlideOverPanelComponent,
  GpNavDropdownActionMenuComponent,
  GpNavMegaMenuBlockComponent,
  GpNavTabNavigationComponent
} from 'gp-blocks';

// Import Pages
import {
  GpPage404Component,
  GpPage500Component,
  GpPage403Component,
  GpPageMaintenanceComponent,
  GpPageComingSoonComponent,
  GpPageSuccessConfirmationComponent
} from 'gp-blocks';

export interface BlockItem {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-blocks-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GpBadgeComponent,
    GpButtonComponent,
    GpIconComponent,
    GpCarouselComponent,
    // Layouts
    GpLayoutThreeColumnFluidComponent,
    GpLayoutTwoColumnSplitComponent,
    GpLayoutThreeColumnWorkspaceComponent,
    GpLayoutFourColumnGridComponent,
    GpLayoutSidebarDarkComponent,
    GpLayoutSidebarLightComponent,
    GpLayoutSidebarMiniComponent,
    GpLayoutSidebarDualComponent,
    GpLayoutSidebarFloatingComponent,
    GpLayoutSidebarGradientComponent,
    GpLayoutSidebarHeaderOverComponent,
    GpLayoutSidebarWorkspaceComponent,
    GpLayoutSidebarSearchTreeComponent,
    GpLayoutSidebarPinnedStatusComponent,
    GpLayoutSidebarOffcanvasComponent,
    GpLayoutSidebarMinimalComponent,
    GpLayoutSidebarStepperComponent,
    GpLayoutSidebarAccordionComponent,
    GpLayoutStackedClassicComponent,
    GpLayoutStackedSubnavTabsComponent,
    GpLayoutStackedHeroBannerComponent,
    GpLayoutStackedFloatingCardComponent,
    GpLayoutStackedStickyActionBarComponent,
    GpLayoutStackedBottomDockComponent,
    // Dashboards
    GpDashboardSaasOverviewComponent,
    GpDashboardEcommerceComponent,
    GpDashboardAnalyticsComponent,
    GpDashboardFinanceComponent,
    GpDashboardProjectManagementComponent,
    GpDashboardOperationsComponent,
    // Settings & Details
    GpSettingsProfileComponent,
    GpSettingsSecurityComponent,
    GpSettingsBillingComponent,
    GpSettingsNotificationsComponent,
    GpSettingsTeamRolesComponent,
    GpSettingsApiKeysComponent,
    GpSettingsDangerZoneComponent,
    GpDetailsCustomerOverviewComponent,
    GpDetailsOrderSummaryComponent,
    // Headings
    GpHeaderPageWithActionsComponent,
    GpHeaderSearchFiltersComponent,
    GpHeaderSectionTabsComponent,
    GpHeaderWithStatsComponent,
    GpHeaderCompactBreadcrumbComponent,
    GpHeaderProfileBannerComponent,
    // Data Displays
    GpDataDisplayKpiCardsComponent,
    GpDataDisplayDescriptionListComponent,
    GpDataDisplayTimelineStreamComponent,
    GpDataDisplayMeterMetricsComponent,
    GpDataDisplayBadgeClustersComponent,
    GpDataDisplayStatsCounterComponent,
    // Lists
    GpListDataGridComponent,
    GpListStackedFeedComponent,
    GpListCardGridComponent,
    GpListTransactionsComponent,
    GpListUserDirectoryComponent,
    GpListFileListDownloadComponent,
    // Forms
    GpFormMultiStepWizardComponent,
    GpFormAuthSplitComponent,
    GpFormUserProfileComponent,
    GpFormCheckoutPaymentComponent,
    GpFormContactFeedbackComponent,
    GpFormAdvancedFilterBuilderComponent,
    // Feedbacks
    GpFeedbackAlertBannersComponent,
    GpFeedbackEmptyStatesComponent,
    GpFeedbackConfirmModalsComponent,
    GpFeedbackToastStatusComponent,
    GpFeedbackRatingReviewComponent,
    // Navigations & Overlays
    GpNavResponsiveTopBarComponent,
    GpOverlayCommandPaletteComponent,
    GpOverlaySlideOverPanelComponent,
    GpNavDropdownActionMenuComponent,
    GpNavMegaMenuBlockComponent,
    GpNavTabNavigationComponent,
    // Pages
    GpPage404Component,
    GpPage500Component,
    GpPage403Component,
    GpPageMaintenanceComponent,
    GpPageComingSoonComponent,
    GpPageSuccessConfirmationComponent
  ],
  template: `
    <div class="blocks-page-root">
      <!-- Hero Header -->
      <div class="blocks-hero">
        <div class="hero-content">
          <div class="badge-row">
            <gp-badge value="60+ Ready-to-use Blocks" severity="primary" />
            <gp-badge value="PrimeBlocks Equivalent" severity="success" />
            <gp-badge value="Zero-Config" severity="secondary" />
          </div>
          <h1 class="hero-title">Application Blocks & Enterprise UI Shells</h1>
          <p class="hero-subtitle">
            A comprehensive, modular collection of responsive application layouts, analytics dashboards,
            settings screens, form wizards, and data displays built natively with <code>gp-ui</code>, <code>gp-theme</code>, and <code>gp-css</code>.
          </p>
          <div class="hero-actions">
            <a routerLink="/blocks-playground" class="btn-playground">
              <gp-icon name="sparkles" size="1em" />
              <span>Interactive JSON Schema Playground</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Categories Navigation Bar powered by gp-carousel -->
      <div class="blocks-toolbar">
        <div class="categories-carousel-wrapper">
          <gp-carousel
            [value]="categoryGroups()"
            [circular]="false"
            [showIndicators]="false"
            class="categories-carousel"
          >
            <ng-template #item let-group>
              <div class="cat-group-row">
                <button
                  type="button"
                  *ngFor="let cat of group"
                  class="cat-chip"
                  [class.active]="selectedCategory() === cat.id"
                  (click)="selectedCategory.set(cat.id)"
                >
                  <span>{{ cat.name }}</span>
                  <span class="cat-count">{{ cat.count }}</span>
                </button>
              </div>
            </ng-template>
          </gp-carousel>
        </div>

        <div class="search-wrap">
          <gp-icon name="search" size="0.85em" class="s-ico" />
          <input
            type="text"
            class="s-input"
            placeholder="Search blocks..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
          />
        </div>
      </div>

      <!-- Blocks Grid Showcase -->
      <div class="blocks-container">
        <div *ngFor="let block of filteredBlocks()" class="block-preview-card">
          <!-- Block Card Header -->
          <div class="block-card-head">
            <div class="head-left">
              <span class="block-cat-badge">{{ block.category }}</span>
              <h3 class="block-name">{{ block.name }}</h3>
              <p class="block-desc">{{ block.description }}</p>
            </div>

            <div class="head-controls">
              <!-- Viewport Switcher -->
              <div class="viewport-toggle">
                <button
                  type="button"
                  class="v-btn"
                  [class.active]="viewports[block.id] === 'desktop' || !viewports[block.id]"
                  (click)="setViewport(block.id, 'desktop')"
                  title="Desktop View (100%)"
                >
                  <gp-icon name="window" size="0.85em" />
                </button>
                <button
                  type="button"
                  class="v-btn"
                  [class.active]="viewports[block.id] === 'tablet'"
                  (click)="setViewport(block.id, 'tablet')"
                  title="Tablet View (768px)"
                >
                  <gp-icon name="sliders" size="0.85em" />
                </button>
                <button
                  type="button"
                  class="v-btn"
                  [class.active]="viewports[block.id] === 'mobile'"
                  (click)="setViewport(block.id, 'mobile')"
                  title="Mobile View (375px)"
                >
                  <gp-icon name="bars" size="0.85em" />
                </button>
              </div>

              <!-- Preview / Code Mode Toggle -->
              <div class="mode-toggle">
                <button
                  type="button"
                  class="mode-btn"
                  [class.active]="modeState[block.id] !== 'code'"
                  (click)="setMode(block.id, 'preview')"
                >
                  Preview
                </button>
                <button
                  type="button"
                  class="mode-btn"
                  [class.active]="modeState[block.id] === 'code'"
                  (click)="setMode(block.id, 'code')"
                >
                  Code
                </button>
              </div>

              <button
                type="button"
                class="btn-copy"
                (click)="copyCode(block.code, block.id)"
                title="Copy Angular snippet"
              >
                <gp-icon [name]="copiedState[block.id] ? 'check' : 'copy'" size="0.9em" />
                <span>{{ copiedState[block.id] ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <!-- Block Live Preview Frame -->
          <div
            *ngIf="modeState[block.id] !== 'code'"
            class="block-preview-viewport"
            [class.vp-tablet]="viewports[block.id] === 'tablet'"
            [class.vp-mobile]="viewports[block.id] === 'mobile'"
          >
            <!-- 1. Multi-Column Layouts -->
            <gp-layout-three-column-fluid *ngIf="block.id === 'three-col-fluid'" />
            <gp-layout-two-column-split *ngIf="block.id === 'two-col-split'" />
            <gp-layout-three-column-workspace *ngIf="block.id === 'three-col-workspace'" />
            <gp-layout-four-column-grid *ngIf="block.id === 'four-col-grid'" />

            <!-- 2. Sidebar Layouts -->
            <gp-layout-sidebar-dark *ngIf="block.id === 'sb-dark'" />
            <gp-layout-sidebar-light *ngIf="block.id === 'sb-light'" />
            <gp-layout-sidebar-mini *ngIf="block.id === 'sb-mini'" />
            <gp-layout-sidebar-dual *ngIf="block.id === 'sb-dual'" />
            <gp-layout-sidebar-floating *ngIf="block.id === 'sb-floating'" />
            <gp-layout-sidebar-gradient *ngIf="block.id === 'sb-gradient'" />
            <gp-layout-sidebar-header-over *ngIf="block.id === 'sb-header-over'" />
            <gp-layout-sidebar-workspace *ngIf="block.id === 'sb-workspace'" />
            <gp-layout-sidebar-search-tree *ngIf="block.id === 'sb-search-tree'" />
            <gp-layout-sidebar-pinned-status *ngIf="block.id === 'sb-pinned-status'" />
            <gp-layout-sidebar-offcanvas *ngIf="block.id === 'sb-offcanvas'" />
            <gp-layout-sidebar-minimal *ngIf="block.id === 'sb-minimal'" />
            <gp-layout-sidebar-stepper *ngIf="block.id === 'sb-stepper'" />
            <gp-layout-sidebar-accordion *ngIf="block.id === 'sb-accordion'" />

            <!-- 3. Stacked Layouts -->
            <gp-layout-stacked-classic *ngIf="block.id === 'st-classic'" />
            <gp-layout-stacked-subnav-tabs *ngIf="block.id === 'st-subnav-tabs'" />
            <gp-layout-stacked-hero-banner *ngIf="block.id === 'st-hero-banner'" />
            <gp-layout-stacked-floating-card *ngIf="block.id === 'st-floating-card'" />
            <gp-layout-stacked-sticky-action-bar *ngIf="block.id === 'st-sticky-bar'" />
            <gp-layout-stacked-bottom-dock *ngIf="block.id === 'st-bottom-dock'" />

            <!-- 4. Dashboards -->
            <gp-dashboard-saas-overview *ngIf="block.id === 'dash-saas'" />
            <gp-dashboard-ecommerce *ngIf="block.id === 'dash-ecom'" />
            <gp-dashboard-analytics *ngIf="block.id === 'dash-analytics'" />
            <gp-dashboard-finance *ngIf="block.id === 'dash-finance'" />
            <gp-dashboard-project-management *ngIf="block.id === 'dash-pm'" />
            <gp-dashboard-operations *ngIf="block.id === 'dash-ops'" />

            <!-- 5. Settings & Details -->
            <gp-settings-profile *ngIf="block.id === 'set-profile'" />
            <gp-settings-security *ngIf="block.id === 'set-security'" />
            <gp-settings-billing *ngIf="block.id === 'set-billing'" />
            <gp-settings-notifications *ngIf="block.id === 'set-notifications'" />
            <gp-settings-team-roles *ngIf="block.id === 'set-team-roles'" />
            <gp-settings-api-keys *ngIf="block.id === 'set-api-keys'" />
            <gp-settings-danger-zone *ngIf="block.id === 'set-danger-zone'" />
            <gp-details-customer-overview *ngIf="block.id === 'det-customer'" />
            <gp-details-order-summary *ngIf="block.id === 'det-order'" />

            <!-- 6. Headings -->
            <gp-header-page-with-actions *ngIf="block.id === 'hdr-actions'" />
            <gp-header-search-filters *ngIf="block.id === 'hdr-filters'" />
            <gp-header-section-tabs *ngIf="block.id === 'hdr-tabs'" />
            <gp-header-with-stats *ngIf="block.id === 'hdr-stats'" />
            <gp-header-compact-breadcrumb *ngIf="block.id === 'hdr-breadcrumb'" />
            <gp-header-profile-banner *ngIf="block.id === 'hdr-profile-banner'" />

            <!-- 7. Data Displays -->
            <gp-data-display-kpi-cards *ngIf="block.id === 'dd-kpi'" />
            <gp-data-display-description-list *ngIf="block.id === 'dd-desc-list'" />
            <gp-data-display-timeline-stream *ngIf="block.id === 'dd-timeline'" />
            <gp-data-display-meter-metrics *ngIf="block.id === 'dd-meter'" />
            <gp-data-display-badge-clusters *ngIf="block.id === 'dd-badges'" />
            <gp-data-display-stats-counter *ngIf="block.id === 'dd-counter'" />

            <!-- 8. Lists -->
            <gp-list-data-grid *ngIf="block.id === 'list-grid'" />
            <gp-list-stacked-feed *ngIf="block.id === 'list-feed'" />
            <gp-list-card-grid *ngIf="block.id === 'list-cards'" />
            <gp-list-transactions *ngIf="block.id === 'list-tx'" />
            <gp-list-user-directory *ngIf="block.id === 'list-users'" />
            <gp-list-file-list-download *ngIf="block.id === 'list-files'" />

            <!-- 9. Forms -->
            <gp-form-multi-step-wizard *ngIf="block.id === 'form-wizard'" />
            <gp-form-auth-split *ngIf="block.id === 'form-auth'" />
            <gp-form-user-profile *ngIf="block.id === 'form-profile'" />
            <gp-form-checkout-payment *ngIf="block.id === 'form-checkout'" />
            <gp-form-contact-feedback *ngIf="block.id === 'form-contact'" />
            <gp-form-advanced-filter-builder *ngIf="block.id === 'form-filter'" />

            <!-- 10. Feedbacks -->
            <gp-feedback-alert-banners *ngIf="block.id === 'fb-alerts'" />
            <gp-feedback-empty-states *ngIf="block.id === 'fb-empty'" />
            <gp-feedback-confirm-modals *ngIf="block.id === 'fb-confirm'" />
            <gp-feedback-toast-status *ngIf="block.id === 'fb-toast'" />
            <gp-feedback-rating-review *ngIf="block.id === 'fb-rating'" />

            <!-- 11. Navigations & Overlays -->
            <gp-nav-responsive-top-bar *ngIf="block.id === 'nav-topbar'" />
            <gp-overlay-command-palette *ngIf="block.id === 'nav-palette'" />
            <gp-overlay-slide-over-panel *ngIf="block.id === 'nav-slide-over'" />
            <gp-nav-dropdown-action-menu *ngIf="block.id === 'nav-dropdown'" />
            <gp-nav-mega-menu-block *ngIf="block.id === 'nav-mega'" />
            <gp-nav-tab-navigation *ngIf="block.id === 'nav-tabs'" />

            <!-- 12. Pages -->
            <gp-page-404 *ngIf="block.id === 'page-404'" />
            <gp-page-500 *ngIf="block.id === 'page-500'" />
            <gp-page-403 *ngIf="block.id === 'page-403'" />
            <gp-page-maintenance *ngIf="block.id === 'page-maint'" />
            <gp-page-coming-soon *ngIf="block.id === 'page-coming'" />
            <gp-page-success-confirmation *ngIf="block.id === 'page-success'" />
          </div>

          <!-- Block Code View -->
          <div *ngIf="modeState[block.id] === 'code'" class="block-code-view">
            <pre><code>{{ block.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .blocks-page-root {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding-bottom: 4rem;
      }

      .blocks-hero {
        background: linear-gradient(135deg, var(--gp-surface-section) 0%, var(--gp-surface-card) 100%);
        border: 1px solid var(--gp-surface-border);
        border-radius: 16px;
        padding: 3rem 2rem;
        position: relative;
        overflow: hidden;
      }

      .hero-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 800px;
      }

      .badge-row {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .hero-title {
        font-size: 2.25rem;
        font-weight: 900;
        letter-spacing: -0.03em;
        margin: 0;
        color: var(--gp-text-color);
        line-height: 1.2;
      }

      .hero-subtitle {
        font-size: 1.05rem;
        color: var(--gp-text-color-secondary);
        margin: 0;
        line-height: 1.6;
      }

      .hero-actions {
        margin-top: 0.5rem;
      }

      .btn-playground {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--gp-primary);
        color: var(--gp-primary-text);
        font-weight: 700;
        font-size: 0.9rem;
        padding: 0.65rem 1.25rem;
        border-radius: 8px;
        text-decoration: none;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
        transition: transform 0.15s ease;
      }

      .btn-playground:hover { transform: translateY(-2px); }

      .blocks-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
        position: sticky;
        top: 4rem;
        z-index: 20;
        background: var(--gp-surface-card);
        padding: 0.75rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--gp-surface-border);
        backdrop-filter: blur(16px);
      }

      .categories-carousel-wrapper {
        flex: 1;
        min-width: 0;
        max-width: calc(100% - 250px);
      }

      .categories-carousel {
        width: 100%;
      }

      :host ::ng-deep .categories-carousel .gp-carousel-content {
        gap: 0.25rem;
      }

      :host ::ng-deep .categories-carousel .gp-carousel-nav-btn {
        width: 2rem;
        height: 2rem;
        background: var(--gp-surface-section);
        border: 1px solid var(--gp-surface-border);
        color: var(--gp-text-color-secondary);
        font-size: 0.75rem;
      }

      :host ::ng-deep .categories-carousel .gp-carousel-nav-btn:hover:not(:disabled) {
        background: var(--gp-primary);
        color: var(--gp-primary-text);
      }

      :host ::ng-deep .categories-carousel .gp-carousel-item {
        padding: 0 0.25rem;
      }

      .cat-group-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
      }

      .cat-chip {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.35rem 0.75rem;
        border-radius: 9999px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
        color: var(--gp-text-color-secondary);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }

      .cat-chip:hover {
        background: var(--gp-surface-hover);
        color: var(--gp-text-color);
      }

      .cat-chip.active {
        background: var(--gp-primary);
        border-color: var(--gp-primary);
        color: var(--gp-primary-text);
      }

      .cat-count {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.1rem 0.4rem;
        border-radius: 9999px;
        font-size: 0.7rem;
      }

      .search-wrap {
        position: relative;
        width: 220px;
        display: flex;
        align-items: center;
      }

      .s-ico {
        position: absolute;
        left: 0.75rem;
        color: var(--gp-text-color-muted);
      }

      .s-input {
        width: 100%;
        padding: 0.45rem 0.75rem 0.45rem 2.2rem;
        border-radius: 8px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
        color: var(--gp-text-color);
        font-size: 0.85rem;
        outline: none;
      }

      .blocks-container {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .block-preview-card {
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .block-card-head {
        padding: 1.25rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--gp-surface-border);
        flex-wrap: wrap;
        gap: 1rem;
      }

      .head-left {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }

      .block-cat-badge {
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        color: var(--gp-primary);
        letter-spacing: 0.05em;
      }

      .block-name {
        font-size: 1.25rem;
        font-weight: 800;
        margin: 0;
        color: var(--gp-text-color);
      }

      .block-desc {
        font-size: 0.825rem;
        color: var(--gp-text-color-secondary);
        margin: 0;
      }

      .head-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .viewport-toggle {
        display: flex;
        border: 1px solid var(--gp-surface-border);
        border-radius: 6px;
        overflow: hidden;
      }

      .v-btn {
        background: transparent;
        border: none;
        color: var(--gp-text-color-secondary);
        padding: 0.4rem 0.6rem;
        cursor: pointer;
      }

      .v-btn.active {
        background: var(--gp-surface-hover);
        color: var(--gp-text-color);
      }

      .mode-toggle {
        display: flex;
        background: var(--gp-surface-section);
        border: 1px solid var(--gp-surface-border);
        border-radius: 6px;
        padding: 2px;
      }

      .mode-btn {
        background: transparent;
        border: none;
        color: var(--gp-text-color-secondary);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.65rem;
        border-radius: 4px;
        cursor: pointer;
      }

      .mode-btn.active {
        background: var(--gp-primary);
        color: var(--gp-primary-text);
      }

      .btn-copy {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
        color: var(--gp-text-color);
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
      }

      .btn-copy:hover { background: var(--gp-surface-hover); }

      .block-preview-viewport {
        padding: 2rem;
        background: var(--gp-surface-ground);
        display: flex;
        justify-content: center;
        transition: max-width 0.2s ease;
        margin: 0 auto;
        width: 100%;
      }

      .block-preview-viewport.vp-tablet {
        max-width: 768px;
        box-shadow: 0 0 0 1px var(--gp-surface-border);
        border-radius: 8px;
        margin: 1.5rem auto;
      }

      .block-preview-viewport.vp-mobile {
        max-width: 375px;
        box-shadow: 0 0 0 1px var(--gp-surface-border);
        border-radius: 8px;
        margin: 1.5rem auto;
      }

      .block-code-view {
        background: var(--gp-surface-ground);
        padding: 1.5rem;
        overflow-x: auto;
        border-top: 1px solid var(--gp-surface-border);
      }

      .block-code-view pre {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.85rem;
        color: var(--gp-text-color);
      }

      @media (max-width: 900px) {
        .categories-carousel-wrapper {
          max-width: 100%;
        }
      }
    `
  ]
})
export class BlocksPageComponent {
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');

  viewports: Record<string, string> = {};
  modeState: Record<string, string> = {};
  copiedState: Record<string, boolean> = {};

  categories = [
    { id: 'all', name: 'All Blocks', count: 68 },
    { id: 'multi-col', name: 'Multi-Column', count: 4 },
    { id: 'sidebar', name: 'Sidebar Layouts', count: 14 },
    { id: 'stacked', name: 'Stacked Layouts', count: 6 },
    { id: 'dashboards', name: 'Dashboards', count: 6 },
    { id: 'settings', name: 'Settings & Details', count: 9 },
    { id: 'headings', name: 'Headings', count: 6 },
    { id: 'data-displays', name: 'Data Displays', count: 6 },
    { id: 'lists', name: 'Lists', count: 6 },
    { id: 'forms', name: 'Forms', count: 6 },
    { id: 'feedbacks', name: 'Feedbacks', count: 5 },
    { id: 'nav-overlays', name: 'Nav & Overlays', count: 6 },
    { id: 'pages', name: 'Basic Pages', count: 6 }
  ];

  categoryGroups = computed(() => {
    const chunkSize = 4;
    const groups: Array<typeof this.categories> = [];
    for (let i = 0; i < this.categories.length; i += chunkSize) {
      groups.push(this.categories.slice(i, i + chunkSize));
    }
    return groups;
  });

  allBlocks: BlockItem[] = [
    // 1. Multi-Column Layouts
    { id: 'three-col-fluid', name: 'Three-Column Fluid Shell', category: 'Multi-Column', description: 'Fluid responsive layout with collapsible tree sidebar, workspace feed, and contextual right details panel.', code: '<gp-layout-three-column-fluid />' },
    { id: 'two-col-split', name: 'Two-Column Split Shell', category: 'Multi-Column', description: '50/50 dual pane layout ideal for split-screen authoring, master-detail and comparison.', code: '<gp-layout-two-column-split />' },
    { id: 'three-col-workspace', name: 'Three-Column Workspace', category: 'Multi-Column', description: 'Slack-style channel/team navigation, primary feed, and contextual metadata column.', code: '<gp-layout-three-column-workspace />' },
    { id: 'four-col-grid', name: 'Four-Column Dashboard Grid', category: 'Multi-Column', description: 'Modular 4-column application container with KPI cards and responsive column stacking.', code: '<gp-layout-four-column-grid />' },

    // 2. Sidebar Layouts (14)
    { id: 'sb-dark', name: 'Dark Sidebar Shell', category: 'Sidebar Layouts', description: 'High contrast dark navigation sidebar with top header search and notifications.', code: '<gp-layout-sidebar-dark />' },
    { id: 'sb-light', name: 'Light Clean Sidebar', category: 'Sidebar Layouts', description: 'Modern minimalist white sidebar with subtle gray active link highlights.', code: '<gp-layout-sidebar-light />' },
    { id: 'sb-mini', name: 'Icon-Only Mini Sidebar', category: 'Sidebar Layouts', description: 'Compact icon-only navigation rail designed for maximum content viewport area.', code: '<gp-layout-sidebar-mini />' },
    { id: 'sb-dual', name: 'Dual Sidebar Multi-Tier', category: 'Sidebar Layouts', description: 'Two-tier navigation: Primary icon rail coupled with a secondary submenu panel.', code: '<gp-layout-sidebar-dual />' },
    { id: 'sb-floating', name: 'Floating Card Sidebar', category: 'Sidebar Layouts', description: 'Elevated floating navigation container with rounded edges and card drop shadows.', code: '<gp-layout-sidebar-floating />' },
    { id: 'sb-gradient', name: 'Gradient Accent Sidebar', category: 'Sidebar Layouts', description: 'Vibrant indigo-to-cyan gradient background with glowing active badges.', code: '<gp-layout-sidebar-gradient />' },
    { id: 'sb-header-over', name: 'Header Spanning Sidebar', category: 'Sidebar Layouts', description: 'Full-width topbar header extending across the entire browser viewport width.', code: '<gp-layout-sidebar-header-over />' },
    { id: 'sb-workspace', name: 'Workspace Channel Sidebar', category: 'Sidebar Layouts', description: 'Workspace-centric navigation with collapsible project channels and direct messages.', code: '<gp-layout-sidebar-workspace />' },
    { id: 'sb-search-tree', name: 'Search & Hierarchy Tree Sidebar', category: 'Sidebar Layouts', description: 'Search-enabled nested folder tree navigation with expand/collapse nodes.', code: '<gp-layout-sidebar-search-tree />' },
    { id: 'sb-pinned-status', name: 'Pinned Status Sidebar', category: 'Sidebar Layouts', description: 'Sidebar featuring persistent cluster health status and active worker pill widgets.', code: '<gp-layout-sidebar-pinned-status />' },
    { id: 'sb-offcanvas', name: 'Slide-Over Offcanvas Sidebar', category: 'Sidebar Layouts', description: 'Off-canvas drawer navigation optimized for compact desktop and mobile devices.', code: '<gp-layout-sidebar-offcanvas />' },
    { id: 'sb-minimal', name: 'Border-Separated Minimal Sidebar', category: 'Sidebar Layouts', description: 'Borderline minimalist sidebar focusing purely on typography and whitespace.', code: '<gp-layout-sidebar-minimal />' },
    { id: 'sb-stepper', name: 'Wizard Stepper Sidebar', category: 'Sidebar Layouts', description: 'Step-by-step progress tracking sidebar with active and completed milestone markers.', code: '<gp-layout-sidebar-stepper />' },
    { id: 'sb-accordion', name: 'Accordion Grouped Sidebar', category: 'Sidebar Layouts', description: 'Categorized accordion groups allowing multiple menu sections to expand simultaneously.', code: '<gp-layout-sidebar-accordion />' },

    // 3. Stacked Layouts (6)
    { id: 'st-classic', name: 'Stacked Classic Shell', category: 'Stacked Layouts', description: 'Full-width top navigation bar with centralized container content area.', code: '<gp-layout-stacked-classic />' },
    { id: 'st-subnav-tabs', name: 'Stacked with Subnav Tabs', category: 'Stacked Layouts', description: 'Two-tier topbar header with secondary horizontal navigation pill tabs.', code: '<gp-layout-stacked-subnav-tabs />' },
    { id: 'st-hero-banner', name: 'Stacked with Hero Header', category: 'Stacked Layouts', description: 'Deep indigo hero banner header with title, subtitle, and overlapping cards.', code: '<gp-layout-stacked-hero-banner />' },
    { id: 'st-floating-card', name: 'Floating Card Stacked Shell', category: 'Stacked Layouts', description: 'Elevated floating header card separated from the viewport edge.', code: '<gp-layout-stacked-floating-card />' },
    { id: 'st-sticky-bar', name: 'Sticky Action Bar Stacked', category: 'Stacked Layouts', description: 'Fixed topbar paired with a sticky bottom action bar for transactional tasks.', code: '<gp-layout-stacked-sticky-action-bar />' },
    { id: 'st-bottom-dock', name: 'Bottom Dock App Shell', category: 'Stacked Layouts', description: 'macOS-style floating bottom dock toolbar with interactive icon items.', code: '<gp-layout-stacked-bottom-dock />' },

    // 4. Dashboards (6)
    { id: 'dash-saas', name: 'SaaS Business Overview Dashboard', category: 'Dashboards', description: 'MRR metrics, active user growth, and recent billing customer transaction table.', code: '<gp-dashboard-saas-overview />' },
    { id: 'dash-ecom', name: 'Ecommerce Sales & Order Hub', category: 'Dashboards', description: 'Order volume, average basket value, recent transactions, and top category breakdown.', code: '<gp-dashboard-ecommerce />' },
    { id: 'dash-analytics', name: 'Traffic & Web Telemetry Analytics', category: 'Dashboards', description: 'Real-time active visitors, bounce rate, global geography traffic, and page latency.', code: '<gp-dashboard-analytics />' },
    { id: 'dash-finance', name: 'Corporate Financial & Cash Flow', category: 'Dashboards', description: 'Working capital, quarterly runway, enterprise burn rate, and investment accounts.', code: '<gp-dashboard-finance />' },
    { id: 'dash-pm', name: 'Agile Project Management Sprint Board', category: 'Dashboards', description: 'Sprint velocity, burndown progress, milestone progress bars, and team tasks.', code: '<gp-dashboard-project-management />' },
    { id: 'dash-ops', name: 'Cloud Infrastructure & SRE Operations', category: 'Dashboards', description: 'Kubernetes cluster health, edge node CPU/RAM quotas, and region latency metrics.', code: '<gp-dashboard-operations />' },

    // 5. Settings & Details (9)
    { id: 'set-profile', name: 'User Profile & Bio Settings', category: 'Settings & Details', description: 'Avatar upload, personal details, contact information, and public profile bio.', code: '<gp-settings-profile />' },
    { id: 'set-security', name: 'Security & 2FA Configuration', category: 'Settings & Details', description: 'Password reset inputs, TOTP authenticator switches, and active device sessions.', code: '<gp-settings-security />' },
    { id: 'set-billing', name: 'Billing & Invoices Management', category: 'Settings & Details', description: 'Active plan tier, payment credit cards on file, and downloadable PDF receipts.', code: '<gp-settings-billing />' },
    { id: 'set-notifications', name: 'Notification Preferences Matrix', category: 'Settings & Details', description: 'Granular toggle switches for email digests, SMS alerts, and marketing broadcasts.', code: '<gp-settings-notifications />' },
    { id: 'set-team-roles', name: 'Team Member Roles & Permissions', category: 'Settings & Details', description: 'Invite collaborators, assign RBAC access roles (Owner, Admin, Member, Viewer).', code: '<gp-settings-team-roles />' },
    { id: 'set-api-keys', name: 'API Keys & Webhooks Management', category: 'Settings & Details', description: 'Scoped production and staging API tokens with 1-click secret clipboard copy.', code: '<gp-settings-api-keys />' },
    { id: 'set-danger-zone', name: 'Account & Resource Danger Zone', category: 'Settings & Details', description: 'Destructive action panel for transferring ownership and permanent data deletion.', code: '<gp-settings-danger-zone />' },
    { id: 'det-customer', name: 'Customer 360 Overview Screen', category: 'Settings & Details', description: 'Complete customer dossier with Lifetime Value, account age, and active licenses.', code: '<gp-details-customer-overview />' },
    { id: 'det-order', name: 'Order Summary & Tracking Dossier', category: 'Settings & Details', description: 'Itemized product receipts, shipping milestones, tracking ID, and tax breakdown.', code: '<gp-details-order-summary />' },

    // 6. Headings (6)
    { id: 'hdr-actions', name: 'Page Header with Actions', category: 'Headings', description: 'Page title, description, and primary/secondary button toolbar.', code: '<gp-header-page-with-actions />' },
    { id: 'hdr-filters', name: 'Header with Search & Filter Bar', category: 'Headings', description: 'Integrated keyword search and dropdown filter inputs in the header.', code: '<gp-header-search-filters />' },
    { id: 'hdr-tabs', name: 'Header with Section Tabs', category: 'Headings', description: 'Header bar with underline tab navigation and counter badges.', code: '<gp-header-section-tabs />' },
    { id: 'hdr-stats', name: 'Header with Metric Stats Pills', category: 'Headings', description: 'Page header with embedded KPI highlight pill widgets.', code: '<gp-header-with-stats />' },
    { id: 'hdr-breadcrumb', name: 'Compact Breadcrumb Header', category: 'Headings', description: 'Streamlined single-line breadcrumb header with back navigation button.', code: '<gp-header-compact-breadcrumb />' },
    { id: 'hdr-profile-banner', name: 'Profile Banner Cover Header', category: 'Headings', description: 'Gradient banner cover image with overlapping avatar and author bio details.', code: '<gp-header-profile-banner />' },

    // 7. Data Displays (6)
    { id: 'dd-kpi', name: 'KPI Metric Stat Cards', category: 'Data Displays', description: '4-card metric grid with percentage growth badges, icons, and trends.', code: '<gp-data-display-kpi-cards />' },
    { id: 'dd-desc-list', name: 'Technical Description List', category: 'Data Displays', description: '2-column structured key-value specification grid with badges.', code: '<gp-data-display-description-list />' },
    { id: 'dd-timeline', name: 'Activity Stream Timeline', category: 'Data Displays', description: 'Vertical chronological audit log with icons, timestamps, and avatars.', code: '<gp-data-display-timeline-stream />' },
    { id: 'dd-meter', name: 'Quota & Capacity Meter Group', category: 'Data Displays', description: 'Progress bar meter metrics displaying server resources and bandwidth limits.', code: '<gp-data-display-meter-metrics />' },
    { id: 'dd-badges', name: 'Badge & Tag Taxonomy Clusters', category: 'Data Displays', description: 'Categorized tag pills and status indicators for metadata grouping.', code: '<gp-data-display-badge-clusters />' },
    { id: 'dd-counter', name: 'High-Impact Stats Counters', category: 'Data Displays', description: 'Dark gradient hero section highlighting enterprise scale and uptime.', code: '<gp-data-display-stats-counter />' },

    // 8. Lists (6)
    { id: 'list-grid', name: 'Responsive Data Grid Table', category: 'Lists', description: 'Table view with checkboxes, search, filters, badges, and paginator footer.', code: '<gp-list-data-grid />' },
    { id: 'list-feed', name: 'Stacked Collaboration Feed', category: 'Lists', description: 'Activity feed stream with user avatars, formatted action messages, and timestamps.', code: '<gp-list-stacked-feed />' },
    { id: 'list-cards', name: 'Grid of Resource Cards', category: 'Lists', description: '3-column card grid with hover animations, status badges, and action buttons.', code: '<gp-list-card-grid />' },
    { id: 'list-tx', name: 'Transaction History Ledger', category: 'Lists', description: 'Banking transaction ledger with incoming/outgoing payment indicators.', code: '<gp-list-transactions />' },
    { id: 'list-users', name: 'User Directory Grid', category: 'Lists', description: '4-column directory grid with avatar indicators, user roles, and quick actions.', code: '<gp-list-user-directory />' },
    { id: 'list-files', name: 'File Attachments Download List', category: 'Lists', description: 'Downloadable assets file list with file sizes, authors, and download buttons.', code: '<gp-list-file-list-download />' },

    // 9. Forms (6)
    { id: 'form-wizard', name: 'Multi-Step Registration Wizard', category: 'Forms', description: '3-step interactive onboarding flow with step indicators and validation.', code: '<gp-form-multi-step-wizard />' },
    { id: 'form-auth', name: 'Split Screen Authentication Form', category: 'Forms', description: '50/50 split sign-in screen with branded hero banner and login form.', code: '<gp-form-auth-split />' },
    { id: 'form-profile', name: 'User Profile Edit Form', category: 'Forms', description: '12-column responsive profile form with name, email, phone, and bio inputs.', code: '<gp-form-user-profile />' },
    { id: 'form-checkout', name: 'Credit Card Payment Form', category: 'Forms', description: 'Payment checkout screen with 256-bit SSL badge and formatted card inputs.', code: '<gp-form-checkout-payment />' },
    { id: 'form-contact', name: 'Contact & Feedback Form', category: 'Forms', description: 'Customer feedback form with category selector, rating stars, and message area.', code: '<gp-form-contact-feedback />' },
    { id: 'form-filter', name: 'Advanced Condition Filter Builder', category: 'Forms', description: 'Dynamic SQL-like rule builder with add/remove condition rows.', code: '<gp-form-advanced-filter-builder />' },

    // 10. Feedbacks (5)
    { id: 'fb-alerts', name: 'Color-Coded Alert Banners', category: 'Feedbacks', description: 'Info, Success, Warning, and Danger notification banners with icons and dismiss.', code: '<gp-feedback-alert-banners />' },
    { id: 'fb-empty', name: 'Illustrated Empty State Block', category: 'Feedbacks', description: 'Placeholder empty state with icon, title, description, and primary CTA button.', code: '<gp-feedback-empty-states />' },
    { id: 'fb-confirm', name: 'Destructive Confirm Dialog Modal', category: 'Feedbacks', description: 'Confirmation dialog mock with warning icon and action buttons.', code: '<gp-feedback-confirm-modals />' },
    { id: 'fb-toast', name: 'Notification Toast Messages', category: 'Feedbacks', description: 'Floating status toast notifications with timestamps and close buttons.', code: '<gp-feedback-toast-status />' },
    { id: 'fb-rating', name: 'Satisfaction Rating & Review', category: 'Feedbacks', description: 'Interactive star rating card with feedback prompt and action buttons.', code: '<gp-feedback-rating-review />' },

    // 11. Navigations & Overlays (6)
    { id: 'nav-topbar', name: 'Responsive Application Topbar', category: 'Nav & Overlays', description: 'Top navigation bar with logo, desktop links, search box, and avatar.', code: '<gp-nav-responsive-top-bar />' },
    { id: 'nav-palette', name: 'Command Palette Overlay (Cmd+K)', category: 'Nav & Overlays', description: 'Spotlight command search modal with shortcuts and quick actions.', code: '<gp-overlay-command-palette />' },
    { id: 'nav-slide-over', name: 'Slide-Over Properties Drawer', category: 'Nav & Overlays', description: 'Side drawer panel for modifying settings and properties without leaving context.', code: '<gp-overlay-slide-over-panel />' },
    { id: 'nav-dropdown', name: 'Action Dropdown Menu', category: 'Nav & Overlays', description: 'User account dropdown menu with profile links and destructive sign-out item.', code: '<gp-nav-dropdown-action-menu />' },
    { id: 'nav-mega', name: 'Multi-Column Mega Menu', category: 'Nav & Overlays', description: '3-column expanded navigation panel with feature links and promo card.', code: '<gp-nav-mega-menu-block />' },
    { id: 'nav-tabs', name: 'Tab Navigation Variants', category: 'Nav & Overlays', description: 'Underline and rounded pill navigation tabs with count badges.', code: '<gp-nav-tab-navigation />' },

    // 12. Pages (6)
    { id: 'page-404', name: '404 Page Not Found', category: 'Basic Pages', description: 'High-impact 404 error page with gradient typography and action buttons.', code: '<gp-page-404 />' },
    { id: 'page-500', name: '500 Internal Server Error', category: 'Basic Pages', description: 'Server failure error screen with retry button and support links.', code: '<gp-page-500 />' },
    { id: 'page-403', name: '403 Access Forbidden', category: 'Basic Pages', description: 'Permission denied screen with request access action button.', code: '<gp-page-403 />' },
    { id: 'page-maint', name: 'Scheduled Maintenance Page', category: 'Basic Pages', description: 'System maintenance screen with estimated completion time widget.', code: '<gp-page-maintenance />' },
    { id: 'page-coming', name: 'Coming Soon & Waitlist Page', category: 'Basic Pages', description: 'Launch countdown timer and work email waitlist capture form.', code: '<gp-page-coming-soon />' },
    { id: 'page-success', name: 'Success & Order Confirmation', category: 'Basic Pages', description: 'Payment success screen with order receipt details and dashboard CTA.', code: '<gp-page-success-confirmation />' }
  ];

  filteredBlocks = computed(() => {
    const cat = this.selectedCategory();
    const q = this.searchQuery().toLowerCase().trim();

    return this.allBlocks.filter(block => {
      const matchCategory =
        cat === 'all' ||
        (cat === 'multi-col' && block.category === 'Multi-Column') ||
        (cat === 'sidebar' && block.category === 'Sidebar Layouts') ||
        (cat === 'stacked' && block.category === 'Stacked Layouts') ||
        (cat === 'dashboards' && block.category === 'Dashboards') ||
        (cat === 'settings' && block.category === 'Settings & Details') ||
        (cat === 'headings' && block.category === 'Headings') ||
        (cat === 'data-displays' && block.category === 'Data Displays') ||
        (cat === 'lists' && block.category === 'Lists') ||
        (cat === 'forms' && block.category === 'Forms') ||
        (cat === 'feedbacks' && block.category === 'Feedbacks') ||
        (cat === 'nav-overlays' && block.category === 'Nav & Overlays') ||
        (cat === 'pages' && block.category === 'Basic Pages');

      const matchSearch =
        !q ||
        block.name.toLowerCase().includes(q) ||
        block.description.toLowerCase().includes(q) ||
        block.category.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    });
  });

  setViewport(blockId: string, vp: string) {
    this.viewports[blockId] = vp;
  }

  setMode(blockId: string, mode: string) {
    this.modeState[blockId] = mode;
  }

  copyCode(code: string, blockId: string) {
    navigator.clipboard.writeText(code);
    this.copiedState[blockId] = true;
    setTimeout(() => {
      this.copiedState[blockId] = false;
    }, 2000);
  }
}
