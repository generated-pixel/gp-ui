import { Component, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent } from 'gp-ui';
import { BLOCKS_DEMO_DATA } from './blocks-mock-data';
import { BLOCKS_CODE_EXAMPLES } from './blocks-code-examples';

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
    GpInputTextComponent,
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

      <!-- Categories Navigation Bar with Smooth Scroll & Arrows -->
      <div class="blocks-toolbar">
        <div class="categories-nav-wrapper">
          <gp-button
            icon="chevron-left"
            [iconOnly]="true"
            variant="text"
            styleClass="cat-nav-btn prev-btn"
            (onClickEvent)="scrollCategories(-240)"
            [disabled]="!canScrollLeft()"
            title="Scroll categories left"
            ariaLabel="Previous categories"
          />

          <div #catTrack class="cat-track" (scroll)="updateScrollState()">
            <gp-button
              *ngFor="let cat of categories"
              variant="text"
              [styleClass]="'cat-chip' + (selectedCategory() === cat.id ? ' active' : '')"
              (onClickEvent)="selectCategory(cat.id, $event)"
            >
              <span>{{ cat.name }}</span>
              <span class="cat-count">{{ cat.count }}</span>
            </gp-button>
          </div>

          <gp-button
            icon="chevron-right"
            [iconOnly]="true"
            variant="text"
            styleClass="cat-nav-btn next-btn"
            (onClickEvent)="scrollCategories(240)"
            [disabled]="!canScrollRight()"
            title="Scroll categories right"
            ariaLabel="Next categories"
          />
        </div>

        <div class="search-wrap">
          <gp-icon name="search" size="0.85em" class="s-ico" />
          <gp-input-text
            styleClass="s-input"
            placeholder="Search blocks..."
            [value]="searchQuery()"
            (onInputEvent)="searchQuery.set($any($event.target).value)"
            ariaLabel="Search blocks"
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
                <gp-button
                  icon="window"
                  [iconOnly]="true"
                  variant="text"
                  [styleClass]="'v-btn' + (viewports[block.id] === 'desktop' || !viewports[block.id] ? ' active' : '')"
                  (onClickEvent)="setViewport(block.id, 'desktop')"
                  title="Desktop View (100%)"
                  ariaLabel="Desktop view"
                />
                <gp-button
                  icon="sliders"
                  [iconOnly]="true"
                  variant="text"
                  [styleClass]="'v-btn' + (viewports[block.id] === 'tablet' ? ' active' : '')"
                  (onClickEvent)="setViewport(block.id, 'tablet')"
                  title="Tablet View (768px)"
                  ariaLabel="Tablet view"
                />
                <gp-button
                  icon="bars"
                  [iconOnly]="true"
                  variant="text"
                  [styleClass]="'v-btn' + (viewports[block.id] === 'mobile' ? ' active' : '')"
                  (onClickEvent)="setViewport(block.id, 'mobile')"
                  title="Mobile View (375px)"
                  ariaLabel="Mobile view"
                />
              </div>

              <!-- Preview / Code Mode Toggle -->
              <div class="mode-toggle">
                <gp-button label="Preview" size="sm" [variant]="modeState[block.id] !== 'code' ? 'filled' : 'text'" [styleClass]="'mode-btn' + (modeState[block.id] !== 'code' ? ' active' : '')" (onClickEvent)="setMode(block.id, 'preview')" />
                <gp-button label="Code" size="sm" [variant]="modeState[block.id] === 'code' ? 'filled' : 'text'" [styleClass]="'mode-btn' + (modeState[block.id] === 'code' ? ' active' : '')" (onClickEvent)="setMode(block.id, 'code')" />
              </div>

              <gp-button
                [label]="copiedState[block.id] ? 'Copied!' : 'Copy'"
                [icon]="copiedState[block.id] ? 'check' : 'copy'"
                size="sm"
                variant="text"
                styleClass="btn-copy"
                (onClickEvent)="copyCode(block.code, block.id)"
                title="Copy Angular snippet"
              />
            </div>
          </div>

          <!-- Block Live Preview Frame -->
          <div
            *ngIf="modeState[block.id] !== 'code'"
            class="block-preview-viewport"
            [class.vp-tablet]="viewports[block.id] === 'tablet'"
            [class.vp-mobile]="viewports[block.id] === 'mobile'"
          >
            <!-- 1. Multi Column Layouts -->
            <gp-layout-two-column-split *ngIf="block.id === 'two-col-split'" [splitRatio]="demoData.layouts.twoCol.splitRatio" [primaryTitle]="demoData.layouts.twoCol.primaryTitle" [primaryBadge]="demoData.layouts.twoCol.primaryBadge" [primaryDescription]="demoData.layouts.twoCol.primaryDescription" [secondaryTitle]="demoData.layouts.twoCol.secondaryTitle" [secondaryDescription]="demoData.layouts.twoCol.secondaryDescription" />
            <gp-layout-three-column-workspace *ngIf="block.id === 'three-col-workspace'" [explorerTitle]="demoData.layouts.threeColWorkspace.explorerTitle" [activeFileName]="demoData.layouts.threeColWorkspace.activeFileName" />
            <gp-layout-three-column-fluid *ngIf="block.id === 'three-col-fluid'" [leftTitle]="demoData.layouts.threeColFluid.leftTitle" [mainTitle]="demoData.layouts.threeColFluid.mainTitle" [mainSubtitle]="demoData.layouts.threeColFluid.mainSubtitle" [rightTitle]="demoData.layouts.threeColFluid.rightTitle" />
            <gp-layout-four-column-grid *ngIf="block.id === 'four-col-grid'" [col1Title]="demoData.layouts.fourCol.col1Title" [col1Badge]="demoData.layouts.fourCol.col1Badge" [col2Title]="demoData.layouts.fourCol.col2Title" [col2Badge]="demoData.layouts.fourCol.col2Badge" [col3Title]="demoData.layouts.fourCol.col3Title" [col3Badge]="demoData.layouts.fourCol.col3Badge" [col4Title]="demoData.layouts.fourCol.col4Title" [col4Badge]="demoData.layouts.fourCol.col4Badge" />

            <!-- 2. Sidebar Layouts -->
            <gp-layout-sidebar-dark *ngIf="block.id === 'sb-dark'" [brandName]="demoData.layouts.sbDark.brandName" [title]="demoData.layouts.sbDark.title" [navGroupLabel]="demoData.layouts.sbDark.navGroupLabel" [userName]="demoData.layouts.sbDark.userName" [userEmail]="demoData.layouts.sbDark.userEmail" [activeNavId]="demoData.layouts.sbDark.activeNavId" [navItems]="demoData.layouts.sbDark.navItems" />
            <gp-layout-sidebar-light *ngIf="block.id === 'sb-light'" [brandName]="demoData.layouts.sbLight.brandName" [title]="demoData.layouts.sbLight.title" [activeNavId]="demoData.layouts.sbLight.activeNavId" [navItems]="demoData.layouts.sbLight.navItems" [upgradeTitle]="demoData.layouts.sbLight.upgradeTitle" [upgradeText]="demoData.layouts.sbLight.upgradeText" [upgradeBtnLabel]="demoData.layouts.sbLight.upgradeBtnLabel" />
            <gp-layout-sidebar-mini *ngIf="block.id === 'sb-mini'" [title]="demoData.layouts.sbMini.title" [activeNavId]="demoData.layouts.sbMini.activeNavId" [userName]="demoData.layouts.sbMini.userName" [navItems]="demoData.layouts.sbMini.navItems" />
            <gp-layout-sidebar-dual *ngIf="block.id === 'sb-dual'" [title]="demoData.layouts.sbDual.title" [activeTier1Id]="demoData.layouts.sbDual.activeTier1Id" [tier1Items]="demoData.layouts.sbDual.tier1Items" [subnavTitle]="demoData.layouts.sbDual.subnavTitle" [subnavBadge]="demoData.layouts.sbDual.subnavBadge" [activeTier2Id]="demoData.layouts.sbDual.activeTier2Id" [tier2Items]="demoData.layouts.sbDual.tier2Items" />
            <gp-layout-sidebar-floating *ngIf="block.id === 'sb-floating'" [brandName]="demoData.layouts.sbFloating.brandName" [title]="demoData.layouts.sbFloating.title" [activeNavId]="demoData.layouts.sbFloating.activeNavId" [navItems]="demoData.layouts.sbFloating.navItems" />
            <gp-layout-sidebar-gradient *ngIf="block.id === 'sb-gradient'" [brandName]="demoData.layouts.sbGradient.brandName" [title]="demoData.layouts.sbGradient.title" [activeNavId]="demoData.layouts.sbGradient.activeNavId" [navItems]="demoData.layouts.sbGradient.navItems" />
            <gp-layout-sidebar-header-over *ngIf="block.id === 'sb-header-over'" [brandName]="demoData.layouts.sbHeaderOver.brandName" [userName]="demoData.layouts.sbHeaderOver.userName" [activeNavId]="demoData.layouts.sbHeaderOver.activeNavId" [navItems]="demoData.layouts.sbHeaderOver.navItems" />
            <gp-layout-sidebar-workspace *ngIf="block.id === 'sb-workspace'" [currentWorkspace]="demoData.layouts.sbWorkspace.currentWorkspace" [workspaceTier]="demoData.layouts.sbWorkspace.workspaceTier" [title]="demoData.layouts.sbWorkspace.title" [activeNavId]="demoData.layouts.sbWorkspace.activeNavId" [navItems]="demoData.layouts.sbWorkspace.navItems" />
            <gp-layout-sidebar-search-tree *ngIf="block.id === 'sb-search-tree'" [title]="demoData.layouts.sbSearchTree.title" [catalogLabel]="demoData.layouts.sbSearchTree.catalogLabel" [activeLeafId]="demoData.layouts.sbSearchTree.activeLeafId" [treeData]="demoData.layouts.sbSearchTree.treeData" />
            <gp-layout-sidebar-pinned-status *ngIf="block.id === 'sb-pinned-status'" [brandName]="demoData.layouts.sbPinnedStatus.brandName" [systemStatus]="demoData.layouts.sbPinnedStatus.systemStatus" [uptimeText]="demoData.layouts.sbPinnedStatus.uptimeText" [title]="demoData.layouts.sbPinnedStatus.title" [activeNavId]="demoData.layouts.sbPinnedStatus.activeNavId" [navItems]="demoData.layouts.sbPinnedStatus.navItems" />
            <gp-layout-sidebar-offcanvas *ngIf="block.id === 'sb-offcanvas'" [brandName]="demoData.layouts.sbOffcanvas.brandName" [title]="demoData.layouts.sbOffcanvas.title" [activeNavId]="demoData.layouts.sbOffcanvas.activeNavId" [navItems]="demoData.layouts.sbOffcanvas.navItems" />
            <gp-layout-sidebar-minimal *ngIf="block.id === 'sb-minimal'" [brandName]="demoData.layouts.sbMinimal.brandName" [title]="demoData.layouts.sbMinimal.title" [activeNavId]="demoData.layouts.sbMinimal.activeNavId" [navItems]="demoData.layouts.sbMinimal.navItems" />
            <gp-layout-sidebar-stepper *ngIf="block.id === 'sb-stepper'" [brandName]="demoData.layouts.sbStepper.brandName" [currentStep]="demoData.layouts.sbStepper.currentStep" [currentStepTitle]="demoData.layouts.sbStepper.currentStepTitle" [currentStepSubtitle]="demoData.layouts.sbStepper.currentStepSubtitle" [steps]="demoData.layouts.sbStepper.steps" />
            <gp-layout-sidebar-accordion *ngIf="block.id === 'sb-accordion'" [brandName]="demoData.layouts.sbAccordion.brandName" [title]="demoData.layouts.sbAccordion.title" [activeSubLinkId]="demoData.layouts.sbAccordion.activeSubLinkId" [groups]="demoData.layouts.sbAccordion.groups" />

            <!-- 3. Stacked Layouts -->
            <gp-layout-stacked-classic *ngIf="block.id === 'st-classic'" [brandName]="demoData.layouts.stClassic.brandName" [userName]="demoData.layouts.stClassic.userName" [title]="demoData.layouts.stClassic.title" [activeNavId]="demoData.layouts.stClassic.activeNavId" [navItems]="demoData.layouts.stClassic.navItems" />
            <gp-layout-stacked-subnav-tabs *ngIf="block.id === 'st-subnav-tabs'" [brandName]="demoData.layouts.stSubnav.brandName" [userName]="demoData.layouts.stSubnav.userName" [activeTabId]="demoData.layouts.stSubnav.activeTabId" [tabs]="demoData.layouts.stSubnav.tabs" />
            <gp-layout-stacked-hero-banner *ngIf="block.id === 'st-hero-banner'" [brandName]="demoData.layouts.stHero.brandName" [heroTitle]="demoData.layouts.stHero.heroTitle" [heroSubtitle]="demoData.layouts.stHero.heroSubtitle" [primaryCta]="demoData.layouts.stHero.primaryCta" [secondaryCta]="demoData.layouts.stHero.secondaryCta" [navLinks]="demoData.layouts.stHero.navLinks" />
            <gp-layout-stacked-floating-card *ngIf="block.id === 'st-floating-card'" [brandName]="demoData.layouts.stFloat.brandName" [userName]="demoData.layouts.stFloat.userName" [title]="demoData.layouts.stFloat.title" />
            <gp-layout-stacked-sticky-action-bar *ngIf="block.id === 'st-sticky-bar'" [brandName]="demoData.layouts.stSticky.brandName" [pageTitle]="demoData.layouts.stSticky.pageTitle" [itemCount]="demoData.layouts.stSticky.itemCount" [addBtnLabel]="demoData.layouts.stSticky.addBtnLabel" [activeNavId]="demoData.layouts.stSticky.activeNavId" [navLinks]="demoData.layouts.stSticky.navLinks" />
            <gp-layout-stacked-bottom-dock *ngIf="block.id === 'st-bottom-dock'" [brandName]="demoData.layouts.stDock.brandName" [activeTab]="demoData.layouts.stDock.activeTab" [activeDockId]="demoData.layouts.stDock.activeDockId" [dockItems]="demoData.layouts.stDock.dockItems" />

            <!-- 4. Dashboards -->
            <gp-dashboard-saas-overview *ngIf="block.id === 'dash-saas'" [kpis]="demoData.dashboards.saas.kpis" [chartTitle]="demoData.dashboards.saas.chartTitle" [chartBadge]="demoData.dashboards.saas.chartBadge" [monthlyData]="demoData.dashboards.saas.monthlyData" [goalsTitle]="demoData.dashboards.saas.goalsTitle" [goalsTarget]="demoData.dashboards.saas.goalsTarget" [quotas]="demoData.dashboards.saas.quotas" [tableTitle]="demoData.dashboards.saas.tableTitle" [recentSignups]="demoData.dashboards.saas.recentSignups" />
            <gp-dashboard-ecommerce *ngIf="block.id === 'dash-ecom'" [kpis]="demoData.dashboards.ecommerce.kpis" [topProducts]="demoData.dashboards.ecommerce.topProducts" [recentOrders]="demoData.dashboards.ecommerce.recentOrders" />
            <gp-dashboard-analytics *ngIf="block.id === 'dash-analytics'" [stats]="demoData.dashboards.analytics.stats" [channels]="demoData.dashboards.analytics.channels" [regions]="demoData.dashboards.analytics.regions" />
            <gp-dashboard-finance *ngIf="block.id === 'dash-finance'" [balanceLabel]="demoData.dashboards.finance.balanceLabel" [balanceAmount]="demoData.dashboards.finance.balanceAmount" [balanceMeta]="demoData.dashboards.finance.balanceMeta" [ledgerTitle]="demoData.dashboards.finance.ledgerTitle" [ledgerBadge]="demoData.dashboards.finance.ledgerBadge" [ledger]="demoData.dashboards.finance.ledger" [invoicesTitle]="demoData.dashboards.finance.invoicesTitle" [invoices]="demoData.dashboards.finance.invoices" />
            <gp-dashboard-project-management *ngIf="block.id === 'dash-pm'" [metrics]="demoData.dashboards.pm.metrics" [columns]="demoData.dashboards.pm.columns" />
            <gp-dashboard-operations *ngIf="block.id === 'dash-ops'" [bannerText]="demoData.dashboards.ops.bannerText" [uptimeBadge]="demoData.dashboards.ops.uptimeBadge" [nodes]="demoData.dashboards.ops.nodes" />

            <!-- 5. Settings & Details -->
            <gp-settings-profile *ngIf="block.id === 'set-profile'" [userName]="demoData.settings.profile.userName" [firstName]="demoData.settings.profile.firstName" [lastName]="demoData.settings.profile.lastName" [email]="demoData.settings.profile.email" [jobTitle]="demoData.settings.profile.jobTitle" [bio]="demoData.settings.profile.bio" />
            <gp-settings-security *ngIf="block.id === 'set-security'" [title]="demoData.settings.security.title" [subtitle]="demoData.settings.security.subtitle" [twoFaEnabled]="demoData.settings.security.twoFaEnabled" [sessions]="demoData.settings.security.sessions" />
            <gp-settings-billing *ngIf="block.id === 'set-billing'" [title]="demoData.settings.billing.title" [subtitle]="demoData.settings.billing.subtitle" [planName]="demoData.settings.billing.planName" [planStatus]="demoData.settings.billing.planStatus" [planPrice]="demoData.settings.billing.planPrice" [invoices]="demoData.settings.billing.invoices" />
            <gp-settings-notifications *ngIf="block.id === 'set-notifications'" [title]="demoData.settings.notifications.title" [subtitle]="demoData.settings.notifications.subtitle" [preferences]="demoData.settings.notifications.preferences" />
            <gp-settings-team-roles *ngIf="block.id === 'set-team-roles'" [title]="demoData.settings.team.title" [subtitle]="demoData.settings.team.subtitle" [members]="demoData.settings.team.members" />
            <gp-settings-api-keys *ngIf="block.id === 'set-api-keys'" [title]="demoData.settings.apiKeys.title" [subtitle]="demoData.settings.apiKeys.subtitle" [apiKeys]="demoData.settings.apiKeys.apiKeys" />
            <gp-settings-danger-zone *ngIf="block.id === 'set-danger-zone'" [actions]="demoData.settings.dangerZone.actions" />
            <gp-details-customer-overview *ngIf="block.id === 'det-customer'" [customerName]="demoData.settings.customer.customerName" [customerStatus]="demoData.settings.customer.customerStatus" [companyName]="demoData.settings.customer.companyName" [location]="demoData.settings.customer.location" [tags]="demoData.settings.customer.tags" [metaFields]="demoData.settings.customer.metaFields" [timelineEvents]="demoData.settings.customer.timelineEvents" />
            <gp-details-order-summary *ngIf="block.id === 'det-order'" [orderId]="demoData.settings.order.orderId" [orderStatus]="demoData.settings.order.orderStatus" [orderDate]="demoData.settings.order.orderDate" [paymentMethod]="demoData.settings.order.paymentMethod" [subtotal]="demoData.settings.order.subtotal" [shipping]="demoData.settings.order.shipping" [tax]="demoData.settings.order.tax" [grandTotal]="demoData.settings.order.grandTotal" [items]="demoData.settings.order.items" />

            <!-- 6. Headings -->
            <gp-header-page-with-actions *ngIf="block.id === 'hdr-actions'" [title]="demoData.headings.actions.title" [badgeText]="demoData.headings.actions.badgeText" [badgeSeverity]="demoData.headings.actions.badgeSeverity" [subtitle]="demoData.headings.actions.subtitle" [breadcrumbs]="demoData.headings.actions.breadcrumbs" [actions]="demoData.headings.actions.actions" />
            <gp-header-search-filters *ngIf="block.id === 'hdr-filters'" [title]="demoData.headings.filters.title" [subtitle]="demoData.headings.filters.subtitle" [filterGroups]="demoData.headings.filters.filterGroups" />
            <gp-header-section-tabs *ngIf="block.id === 'hdr-tabs'" [title]="demoData.headings.tabs.title" [description]="demoData.headings.tabs.description" [tabs]="demoData.headings.tabs.tabs" />
            <gp-header-with-stats *ngIf="block.id === 'hdr-stats'" [title]="demoData.headings.stats.title" [description]="demoData.headings.stats.description" [stats]="demoData.headings.stats.stats" />
            <gp-header-compact-breadcrumb *ngIf="block.id === 'hdr-breadcrumb'" [backLabel]="demoData.headings.breadcrumb.backLabel" [activeItem]="demoData.headings.breadcrumb.activeItem" [editBtnLabel]="demoData.headings.breadcrumb.editBtnLabel" [shareBtnLabel]="demoData.headings.breadcrumb.shareBtnLabel" />
            <gp-header-profile-banner *ngIf="block.id === 'hdr-profile-banner'" [userName]="demoData.headings.profileBanner.userName" [statusText]="demoData.headings.profileBanner.statusText" [statusSeverity]="demoData.headings.profileBanner.statusSeverity" [userTitle]="demoData.headings.profileBanner.userTitle" [location]="demoData.headings.profileBanner.location" />

            <!-- 7. Data Displays -->
            <gp-data-display-kpi-cards *ngIf="block.id === 'dd-kpi'" [kpis]="demoData.dataDisplays.kpi.kpis" />
            <gp-data-display-description-list *ngIf="block.id === 'dd-desc-list'" [title]="demoData.dataDisplays.descList.title" [subtitle]="demoData.dataDisplays.descList.subtitle" [items]="demoData.dataDisplays.descList.items" />
            <gp-data-display-timeline-stream *ngIf="block.id === 'dd-timeline'" [title]="demoData.dataDisplays.timeline.title" [events]="demoData.dataDisplays.timeline.events" />
            <gp-data-display-meter-metrics *ngIf="block.id === 'dd-meter'" [title]="demoData.dataDisplays.meter.title" [subtitle]="demoData.dataDisplays.meter.subtitle" [meters]="demoData.dataDisplays.meter.meters" />
            <gp-data-display-badge-clusters *ngIf="block.id === 'dd-badges'" [title]="demoData.dataDisplays.badges.title" [subtitle]="demoData.dataDisplays.badges.subtitle" [groups]="demoData.dataDisplays.badges.groups" />
            <gp-data-display-stats-counter *ngIf="block.id === 'dd-counter'" [counters]="demoData.dataDisplays.statsCounter.counters" />

            <!-- 8. Lists -->
            <gp-list-data-grid *ngIf="block.id === 'list-grid'" [searchPlaceholder]="demoData.lists.grid.searchPlaceholder" [rows]="demoData.lists.grid.rows" />
            <gp-list-stacked-feed *ngIf="block.id === 'list-feed'" [title]="demoData.lists.feed.title" [badgeText]="demoData.lists.feed.badgeText" [feedItems]="demoData.lists.feed.feedItems" />
            <gp-list-card-grid *ngIf="block.id === 'list-cards'" [title]="demoData.lists.cards.title" [subtitle]="demoData.lists.cards.subtitle" [cards]="demoData.lists.cards.cards" />
            <gp-list-transactions *ngIf="block.id === 'list-tx'" [title]="demoData.lists.tx.title" [badgeText]="demoData.lists.tx.badgeText" [transactions]="demoData.lists.tx.transactions" />
            <gp-list-user-directory *ngIf="block.id === 'list-users'" [title]="demoData.lists.users.title" [users]="demoData.lists.users.users" />
            <gp-list-file-list-download *ngIf="block.id === 'list-files'" [title]="demoData.lists.files.title" [files]="demoData.lists.files.files" />

            <!-- 9. Forms -->
            <gp-form-multi-step-wizard *ngIf="block.id === 'form-wizard'" [steps]="demoData.forms.wizard.steps" />
            <gp-form-auth-split *ngIf="block.id === 'form-auth'" [brandName]="demoData.forms.auth.brandName" [heroTitle]="demoData.forms.auth.heroTitle" [heroDesc]="demoData.forms.auth.heroDesc" [formTitle]="demoData.forms.auth.formTitle" [formSubtitle]="demoData.forms.auth.formSubtitle" />
            <gp-form-user-profile *ngIf="block.id === 'form-profile'" [title]="demoData.forms.userProfile.title" [subtitle]="demoData.forms.userProfile.subtitle" />
            <gp-form-checkout-payment *ngIf="block.id === 'form-checkout'" [title]="demoData.forms.checkout.title" [subtitle]="demoData.forms.checkout.subtitle" [amount]="demoData.forms.checkout.amount" />
            <gp-form-contact-feedback *ngIf="block.id === 'form-contact'" [title]="demoData.forms.contact.title" [subtitle]="demoData.forms.contact.subtitle" />
            <gp-form-advanced-filter-builder *ngIf="block.id === 'form-filter'" [title]="demoData.forms.filter.title" />

            <!-- 10. Feedbacks -->
            <gp-feedback-alert-banners *ngIf="block.id === 'fb-alerts'" [alerts]="demoData.feedbacks.alerts.alerts" />
            <gp-feedback-empty-states *ngIf="block.id === 'fb-empty'" [title]="demoData.feedbacks.empty.title" [description]="demoData.feedbacks.empty.description" [primaryCta]="demoData.feedbacks.empty.primaryCta" [secondaryCta]="demoData.feedbacks.empty.secondaryCta" />
            <gp-feedback-confirm-modals *ngIf="block.id === 'fb-confirm'" [title]="demoData.feedbacks.confirm.title" [message]="demoData.feedbacks.confirm.message" [confirmBtnLabel]="demoData.feedbacks.confirm.confirmBtnLabel" [cancelBtnLabel]="demoData.feedbacks.confirm.cancelBtnLabel" />
            <gp-feedback-toast-status *ngIf="block.id === 'fb-toast'" [toasts]="demoData.feedbacks.toast.toasts" />
            <gp-feedback-rating-review *ngIf="block.id === 'fb-rating'" [title]="demoData.feedbacks.rating.title" [subtitle]="demoData.feedbacks.rating.subtitle" />

            <!-- 11. Navigations & Overlays -->
            <gp-nav-responsive-top-bar *ngIf="block.id === 'nav-topbar'" [brandName]="demoData.navs.topbar.brandName" [userName]="demoData.navs.topbar.userName" [links]="demoData.navs.topbar.navLinks" />
            <gp-overlay-command-palette *ngIf="block.id === 'nav-palette'" [placeholder]="demoData.navs.palette.placeholder" [groupLabel]="demoData.navs.palette.groupLabel" [commands]="demoData.navs.palette.commands" />
            <gp-overlay-slide-over-panel *ngIf="block.id === 'nav-slide-over'" [title]="demoData.navs.slideOver.title" [description]="demoData.navs.slideOver.description" />
            <gp-nav-dropdown-action-menu *ngIf="block.id === 'nav-dropdown'" [signedInLabel]="demoData.navs.dropdown.signedInLabel" [userEmail]="demoData.navs.dropdown.userEmail" [primaryItems]="demoData.navs.dropdown.primaryItems" [dangerItems]="demoData.navs.dropdown.dangerItems" />
            <gp-nav-mega-menu-block *ngIf="block.id === 'nav-mega'" [sections]="demoData.navs.mega.sections" [promo]="demoData.navs.mega.promo" />
            <gp-nav-tab-navigation *ngIf="block.id === 'nav-tabs'" [underlineTabs]="demoData.navs.tabs.underlineTabs" [activeUnderlineTab]="demoData.navs.tabs.activeUnderlineTab" [pillTabs]="demoData.navs.tabs.pillTabs" [activePillTab]="demoData.navs.tabs.activePillTab" />

            <!-- 12. Pages -->
            <gp-page-404 *ngIf="block.id === 'page-404'" [code]="demoData.pages.p404.code" [title]="demoData.pages.p404.title" [description]="demoData.pages.p404.description" [goBackBtnLabel]="demoData.pages.p404.goBackBtnLabel" [returnHomeBtnLabel]="demoData.pages.p404.returnHomeBtnLabel" />
            <gp-page-500 *ngIf="block.id === 'page-500'" [code]="demoData.pages.p500.code" [title]="demoData.pages.p500.title" [description]="demoData.pages.p500.description" [supportBtnLabel]="demoData.pages.p500.supportBtnLabel" [retryBtnLabel]="demoData.pages.p500.retryBtnLabel" />
            <gp-page-403 *ngIf="block.id === 'page-403'" [code]="demoData.pages.p403.code" [title]="demoData.pages.p403.title" [description]="demoData.pages.p403.description" [returnHomeBtnLabel]="demoData.pages.p403.returnHomeBtnLabel" [requestAccessBtnLabel]="demoData.pages.p403.requestAccessBtnLabel" />
            <gp-page-maintenance *ngIf="block.id === 'page-maint'" [badgeText]="demoData.pages.pMaint.badgeText" [badgeSeverity]="demoData.pages.pMaint.badgeSeverity" [title]="demoData.pages.pMaint.title" [description]="demoData.pages.pMaint.description" [estimatedUptime]="demoData.pages.pMaint.estimatedUptime" />
            <gp-page-coming-soon *ngIf="block.id === 'page-coming'" [badgeText]="demoData.pages.pComing.badgeText" [title]="demoData.pages.pComing.title" [description]="demoData.pages.pComing.description" [countdown]="demoData.pages.pComing.countdown" />
            <gp-page-success-confirmation *ngIf="block.id === 'page-success'" [title]="demoData.pages.pSuccess.title" [description]="demoData.pages.pSuccess.description" [orderNumber]="demoData.pages.pSuccess.orderNumber" [email]="demoData.pages.pSuccess.email" [secondaryBtnLabel]="demoData.pages.pSuccess.secondaryBtnLabel" [primaryBtnLabel]="demoData.pages.pSuccess.primaryBtnLabel" />
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

      .categories-nav-wrapper {
        flex: 1;
        min-width: 0;
        max-width: calc(100% - 250px);
        display: flex;
        align-items: center;
        gap: 0.35rem;
        position: relative;
      }

      .cat-track {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        overflow-x: auto;
        scroll-behavior: smooth;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE / Edge */
        padding: 0.25rem 0.15rem;
      }

      .cat-track::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }

      .cat-nav-btn {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--gp-surface-section);
        border: 1px solid var(--gp-surface-border);
        color: var(--gp-text-color-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.15s ease;
      }

      .cat-nav-btn:hover:not(:disabled) {
        background: var(--gp-primary);
        color: var(--gp-primary-text);
        border-color: var(--gp-primary);
        transform: scale(1.05);
      }

      .cat-nav-btn:disabled {
        opacity: 0.25;
        cursor: not-allowed;
        pointer-events: none;
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
        flex-shrink: 0;
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
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
      }

      .cat-count {
        background: rgba(0, 0, 0, 0.2);
        padding: 0.1rem 0.45rem;
        border-radius: 9999px;
        font-size: 0.7rem;
        font-weight: 700;
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
        flex-direction: column;
        align-items: stretch;
        transition: max-width 0.2s ease;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;

        > * {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
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
        .categories-nav-wrapper {
          max-width: 100%;
        }
      }
    `
  ]
})
export class BlocksPageComponent implements AfterViewInit {
  @ViewChild('catTrack') catTrackRef?: ElementRef<HTMLDivElement>;

  demoData = BLOCKS_DEMO_DATA;
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');

  canScrollLeft = signal<boolean>(false);
  canScrollRight = signal<boolean>(true);

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

  ngAfterViewInit(): void {
    setTimeout(() => this.updateScrollState(), 150);
  }

  scrollCategories(offset: number): void {
    if (this.catTrackRef?.nativeElement) {
      this.catTrackRef.nativeElement.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }

  updateScrollState(): void {
    const el = this.catTrackRef?.nativeElement;
    if (!el) return;
    this.canScrollLeft.set(el.scrollLeft > 4);
    this.canScrollRight.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  selectCategory(catId: string, event?: MouseEvent): void {
    this.selectedCategory.set(catId);
    if (event?.currentTarget) {
      (event.currentTarget as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  allBlocks: BlockItem[] = [
    // 1. Multi-Column Layouts
    { id: 'three-col-fluid', name: 'Three-Column Fluid Shell', category: 'Multi-Column', description: 'Fluid responsive layout with collapsible tree sidebar, workspace feed, and contextual right details panel.', code: BLOCKS_CODE_EXAMPLES['three-col-fluid'] },
    { id: 'two-col-split', name: 'Two-Column Split Shell', category: 'Multi-Column', description: '50/50 dual pane layout ideal for split-screen authoring, master-detail and comparison.', code: BLOCKS_CODE_EXAMPLES['two-col-split'] },
    { id: 'three-col-workspace', name: 'Three-Column Workspace', category: 'Multi-Column', description: 'Slack-style channel/team navigation, primary feed, and contextual metadata column.', code: BLOCKS_CODE_EXAMPLES['three-col-workspace'] },
    { id: 'four-col-grid', name: 'Four-Column Dashboard Grid', category: 'Multi-Column', description: 'Modular 4-column application container with KPI cards and responsive column stacking.', code: BLOCKS_CODE_EXAMPLES['four-col-grid'] },

    // 2. Sidebar Layouts (14)
    { id: 'sb-dark', name: 'Dark Sidebar Shell', category: 'Sidebar Layouts', description: 'High contrast dark navigation sidebar with top header search and notifications.', code: BLOCKS_CODE_EXAMPLES['sb-dark'] },
    { id: 'sb-light', name: 'Light Clean Sidebar', category: 'Sidebar Layouts', description: 'Modern minimalist white sidebar with subtle gray active link highlights.', code: BLOCKS_CODE_EXAMPLES['sb-light'] },
    { id: 'sb-mini', name: 'Icon-Only Mini Sidebar', category: 'Sidebar Layouts', description: 'Compact icon-only navigation rail designed for maximum content viewport area.', code: BLOCKS_CODE_EXAMPLES['sb-mini'] },
    { id: 'sb-dual', name: 'Dual Sidebar Multi-Tier', category: 'Sidebar Layouts', description: 'Two-tier navigation: Primary icon rail coupled with a secondary submenu panel.', code: BLOCKS_CODE_EXAMPLES['sb-dual'] },
    { id: 'sb-floating', name: 'Floating Card Sidebar', category: 'Sidebar Layouts', description: 'Elevated floating navigation container with rounded edges and card drop shadows.', code: BLOCKS_CODE_EXAMPLES['sb-floating'] },
    { id: 'sb-gradient', name: 'Gradient Accent Sidebar', category: 'Sidebar Layouts', description: 'Vibrant indigo-to-cyan gradient background with glowing active badges.', code: BLOCKS_CODE_EXAMPLES['sb-gradient'] },
    { id: 'sb-header-over', name: 'Header Spanning Sidebar', category: 'Sidebar Layouts', description: 'Full-width topbar header extending across the entire browser viewport width.', code: BLOCKS_CODE_EXAMPLES['sb-header-over'] },
    { id: 'sb-workspace', name: 'Workspace Channel Sidebar', category: 'Sidebar Layouts', description: 'Workspace-centric navigation with collapsible project channels and direct messages.', code: BLOCKS_CODE_EXAMPLES['sb-workspace'] },
    { id: 'sb-search-tree', name: 'Search & Hierarchy Tree Sidebar', category: 'Sidebar Layouts', description: 'Search-enabled nested folder tree navigation with expand/collapse nodes.', code: BLOCKS_CODE_EXAMPLES['sb-search-tree'] },
    { id: 'sb-pinned-status', name: 'Pinned Status Sidebar', category: 'Sidebar Layouts', description: 'Sidebar featuring persistent cluster health status and active worker pill widgets.', code: BLOCKS_CODE_EXAMPLES['sb-pinned-status'] },
    { id: 'sb-offcanvas', name: 'Slide-Over Offcanvas Sidebar', category: 'Sidebar Layouts', description: 'Off-canvas drawer navigation optimized for compact desktop and mobile devices.', code: BLOCKS_CODE_EXAMPLES['sb-offcanvas'] },
    { id: 'sb-minimal', name: 'Border-Separated Minimal Sidebar', category: 'Sidebar Layouts', description: 'Borderline minimalist sidebar focusing purely on typography and whitespace.', code: BLOCKS_CODE_EXAMPLES['sb-minimal'] },
    { id: 'sb-stepper', name: 'Wizard Stepper Sidebar', category: 'Sidebar Layouts', description: 'Step-by-step progress tracking sidebar with active and completed milestone markers.', code: BLOCKS_CODE_EXAMPLES['sb-stepper'] },
    { id: 'sb-accordion', name: 'Accordion Grouped Sidebar', category: 'Sidebar Layouts', description: 'Categorized accordion groups allowing multiple menu sections to expand simultaneously.', code: BLOCKS_CODE_EXAMPLES['sb-accordion'] },

    // 3. Stacked Layouts (6)
    { id: 'st-classic', name: 'Stacked Classic Shell', category: 'Stacked Layouts', description: 'Full-width top navigation bar with centralized container content area.', code: BLOCKS_CODE_EXAMPLES['st-classic'] },
    { id: 'st-subnav-tabs', name: 'Stacked with Subnav Tabs', category: 'Stacked Layouts', description: 'Two-tier topbar header with secondary horizontal navigation pill tabs.', code: BLOCKS_CODE_EXAMPLES['st-subnav-tabs'] },
    { id: 'st-hero-banner', name: 'Stacked with Hero Header', category: 'Stacked Layouts', description: 'Deep indigo hero banner header with title, subtitle, and overlapping cards.', code: BLOCKS_CODE_EXAMPLES['st-hero-banner'] },
    { id: 'st-floating-card', name: 'Floating Card Stacked Shell', category: 'Stacked Layouts', description: 'Elevated floating header card separated from the viewport edge.', code: BLOCKS_CODE_EXAMPLES['st-floating-card'] },
    { id: 'st-sticky-bar', name: 'Sticky Action Bar Stacked', category: 'Stacked Layouts', description: 'Fixed topbar paired with a sticky bottom action bar for transactional tasks.', code: BLOCKS_CODE_EXAMPLES['st-sticky-bar'] },
    { id: 'st-bottom-dock', name: 'Bottom Dock App Shell', category: 'Stacked Layouts', description: 'macOS-style floating bottom dock toolbar with interactive icon items.', code: BLOCKS_CODE_EXAMPLES['st-bottom-dock'] },

    // 4. Dashboards (6)
    { id: 'dash-saas', name: 'SaaS Business Overview Dashboard', category: 'Dashboards', description: 'MRR metrics, active user growth, and recent billing customer transaction table.', code: BLOCKS_CODE_EXAMPLES['dash-saas'] },
    { id: 'dash-ecom', name: 'Ecommerce Sales & Order Hub', category: 'Dashboards', description: 'Order volume, average basket value, recent transactions, and top category breakdown.', code: BLOCKS_CODE_EXAMPLES['dash-ecom'] },
    { id: 'dash-analytics', name: 'Traffic & Web Telemetry Analytics', category: 'Dashboards', description: 'Real-time active visitors, bounce rate, global geography traffic, and page latency.', code: BLOCKS_CODE_EXAMPLES['dash-analytics'] },
    { id: 'dash-finance', name: 'Corporate Financial & Cash Flow', category: 'Dashboards', description: 'Working capital, quarterly runway, enterprise burn rate, and investment accounts.', code: BLOCKS_CODE_EXAMPLES['dash-finance'] },
    { id: 'dash-pm', name: 'Agile Project Management Sprint Board', category: 'Dashboards', description: 'Sprint velocity, burndown progress, milestone progress bars, and team tasks.', code: BLOCKS_CODE_EXAMPLES['dash-pm'] },
    { id: 'dash-ops', name: 'Cloud Infrastructure & SRE Operations', category: 'Dashboards', description: 'Kubernetes cluster health, edge node CPU/RAM quotas, and region latency metrics.', code: BLOCKS_CODE_EXAMPLES['dash-ops'] },

    // 5. Settings & Details (9)
    { id: 'set-profile', name: 'User Profile & Bio Settings', category: 'Settings & Details', description: 'Avatar upload, personal details, contact information, and public profile bio.', code: BLOCKS_CODE_EXAMPLES['set-profile'] },
    { id: 'set-security', name: 'Security & 2FA Configuration', category: 'Settings & Details', description: 'Password reset inputs, TOTP authenticator switches, and active device sessions.', code: BLOCKS_CODE_EXAMPLES['set-security'] },
    { id: 'set-billing', name: 'Billing & Invoices Management', category: 'Settings & Details', description: 'Active plan tier, payment credit cards on file, and downloadable PDF receipts.', code: BLOCKS_CODE_EXAMPLES['set-billing'] },
    { id: 'set-notifications', name: 'Notification Preferences Matrix', category: 'Settings & Details', description: 'Granular toggle switches for email digests, SMS alerts, and marketing broadcasts.', code: BLOCKS_CODE_EXAMPLES['set-notifications'] },
    { id: 'set-team-roles', name: 'Team Member Roles & Permissions', category: 'Settings & Details', description: 'Invite collaborators, assign RBAC access roles (Owner, Admin, Member, Viewer).', code: BLOCKS_CODE_EXAMPLES['set-team-roles'] },
    { id: 'set-api-keys', name: 'API Keys & Webhooks Management', category: 'Settings & Details', description: 'Scoped production and staging API tokens with 1-click secret clipboard copy.', code: BLOCKS_CODE_EXAMPLES['set-api-keys'] },
    { id: 'set-danger-zone', name: 'Account & Resource Danger Zone', category: 'Settings & Details', description: 'Destructive action panel for transferring ownership and permanent data deletion.', code: BLOCKS_CODE_EXAMPLES['set-danger-zone'] },
    { id: 'det-customer', name: 'Customer 360 Overview Screen', category: 'Settings & Details', description: 'Complete customer dossier with Lifetime Value, account age, and active licenses.', code: BLOCKS_CODE_EXAMPLES['det-customer'] },
    { id: 'det-order', name: 'Order Summary & Tracking Dossier', category: 'Settings & Details', description: 'Itemized product receipts, shipping milestones, tracking ID, and tax breakdown.', code: BLOCKS_CODE_EXAMPLES['det-order'] },

    // 6. Headings (6)
    { id: 'hdr-actions', name: 'Page Header with Actions', category: 'Headings', description: 'Page title, description, and primary/secondary button toolbar.', code: BLOCKS_CODE_EXAMPLES['hdr-actions'] },
    { id: 'hdr-filters', name: 'Header with Search & Filter Bar', category: 'Headings', description: 'Integrated keyword search and dropdown filter inputs in the header.', code: BLOCKS_CODE_EXAMPLES['hdr-filters'] },
    { id: 'hdr-tabs', name: 'Header with Section Tabs', category: 'Headings', description: 'Header bar with underline tab navigation and counter badges.', code: BLOCKS_CODE_EXAMPLES['hdr-tabs'] },
    { id: 'hdr-stats', name: 'Header with Metric Stats Pills', category: 'Headings', description: 'Page header with embedded KPI highlight pill widgets.', code: BLOCKS_CODE_EXAMPLES['hdr-stats'] },
    { id: 'hdr-breadcrumb', name: 'Compact Breadcrumb Header', category: 'Headings', description: 'Streamlined single-line breadcrumb header with back navigation button.', code: BLOCKS_CODE_EXAMPLES['hdr-breadcrumb'] },
    { id: 'hdr-profile-banner', name: 'Profile Banner Cover Header', category: 'Headings', description: 'Gradient banner cover image with overlapping avatar and author bio details.', code: BLOCKS_CODE_EXAMPLES['hdr-profile-banner'] },

    // 7. Data Displays (6)
    { id: 'dd-kpi', name: 'KPI Metric Stat Cards', category: 'Data Displays', description: '4-card metric grid with percentage growth badges, icons, and trends.', code: BLOCKS_CODE_EXAMPLES['dd-kpi'] },
    { id: 'dd-desc-list', name: 'Technical Description List', category: 'Data Displays', description: '2-column structured key-value specification grid with badges.', code: BLOCKS_CODE_EXAMPLES['dd-desc-list'] },
    { id: 'dd-timeline', name: 'Activity Stream Timeline', category: 'Data Displays', description: 'Vertical chronological audit log with icons, timestamps, and avatars.', code: BLOCKS_CODE_EXAMPLES['dd-timeline'] },
    { id: 'dd-meter', name: 'Quota & Capacity Meter Group', category: 'Data Displays', description: 'Progress bar meter metrics displaying server resources and bandwidth limits.', code: BLOCKS_CODE_EXAMPLES['dd-meter'] },
    { id: 'dd-badges', name: 'Badge & Tag Taxonomy Clusters', category: 'Data Displays', description: 'Categorized tag pills and status indicators for metadata grouping.', code: BLOCKS_CODE_EXAMPLES['dd-badges'] },
    { id: 'dd-counter', name: 'High-Impact Stats Counters', category: 'Data Displays', description: 'Dark gradient hero section highlighting enterprise scale and uptime.', code: BLOCKS_CODE_EXAMPLES['dd-counter'] },

    // 8. Lists (6)
    { id: 'list-grid', name: 'Responsive Data Grid Table', category: 'Lists', description: 'Table view with checkboxes, search, filters, badges, and paginator footer.', code: BLOCKS_CODE_EXAMPLES['list-grid'] },
    { id: 'list-feed', name: 'Stacked Collaboration Feed', category: 'Lists', description: 'Activity feed stream with user avatars, formatted action messages, and timestamps.', code: BLOCKS_CODE_EXAMPLES['list-feed'] },
    { id: 'list-cards', name: 'Grid of Resource Cards', category: 'Lists', description: '3-column card grid with hover animations, status badges, and action buttons.', code: BLOCKS_CODE_EXAMPLES['list-cards'] },
    { id: 'list-tx', name: 'Transaction History Ledger', category: 'Lists', description: 'Banking transaction ledger with incoming/outgoing payment indicators.', code: BLOCKS_CODE_EXAMPLES['list-tx'] },
    { id: 'list-users', name: 'User Directory Grid', category: 'Lists', description: '4-column directory grid with avatar indicators, user roles, and quick actions.', code: BLOCKS_CODE_EXAMPLES['list-users'] },
    { id: 'list-files', name: 'File Attachments Download List', category: 'Lists', description: 'Downloadable assets file list with file sizes, authors, and download buttons.', code: BLOCKS_CODE_EXAMPLES['list-files'] },

    // 9. Forms (6)
    { id: 'form-wizard', name: 'Multi-Step Registration Wizard', category: 'Forms', description: '3-step interactive onboarding flow with step indicators and validation.', code: BLOCKS_CODE_EXAMPLES['form-wizard'] },
    { id: 'form-auth', name: 'Split Screen Authentication Form', category: 'Forms', description: '50/50 split sign-in screen with branded hero banner and login form.', code: BLOCKS_CODE_EXAMPLES['form-auth'] },
    { id: 'form-profile', name: 'User Profile Edit Form', category: 'Forms', description: '12-column responsive profile form with name, email, phone, and bio inputs.', code: BLOCKS_CODE_EXAMPLES['form-profile'] },
    { id: 'form-checkout', name: 'Credit Card Payment Form', category: 'Forms', description: 'Payment checkout screen with 256-bit SSL badge and formatted card inputs.', code: BLOCKS_CODE_EXAMPLES['form-checkout'] },
    { id: 'form-contact', name: 'Contact & Feedback Form', category: 'Forms', description: 'Customer feedback form with category selector, rating stars, and message area.', code: BLOCKS_CODE_EXAMPLES['form-contact'] },
    { id: 'form-filter', name: 'Advanced Condition Filter Builder', category: 'Forms', description: 'Dynamic SQL-like rule builder with add/remove condition rows.', code: BLOCKS_CODE_EXAMPLES['form-filter'] },

    // 10. Feedbacks (5)
    { id: 'fb-alerts', name: 'Color-Coded Alert Banners', category: 'Feedbacks', description: 'Info, Success, Warning, and Danger notification banners with icons and dismiss.', code: BLOCKS_CODE_EXAMPLES['fb-alerts'] },
    { id: 'fb-empty', name: 'Illustrated Empty State Block', category: 'Feedbacks', description: 'Placeholder empty state with icon, title, description, and primary CTA button.', code: BLOCKS_CODE_EXAMPLES['fb-empty'] },
    { id: 'fb-confirm', name: 'Destructive Confirm Dialog Modal', category: 'Feedbacks', description: 'Confirmation dialog mock with warning icon and action buttons.', code: BLOCKS_CODE_EXAMPLES['fb-confirm'] },
    { id: 'fb-toast', name: 'Notification Toast Messages', category: 'Feedbacks', description: 'Floating status toast notifications with timestamps and close buttons.', code: BLOCKS_CODE_EXAMPLES['fb-toast'] },
    { id: 'fb-rating', name: 'Satisfaction Rating & Review', category: 'Feedbacks', description: 'Interactive star rating card with feedback prompt and action buttons.', code: BLOCKS_CODE_EXAMPLES['fb-rating'] },

    // 11. Navigations & Overlays (6)
    { id: 'nav-topbar', name: 'Responsive Application Topbar', category: 'Nav & Overlays', description: 'Top navigation bar with logo, desktop links, search box, and avatar.', code: BLOCKS_CODE_EXAMPLES['nav-topbar'] },
    { id: 'nav-palette', name: 'Command Palette Overlay (Cmd+K)', category: 'Nav & Overlays', description: 'Spotlight command search modal with shortcuts and quick actions.', code: BLOCKS_CODE_EXAMPLES['nav-palette'] },
    { id: 'nav-slide-over', name: 'Slide-Over Properties Drawer', category: 'Nav & Overlays', description: 'Side drawer panel for modifying settings and properties without leaving context.', code: BLOCKS_CODE_EXAMPLES['nav-slide-over'] },
    { id: 'nav-dropdown', name: 'Action Dropdown Menu', category: 'Nav & Overlays', description: 'User account dropdown menu with profile links and destructive sign-out item.', code: BLOCKS_CODE_EXAMPLES['nav-dropdown'] },
    { id: 'nav-mega', name: 'Multi-Column Mega Menu', category: 'Nav & Overlays', description: '3-column expanded navigation panel with feature links and promo card.', code: BLOCKS_CODE_EXAMPLES['nav-mega'] },
    { id: 'nav-tabs', name: 'Tab Navigation Variants', category: 'Nav & Overlays', description: 'Underline and rounded pill navigation tabs with count badges.', code: BLOCKS_CODE_EXAMPLES['nav-tabs'] },

    // 12. Pages (6)
    { id: 'page-404', name: '404 Page Not Found', category: 'Basic Pages', description: 'High-impact 404 error page with gradient typography and action buttons.', code: BLOCKS_CODE_EXAMPLES['page-404'] },
    { id: 'page-500', name: '500 Internal Server Error', category: 'Basic Pages', description: 'Server failure error screen with retry button and support links.', code: BLOCKS_CODE_EXAMPLES['page-500'] },
    { id: 'page-403', name: '403 Access Forbidden', category: 'Basic Pages', description: 'Permission denied screen with request access action button.', code: BLOCKS_CODE_EXAMPLES['page-403'] },
    { id: 'page-maint', name: 'Scheduled Maintenance Page', category: 'Basic Pages', description: 'System maintenance screen with estimated completion time widget.', code: BLOCKS_CODE_EXAMPLES['page-maint'] },
    { id: 'page-coming', name: 'Coming Soon & Waitlist Page', category: 'Basic Pages', description: 'Launch countdown timer and work email waitlist capture form.', code: BLOCKS_CODE_EXAMPLES['page-coming'] },
    { id: 'page-success', name: 'Success & Order Confirmation', category: 'Basic Pages', description: 'Payment success screen with order receipt details and dashboard CTA.', code: BLOCKS_CODE_EXAMPLES['page-success'] }
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
