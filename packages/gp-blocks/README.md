# `@generatedpixel/gp-blocks`

> Enterprise Reusable UI Blocks & Dynamic JSON Schema Engine for Angular, built natively on `gp-ui`, `gp-ui-theme`, `gp-ui-icons`, and `gp-css`.

[![npm version](https://img.shields.io/npm/v/@generatedpixel/gp-blocks.svg?style=flat&color=blue)](https://www.npmjs.com/package/@generatedpixel/gp-blocks)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

`@generatedpixel/gp-blocks` delivers over 50 pre-built, production-ready enterprise UI block components and a metadata-driven Dynamic JSON Rendering Engine for Angular 18+.

---

## Features

- **50+ Pre-built Reusable Blocks** across 10 categories:
  - **Application Layouts (24)**:
    - Multi-Column: `GpLayoutThreeColumnFluidComponent`, `GpLayoutTwoColumnSplitComponent`, `GpLayoutThreeColumnWorkspaceComponent`, `GpLayoutFourColumnGridComponent`.
    - Sidebars: `GpLayoutSidebarDarkComponent`, `GpLayoutSidebarLightComponent`, `GpLayoutSidebarMiniComponent`, `GpLayoutSidebarDualComponent`, `GpLayoutSidebarFloatingComponent`, `GpLayoutSidebarGradientComponent`, `GpLayoutSidebarHeaderOverComponent`, `GpLayoutSidebarWorkspaceComponent`, `GpLayoutSidebarSearchTreeComponent`, `GpLayoutSidebarPinnedStatusComponent`, `GpLayoutSidebarOffcanvasComponent`, `GpLayoutSidebarMinimalComponent`, `GpLayoutSidebarStepperComponent`, `GpLayoutSidebarAccordionComponent`.
    - Stacked: `GpLayoutStackedClassicComponent`, `GpLayoutStackedSubnavTabsComponent`, `GpLayoutStackedHeroBannerComponent`, `GpLayoutStackedFloatingCardComponent`, `GpLayoutStackedStickyActionBarComponent`, `GpLayoutStackedBottomDockComponent`.
  - **Dashboards (6)**: SaaS Overview, Ecommerce, Analytics, Finance, Project Management, Operations.
  - **Settings & Details (9)**: User Profile, Security/2FA, Billing & Subscriptions, Notifications, Team Roles, API Keys, Danger Zone, Customer Overview, Order Summary.
  - **Headings & Page Headers (6)**: Page headers with action bars, Search & filter headers, Tabbed section headers, KPI stat headers, Profile banners, Compact breadcrumb headers.
  - **Data Displays (6)**: KPI Stat Cards, Key-Value Description Lists, Timeline Activity Streams, Meter Groups, Badge Clusters, Stats Counters.
  - **Lists & Feeds (6)**: Data Grids with sort/filter/pagination, Stacked Feeds, Card Grids, Transaction Ledgers, User Directories, File Attachment Downloads.
  - **Forms (6)**: Multi-Step Stepper Wizards, Split Auth (Login/Register), User Profile Forms, Checkout & Billing, Contact Feedback, Advanced Filter Builders.
  - **Feedbacks & Modals (5)**: Alert Banners, Empty States, Confirmation Dialogs, Toast Status triggers, Rating & Review prompts.
  - **Navigations & Overlays (6)**: Responsive Topbars, Command Palette modal, Slide-Over Drawers, Dropdown Action menus, Mega Menus, Tab Navigation.
  - **Basic Pages (6)**: 404 Not Found, 500 Server Error, 403 Forbidden, Maintenance Mode, Coming Soon, Success / Confirmation.
- **Dynamic JSON Metadata Engine**:
  - `GpDynamicBlockRenderer`: Render complete layouts, headers, and views declaratively from JSON definitions.
  - `GpDynamicForm`: Render reactive forms with real-time validation, responsive column grids, and custom control mappings from simple JSON metadata.
  - `GpDynamicHeader` & `GpDynamicStats`: Dynamic headers with action callbacks and stat summary tiles.
- **100% Configurable & Localizable**:
  - Built-in internationalization tokens, translatable labels, RTL/LTR support, and customizable theming.

---

## Installation

```bash
npm install @generatedpixel/gp-blocks @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-css
```

---

## Quick Start

### 1. Using Pre-built Layouts & Blocks

```typescript
import { Component } from '@angular/core';
import { GpLayoutSidebarDarkComponent, GpDashboardSaasOverviewComponent } from '@generatedpixel/gp-blocks';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [GpLayoutSidebarDarkComponent, GpDashboardSaasOverviewComponent],
  template: `
    <gp-layout-sidebar-dark>
      <gp-dashboard-saas-overview />
    </gp-layout-sidebar-dark>
  `
})
export class AdminPageComponent {}
```

---

### 2. Using Dynamic JSON Form Engine

```typescript
import { Component } from '@angular/core';
import { GpDynamicFormComponent, GpFormSchema } from '@generatedpixel/gp-blocks';

@Component({
  selector: 'app-dynamic-registration',
  standalone: true,
  imports: [GpDynamicFormComponent],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <gp-dynamic-form [schema]="registrationSchema" (formSubmit)="handleFormSubmit($event)" />
    </div>
  `
})
export class DynamicRegistrationComponent {
  registrationSchema: GpFormSchema = {
    title: 'Create Account',
    description: 'Enter your credentials to get started with Generated Pixel.',
    fields: [
      { name: 'fullName', type: 'text', label: 'Full Name', required: true, colSpan: 6 },
      { name: 'email', type: 'email', label: 'Email Address', required: true, colSpan: 6 },
      {
        name: 'plan',
        type: 'select',
        label: 'Subscription Tier',
        options: [
          { label: 'Developer (Free)', value: 'free' },
          { label: 'Pro Team ($49/mo)', value: 'pro' },
          { label: 'Enterprise', value: 'enterprise' }
        ],
        colSpan: 12
      },
      { name: 'terms', type: 'checkbox', label: 'I agree to the terms and privacy policy', required: true, colSpan: 12 }
    ],
    submitLabel: 'Register Workspace'
  };

  handleFormSubmit(data: any): void {
    console.log('Submitted registration:', data);
  }
}
```

---

### 3. Using Dynamic Block Renderer

```typescript
import { Component } from '@angular/core';
import { GpDynamicBlockRendererComponent, GpBlockSchema } from '@generatedpixel/gp-blocks';

@Component({
  selector: 'app-dynamic-view',
  standalone: true,
  imports: [GpDynamicBlockRendererComponent],
  template: ` <gp-dynamic-block-renderer [schema]="pageBlockSchema" /> `
})
export class DynamicViewComponent {
  pageBlockSchema: GpBlockSchema = {
    type: 'dashboard',
    variant: 'saas-overview',
    title: 'Platform Analytics',
    options: {
      refreshInterval: 30000
    }
  };
}
```

---

## License

MIT © [Generated Pixel](https://generatedpixel.dev)
