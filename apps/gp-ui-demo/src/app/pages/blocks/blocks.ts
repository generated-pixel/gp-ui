import { Component, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GpBadge, GpButton, GpIcon, GpInputText } from 'gp-ui';
import { BLOCKS_DEMO_DATA } from './blocks-mock-data';
import { BLOCKS_CODE_EXAMPLES } from './blocks-code-examples';

// Import Layouts
import {
  GpLayoutThreeColumnFluid,
  GpLayoutTwoColumnSplit,
  GpLayoutThreeColumnWorkspace,
  GpLayoutFourColumnGrid,
  GpLayoutSidebarDark,
  GpLayoutSidebarLight,
  GpLayoutSidebarMini,
  GpLayoutSidebarDual,
  GpLayoutSidebarFloating,
  GpLayoutSidebarGradient,
  GpLayoutSidebarHeaderOver,
  GpLayoutSidebarWorkspace,
  GpLayoutSidebarSearchTree,
  GpLayoutSidebarPinnedStatus,
  GpLayoutSidebarOffcanvas,
  GpLayoutSidebarMinimal,
  GpLayoutSidebarStepper,
  GpLayoutSidebarAccordion,
  GpLayoutStackedClassic,
  GpLayoutStackedSubnavTabs,
  GpLayoutStackedHeroBanner,
  GpLayoutStackedFloatingCard,
  GpLayoutStackedStickyActionBar,
  GpLayoutStackedBottomDock
} from 'gp-blocks';

// Import Dashboards
import {
  GpDashboardSaasOverview,
  GpDashboardEcommerce,
  GpDashboardAnalytics,
  GpDashboardFinance,
  GpDashboardProjectManagement,
  GpDashboardOperations
} from 'gp-blocks';

// Import Settings & Details
import {
  GpSettingsProfile,
  GpSettingsSecurity,
  GpSettingsBilling,
  GpSettingsNotifications,
  GpSettingsTeamRoles,
  GpSettingsApiKeys,
  GpSettingsDangerZone,
  GpDetailsCustomerOverview,
  GpDetailsOrderSummary
} from 'gp-blocks';

// Import Headings
import {
  GpHeaderPageWithActions,
  GpHeaderSearchFilters,
  GpHeaderSectionTabs,
  GpHeaderWithStats,
  GpHeaderCompactBreadcrumb,
  GpHeaderProfileBanner
} from 'gp-blocks';

// Import Data Displays
import {
  GpDataDisplayKpiCards,
  GpDataDisplayDescriptionList,
  GpDataDisplayTimelineStream,
  GpDataDisplayMeterMetrics,
  GpDataDisplayBadgeClusters,
  GpDataDisplayStatsCounter
} from 'gp-blocks';

// Import Lists
import {
  GpListDataGrid,
  GpListStackedFeed,
  GpListCardGrid,
  GpListTransactions,
  GpListUserDirectory,
  GpListFileListDownload
} from 'gp-blocks';

// Import Forms
import {
  GpFormMultiStepWizard,
  GpFormAuthSplit,
  GpFormUserProfile,
  GpFormCheckoutPayment,
  GpFormContactFeedback,
  GpFormAdvancedFilterBuilder
} from 'gp-blocks';

// Import Feedbacks
import {
  GpFeedbackAlertBanners,
  GpFeedbackEmptyStates,
  GpFeedbackConfirmModals,
  GpFeedbackToastStatus,
  GpFeedbackRatingReview
} from 'gp-blocks';

// Import Navigations & Overlays
import {
  GpNavResponsiveTopBar,
  GpOverlayCommandPalette,
  GpOverlaySlideOverPanel,
  GpNavDropdownActionMenu,
  GpNavMegaMenuBlock,
  GpNavTabNavigation
} from 'gp-blocks';

// Import Pages
import {
  GpPage404,
  GpPage500,
  GpPage403,
  GpPageMaintenance,
  GpPageComingSoon,
  GpPageSuccessConfirmation
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
    FormsModule,
    RouterModule,
    GpBadge,
    GpButton,
    GpIcon,
    GpInputText,
    GpLayoutThreeColumnFluid,
    GpLayoutTwoColumnSplit,
    GpLayoutThreeColumnWorkspace,
    GpLayoutFourColumnGrid,
    GpLayoutSidebarDark,
    GpLayoutSidebarLight,
    GpLayoutSidebarMini,
    GpLayoutSidebarDual,
    GpLayoutSidebarFloating,
    GpLayoutSidebarGradient,
    GpLayoutSidebarHeaderOver,
    GpLayoutSidebarWorkspace,
    GpLayoutSidebarSearchTree,
    GpLayoutSidebarPinnedStatus,
    GpLayoutSidebarOffcanvas,
    GpLayoutSidebarMinimal,
    GpLayoutSidebarStepper,
    GpLayoutSidebarAccordion,
    GpLayoutStackedClassic,
    GpLayoutStackedSubnavTabs,
    GpLayoutStackedHeroBanner,
    GpLayoutStackedFloatingCard,
    GpLayoutStackedStickyActionBar,
    GpLayoutStackedBottomDock,
    GpDashboardSaasOverview,
    GpDashboardEcommerce,
    GpDashboardAnalytics,
    GpDashboardFinance,
    GpDashboardProjectManagement,
    GpDashboardOperations,
    GpSettingsProfile,
    GpSettingsSecurity,
    GpSettingsBilling,
    GpSettingsNotifications,
    GpSettingsTeamRoles,
    GpSettingsApiKeys,
    GpSettingsDangerZone,
    GpDetailsCustomerOverview,
    GpDetailsOrderSummary,
    GpHeaderPageWithActions,
    GpHeaderSearchFilters,
    GpHeaderSectionTabs,
    GpHeaderWithStats,
    GpHeaderCompactBreadcrumb,
    GpHeaderProfileBanner,
    GpDataDisplayKpiCards,
    GpDataDisplayDescriptionList,
    GpDataDisplayTimelineStream,
    GpDataDisplayMeterMetrics,
    GpDataDisplayBadgeClusters,
    GpDataDisplayStatsCounter,
    GpListDataGrid,
    GpListStackedFeed,
    GpListCardGrid,
    GpListTransactions,
    GpListUserDirectory,
    GpListFileListDownload,
    GpFormMultiStepWizard,
    GpFormAuthSplit,
    GpFormUserProfile,
    GpFormCheckoutPayment,
    GpFormContactFeedback,
    GpFormAdvancedFilterBuilder,
    GpFeedbackAlertBanners,
    GpFeedbackEmptyStates,
    GpFeedbackConfirmModals,
    GpFeedbackToastStatus,
    GpFeedbackRatingReview,
    GpNavResponsiveTopBar,
    GpOverlayCommandPalette,
    GpOverlaySlideOverPanel,
    GpNavDropdownActionMenu,
    GpNavMegaMenuBlock,
    GpNavTabNavigation,
    GpPage404,
    GpPage500,
    GpPage403,
    GpPageMaintenance,
    GpPageComingSoon,
    GpPageSuccessConfirmation
  ],
  templateUrl: './blocks.html',
  styleUrl: './blocks.scss'
})
export class BlocksPage implements AfterViewInit {
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
    if (!el) {
      return;
    }
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
    {
      id: 'three-col-fluid',
      name: 'Three-Column Fluid Shell',
      category: 'Multi-Column',
      description:
        'Fluid responsive layout with collapsible tree sidebar, workspace feed, and contextual right details panel.',
      code: BLOCKS_CODE_EXAMPLES['three-col-fluid']
    },
    {
      id: 'two-col-split',
      name: 'Two-Column Split Shell',
      category: 'Multi-Column',
      description: '50/50 dual pane layout ideal for split-screen authoring, master-detail and comparison.',
      code: BLOCKS_CODE_EXAMPLES['two-col-split']
    },
    {
      id: 'three-col-workspace',
      name: 'Three-Column Workspace',
      category: 'Multi-Column',
      description: 'Slack-style channel/team navigation, primary feed, and contextual metadata column.',
      code: BLOCKS_CODE_EXAMPLES['three-col-workspace']
    },
    {
      id: 'four-col-grid',
      name: 'Four-Column Dashboard Grid',
      category: 'Multi-Column',
      description: 'Modular 4-column application container with KPI cards and responsive column stacking.',
      code: BLOCKS_CODE_EXAMPLES['four-col-grid']
    },

    // 2. Sidebar Layouts (14)
    {
      id: 'sb-dark',
      name: 'Dark Sidebar Shell',
      category: 'Sidebar Layouts',
      description: 'High contrast dark navigation sidebar with top header search and notifications.',
      code: BLOCKS_CODE_EXAMPLES['sb-dark']
    },
    {
      id: 'sb-light',
      name: 'Light Clean Sidebar',
      category: 'Sidebar Layouts',
      description: 'Modern minimalist white sidebar with subtle gray active link highlights.',
      code: BLOCKS_CODE_EXAMPLES['sb-light']
    },
    {
      id: 'sb-mini',
      name: 'Icon-Only Mini Sidebar',
      category: 'Sidebar Layouts',
      description: 'Compact icon-only navigation rail designed for maximum content viewport area.',
      code: BLOCKS_CODE_EXAMPLES['sb-mini']
    },
    {
      id: 'sb-dual',
      name: 'Dual Sidebar Multi-Tier',
      category: 'Sidebar Layouts',
      description: 'Two-tier navigation: Primary icon rail coupled with a secondary submenu panel.',
      code: BLOCKS_CODE_EXAMPLES['sb-dual']
    },
    {
      id: 'sb-floating',
      name: 'Floating Card Sidebar',
      category: 'Sidebar Layouts',
      description: 'Elevated floating navigation container with rounded edges and card drop shadows.',
      code: BLOCKS_CODE_EXAMPLES['sb-floating']
    },
    {
      id: 'sb-gradient',
      name: 'Gradient Accent Sidebar',
      category: 'Sidebar Layouts',
      description: 'Vibrant indigo-to-cyan gradient background with glowing active badges.',
      code: BLOCKS_CODE_EXAMPLES['sb-gradient']
    },
    {
      id: 'sb-header-over',
      name: 'Header Spanning Sidebar',
      category: 'Sidebar Layouts',
      description: 'Full-width topbar header extending across the entire browser viewport width.',
      code: BLOCKS_CODE_EXAMPLES['sb-header-over']
    },
    {
      id: 'sb-workspace',
      name: 'Workspace Channel Sidebar',
      category: 'Sidebar Layouts',
      description: 'Workspace-centric navigation with collapsible project channels and direct messages.',
      code: BLOCKS_CODE_EXAMPLES['sb-workspace']
    },
    {
      id: 'sb-search-tree',
      name: 'Search & Hierarchy Tree Sidebar',
      category: 'Sidebar Layouts',
      description: 'Search-enabled nested folder tree navigation with expand/collapse nodes.',
      code: BLOCKS_CODE_EXAMPLES['sb-search-tree']
    },
    {
      id: 'sb-pinned-status',
      name: 'Pinned Status Sidebar',
      category: 'Sidebar Layouts',
      description: 'Sidebar featuring persistent cluster health status and active worker pill widgets.',
      code: BLOCKS_CODE_EXAMPLES['sb-pinned-status']
    },
    {
      id: 'sb-offcanvas',
      name: 'Slide-Over Offcanvas Sidebar',
      category: 'Sidebar Layouts',
      description: 'Off-canvas drawer navigation optimized for compact desktop and mobile devices.',
      code: BLOCKS_CODE_EXAMPLES['sb-offcanvas']
    },
    {
      id: 'sb-minimal',
      name: 'Border-Separated Minimal Sidebar',
      category: 'Sidebar Layouts',
      description: 'Borderline minimalist sidebar focusing purely on typography and whitespace.',
      code: BLOCKS_CODE_EXAMPLES['sb-minimal']
    },
    {
      id: 'sb-stepper',
      name: 'Wizard Stepper Sidebar',
      category: 'Sidebar Layouts',
      description: 'Step-by-step progress tracking sidebar with active and completed milestone markers.',
      code: BLOCKS_CODE_EXAMPLES['sb-stepper']
    },
    {
      id: 'sb-accordion',
      name: 'Accordion Grouped Sidebar',
      category: 'Sidebar Layouts',
      description: 'Categorized accordion groups allowing multiple menu sections to expand simultaneously.',
      code: BLOCKS_CODE_EXAMPLES['sb-accordion']
    },

    // 3. Stacked Layouts (6)
    {
      id: 'st-classic',
      name: 'Stacked Classic Shell',
      category: 'Stacked Layouts',
      description: 'Full-width top navigation bar with centralized container content area.',
      code: BLOCKS_CODE_EXAMPLES['st-classic']
    },
    {
      id: 'st-subnav-tabs',
      name: 'Stacked with Subnav Tabs',
      category: 'Stacked Layouts',
      description: 'Two-tier topbar header with secondary horizontal navigation pill tabs.',
      code: BLOCKS_CODE_EXAMPLES['st-subnav-tabs']
    },
    {
      id: 'st-hero-banner',
      name: 'Stacked with Hero Header',
      category: 'Stacked Layouts',
      description: 'Deep indigo hero banner header with title, subtitle, and overlapping cards.',
      code: BLOCKS_CODE_EXAMPLES['st-hero-banner']
    },
    {
      id: 'st-floating-card',
      name: 'Floating Card Stacked Shell',
      category: 'Stacked Layouts',
      description: 'Elevated floating header card separated from the viewport edge.',
      code: BLOCKS_CODE_EXAMPLES['st-floating-card']
    },
    {
      id: 'st-sticky-bar',
      name: 'Sticky Action Bar Stacked',
      category: 'Stacked Layouts',
      description: 'Fixed topbar paired with a sticky bottom action bar for transactional tasks.',
      code: BLOCKS_CODE_EXAMPLES['st-sticky-bar']
    },
    {
      id: 'st-bottom-dock',
      name: 'Bottom Dock App Shell',
      category: 'Stacked Layouts',
      description: 'macOS-style floating bottom dock toolbar with interactive icon items.',
      code: BLOCKS_CODE_EXAMPLES['st-bottom-dock']
    },

    // 4. Dashboards (6)
    {
      id: 'dash-saas',
      name: 'SaaS Business Overview Dashboard',
      category: 'Dashboards',
      description: 'MRR metrics, active user growth, and recent billing customer transaction table.',
      code: BLOCKS_CODE_EXAMPLES['dash-saas']
    },
    {
      id: 'dash-ecom',
      name: 'Ecommerce Sales & Order Hub',
      category: 'Dashboards',
      description: 'Order volume, average basket value, recent transactions, and top category breakdown.',
      code: BLOCKS_CODE_EXAMPLES['dash-ecom']
    },
    {
      id: 'dash-analytics',
      name: 'Traffic & Web Telemetry Analytics',
      category: 'Dashboards',
      description: 'Real-time active visitors, bounce rate, global geography traffic, and page latency.',
      code: BLOCKS_CODE_EXAMPLES['dash-analytics']
    },
    {
      id: 'dash-finance',
      name: 'Corporate Financial & Cash Flow',
      category: 'Dashboards',
      description: 'Working capital, quarterly runway, enterprise burn rate, and investment accounts.',
      code: BLOCKS_CODE_EXAMPLES['dash-finance']
    },
    {
      id: 'dash-pm',
      name: 'Agile Project Management Sprint Board',
      category: 'Dashboards',
      description: 'Sprint velocity, burndown progress, milestone progress bars, and team tasks.',
      code: BLOCKS_CODE_EXAMPLES['dash-pm']
    },
    {
      id: 'dash-ops',
      name: 'Cloud Infrastructure & SRE Operations',
      category: 'Dashboards',
      description: 'Kubernetes cluster health, edge node CPU/RAM quotas, and region latency metrics.',
      code: BLOCKS_CODE_EXAMPLES['dash-ops']
    },

    // 5. Settings & Details (9)
    {
      id: 'set-profile',
      name: 'User Profile & Bio Settings',
      category: 'Settings & Details',
      description: 'Avatar upload, personal details, contact information, and public profile bio.',
      code: BLOCKS_CODE_EXAMPLES['set-profile']
    },
    {
      id: 'set-security',
      name: 'Security & 2FA Configuration',
      category: 'Settings & Details',
      description: 'Password reset inputs, TOTP authenticator switches, and active device sessions.',
      code: BLOCKS_CODE_EXAMPLES['set-security']
    },
    {
      id: 'set-billing',
      name: 'Billing & Invoices Management',
      category: 'Settings & Details',
      description: 'Active plan tier, payment credit cards on file, and downloadable PDF receipts.',
      code: BLOCKS_CODE_EXAMPLES['set-billing']
    },
    {
      id: 'set-notifications',
      name: 'Notification Preferences Matrix',
      category: 'Settings & Details',
      description: 'Granular toggle switches for email digests, SMS alerts, and marketing broadcasts.',
      code: BLOCKS_CODE_EXAMPLES['set-notifications']
    },
    {
      id: 'set-team-roles',
      name: 'Team Member Roles & Permissions',
      category: 'Settings & Details',
      description: 'Invite collaborators, assign RBAC access roles (Owner, Admin, Member, Viewer).',
      code: BLOCKS_CODE_EXAMPLES['set-team-roles']
    },
    {
      id: 'set-api-keys',
      name: 'API Keys & Webhooks Management',
      category: 'Settings & Details',
      description: 'Scoped production and staging API tokens with 1-click secret clipboard copy.',
      code: BLOCKS_CODE_EXAMPLES['set-api-keys']
    },
    {
      id: 'set-danger-zone',
      name: 'Account & Resource Danger Zone',
      category: 'Settings & Details',
      description: 'Destructive action panel for transferring ownership and permanent data deletion.',
      code: BLOCKS_CODE_EXAMPLES['set-danger-zone']
    },
    {
      id: 'det-customer',
      name: 'Customer 360 Overview Screen',
      category: 'Settings & Details',
      description: 'Complete customer dossier with Lifetime Value, account age, and active licenses.',
      code: BLOCKS_CODE_EXAMPLES['det-customer']
    },
    {
      id: 'det-order',
      name: 'Order Summary & Tracking Dossier',
      category: 'Settings & Details',
      description: 'Itemized product receipts, shipping milestones, tracking ID, and tax breakdown.',
      code: BLOCKS_CODE_EXAMPLES['det-order']
    },

    // 6. Headings (6)
    {
      id: 'hdr-actions',
      name: 'Page Header with Actions',
      category: 'Headings',
      description: 'Page title, description, and primary/secondary button toolbar.',
      code: BLOCKS_CODE_EXAMPLES['hdr-actions']
    },
    {
      id: 'hdr-filters',
      name: 'Header with Search & Filter Bar',
      category: 'Headings',
      description: 'Integrated keyword search and dropdown filter inputs in the header.',
      code: BLOCKS_CODE_EXAMPLES['hdr-filters']
    },
    {
      id: 'hdr-tabs',
      name: 'Header with Section Tabs',
      category: 'Headings',
      description: 'Header bar with underline tab navigation and counter badges.',
      code: BLOCKS_CODE_EXAMPLES['hdr-tabs']
    },
    {
      id: 'hdr-stats',
      name: 'Header with Metric Stats Pills',
      category: 'Headings',
      description: 'Page header with embedded KPI highlight pill widgets.',
      code: BLOCKS_CODE_EXAMPLES['hdr-stats']
    },
    {
      id: 'hdr-breadcrumb',
      name: 'Compact Breadcrumb Header',
      category: 'Headings',
      description: 'Streamlined single-line breadcrumb header with back navigation button.',
      code: BLOCKS_CODE_EXAMPLES['hdr-breadcrumb']
    },
    {
      id: 'hdr-profile-banner',
      name: 'Profile Banner Cover Header',
      category: 'Headings',
      description: 'Gradient banner cover image with overlapping avatar and author bio details.',
      code: BLOCKS_CODE_EXAMPLES['hdr-profile-banner']
    },

    // 7. Data Displays (6)
    {
      id: 'dd-kpi',
      name: 'KPI Metric Stat Cards',
      category: 'Data Displays',
      description: '4-card metric grid with percentage growth badges, icons, and trends.',
      code: BLOCKS_CODE_EXAMPLES['dd-kpi']
    },
    {
      id: 'dd-desc-list',
      name: 'Technical Description List',
      category: 'Data Displays',
      description: '2-column structured key-value specification grid with badges.',
      code: BLOCKS_CODE_EXAMPLES['dd-desc-list']
    },
    {
      id: 'dd-timeline',
      name: 'Activity Stream Timeline',
      category: 'Data Displays',
      description: 'Vertical chronological audit log with icons, timestamps, and avatars.',
      code: BLOCKS_CODE_EXAMPLES['dd-timeline']
    },
    {
      id: 'dd-meter',
      name: 'Quota & Capacity Meter Group',
      category: 'Data Displays',
      description: 'Progress bar meter metrics displaying server resources and bandwidth limits.',
      code: BLOCKS_CODE_EXAMPLES['dd-meter']
    },
    {
      id: 'dd-badges',
      name: 'Badge & Tag Taxonomy Clusters',
      category: 'Data Displays',
      description: 'Categorized tag pills and status indicators for metadata grouping.',
      code: BLOCKS_CODE_EXAMPLES['dd-badges']
    },
    {
      id: 'dd-counter',
      name: 'High-Impact Stats Counters',
      category: 'Data Displays',
      description: 'Dark gradient hero section highlighting enterprise scale and uptime.',
      code: BLOCKS_CODE_EXAMPLES['dd-counter']
    },

    // 8. Lists (6)
    {
      id: 'list-grid',
      name: 'Responsive Data Grid Table',
      category: 'Lists',
      description: 'Table view with checkboxes, search, filters, badges, and paginator footer.',
      code: BLOCKS_CODE_EXAMPLES['list-grid']
    },
    {
      id: 'list-feed',
      name: 'Stacked Collaboration Feed',
      category: 'Lists',
      description: 'Activity feed stream with user avatars, formatted action messages, and timestamps.',
      code: BLOCKS_CODE_EXAMPLES['list-feed']
    },
    {
      id: 'list-cards',
      name: 'Grid of Resource Cards',
      category: 'Lists',
      description: '3-column card grid with hover animations, status badges, and action buttons.',
      code: BLOCKS_CODE_EXAMPLES['list-cards']
    },
    {
      id: 'list-tx',
      name: 'Transaction History Ledger',
      category: 'Lists',
      description: 'Banking transaction ledger with incoming/outgoing payment indicators.',
      code: BLOCKS_CODE_EXAMPLES['list-tx']
    },
    {
      id: 'list-users',
      name: 'User Directory Grid',
      category: 'Lists',
      description: '4-column directory grid with avatar indicators, user roles, and quick actions.',
      code: BLOCKS_CODE_EXAMPLES['list-users']
    },
    {
      id: 'list-files',
      name: 'File Attachments Download List',
      category: 'Lists',
      description: 'Downloadable assets file list with file sizes, authors, and download buttons.',
      code: BLOCKS_CODE_EXAMPLES['list-files']
    },

    // 9. Forms (6)
    {
      id: 'form-wizard',
      name: 'Multi-Step Registration Wizard',
      category: 'Forms',
      description: '3-step interactive onboarding flow with step indicators and validation.',
      code: BLOCKS_CODE_EXAMPLES['form-wizard']
    },
    {
      id: 'form-auth',
      name: 'Split Screen Authentication Form',
      category: 'Forms',
      description: '50/50 split sign-in screen with branded hero banner and login form.',
      code: BLOCKS_CODE_EXAMPLES['form-auth']
    },
    {
      id: 'form-profile',
      name: 'User Profile Edit Form',
      category: 'Forms',
      description: '12-column responsive profile form with name, email, phone, and bio inputs.',
      code: BLOCKS_CODE_EXAMPLES['form-profile']
    },
    {
      id: 'form-checkout',
      name: 'Credit Card Payment Form',
      category: 'Forms',
      description: 'Payment checkout screen with 256-bit SSL badge and formatted card inputs.',
      code: BLOCKS_CODE_EXAMPLES['form-checkout']
    },
    {
      id: 'form-contact',
      name: 'Contact & Feedback Form',
      category: 'Forms',
      description: 'Customer feedback form with category selector, rating stars, and message area.',
      code: BLOCKS_CODE_EXAMPLES['form-contact']
    },
    {
      id: 'form-filter',
      name: 'Advanced Condition Filter Builder',
      category: 'Forms',
      description: 'Dynamic SQL-like rule builder with add/remove condition rows.',
      code: BLOCKS_CODE_EXAMPLES['form-filter']
    },

    // 10. Feedbacks (5)
    {
      id: 'fb-alerts',
      name: 'Color-Coded Alert Banners',
      category: 'Feedbacks',
      description: 'Info, Success, Warning, and Danger notification banners with icons and dismiss.',
      code: BLOCKS_CODE_EXAMPLES['fb-alerts']
    },
    {
      id: 'fb-empty',
      name: 'Illustrated Empty State Block',
      category: 'Feedbacks',
      description: 'Placeholder empty state with icon, title, description, and primary CTA button.',
      code: BLOCKS_CODE_EXAMPLES['fb-empty']
    },
    {
      id: 'fb-confirm',
      name: 'Destructive Confirm Dialog Modal',
      category: 'Feedbacks',
      description: 'Confirmation dialog mock with warning icon and action buttons.',
      code: BLOCKS_CODE_EXAMPLES['fb-confirm']
    },
    {
      id: 'fb-toast',
      name: 'Notification Toast Messages',
      category: 'Feedbacks',
      description: 'Floating status toast notifications with timestamps and close buttons.',
      code: BLOCKS_CODE_EXAMPLES['fb-toast']
    },
    {
      id: 'fb-rating',
      name: 'Satisfaction Rating & Review',
      category: 'Feedbacks',
      description: 'Interactive star rating card with feedback prompt and action buttons.',
      code: BLOCKS_CODE_EXAMPLES['fb-rating']
    },

    // 11. Navigations & Overlays (6)
    {
      id: 'nav-topbar',
      name: 'Responsive Application Topbar',
      category: 'Nav & Overlays',
      description: 'Top navigation bar with logo, desktop links, search box, and avatar.',
      code: BLOCKS_CODE_EXAMPLES['nav-topbar']
    },
    {
      id: 'nav-palette',
      name: 'Command Palette Overlay (Cmd+K)',
      category: 'Nav & Overlays',
      description: 'Spotlight command search modal with shortcuts and quick actions.',
      code: BLOCKS_CODE_EXAMPLES['nav-palette']
    },
    {
      id: 'nav-slide-over',
      name: 'Slide-Over Properties Drawer',
      category: 'Nav & Overlays',
      description: 'Side drawer panel for modifying settings and properties without leaving context.',
      code: BLOCKS_CODE_EXAMPLES['nav-slide-over']
    },
    {
      id: 'nav-dropdown',
      name: 'Action Dropdown Menu',
      category: 'Nav & Overlays',
      description: 'User account dropdown menu with profile links and destructive sign-out item.',
      code: BLOCKS_CODE_EXAMPLES['nav-dropdown']
    },
    {
      id: 'nav-mega',
      name: 'Multi-Column Mega Menu',
      category: 'Nav & Overlays',
      description: '3-column expanded navigation panel with feature links and promo card.',
      code: BLOCKS_CODE_EXAMPLES['nav-mega']
    },
    {
      id: 'nav-tabs',
      name: 'Tab Navigation Variants',
      category: 'Nav & Overlays',
      description: 'Underline and rounded pill navigation tabs with count badges.',
      code: BLOCKS_CODE_EXAMPLES['nav-tabs']
    },

    // 12. Pages (6)
    {
      id: 'page-404',
      name: '404 Page Not Found',
      category: 'Basic Pages',
      description: 'High-impact 404 error page with gradient typography and action buttons.',
      code: BLOCKS_CODE_EXAMPLES['page-404']
    },
    {
      id: 'page-500',
      name: '500 Internal Server Error',
      category: 'Basic Pages',
      description: 'Server failure error screen with retry button and support links.',
      code: BLOCKS_CODE_EXAMPLES['page-500']
    },
    {
      id: 'page-403',
      name: '403 Access Forbidden',
      category: 'Basic Pages',
      description: 'Permission denied screen with request access action button.',
      code: BLOCKS_CODE_EXAMPLES['page-403']
    },
    {
      id: 'page-maint',
      name: 'Scheduled Maintenance Page',
      category: 'Basic Pages',
      description: 'System maintenance screen with estimated completion time widget.',
      code: BLOCKS_CODE_EXAMPLES['page-maint']
    },
    {
      id: 'page-coming',
      name: 'Coming Soon & Waitlist Page',
      category: 'Basic Pages',
      description: 'Launch countdown timer and work email waitlist capture form.',
      code: BLOCKS_CODE_EXAMPLES['page-coming']
    },
    {
      id: 'page-success',
      name: 'Success & Order Confirmation',
      category: 'Basic Pages',
      description: 'Payment success screen with order receipt details and dashboard CTA.',
      code: BLOCKS_CODE_EXAMPLES['page-success']
    }
  ];

  filteredBlocks = computed(() => {
    const cat = this.selectedCategory();
    const q = this.searchQuery().toLowerCase().trim();

    return this.allBlocks.filter((block) => {
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
