# @generatedpixel/gp-blocks

> Enterprise Reusable UI Blocks & Dynamic JSON Metadata Engine for Angular, built natively on `gp-ui`, `gp-ui-theme`, `gp-ui-icons`, and `gp-css`.

## Features

- **50+ Pre-built Reusable Blocks** across 10 categories:
  - **Application Layouts**: 4 Multi-column layouts, 14 Sidebar layouts, 6 Stacked layouts.
  - **Dashboards**: SaaS Overview, Ecommerce, Analytics, Finance, Project Management, Operations.
  - **Settings & Details**: User Profile, Security/2FA, Billing, Notifications, Team Roles, API Keys, Danger Zone, Customer Overview, Order Summary.
  - **Headings & Page Headers**: Page headers with breadcrumbs/actions, Search & filter headers, Tabbed section headers, KPI stat headers, Profile banners.
  - **Data Displays**: KPI Stat Cards, Key-Value Description Lists, Timeline Activity Streams, Meter Groups, Badge Clusters, Stats Counters.
  - **Lists**: Data Grids with sort/filter/pagination, Stacked Feeds, Card Grids, Transaction Ledgers, User Directories, File Attachment Lists.
  - **Forms**: Multi-Step Stepper Wizards, Split Auth (Login/Register), Profile Forms, Checkout/Billing, Contact Feedback, Advanced Filter Builders.
  - **Feedbacks**: Alert Banners, Empty States, Confirm Dialogs, Toast Status triggers, Customer Rating prompts.
  - **Navigations & Overlays**: Responsive Topbars, Command Palette modal, Slide-Over Drawers, Dropdown Action menus, Mega Menus, Tab Navigation.
  - **Basic Pages**: 404 Not Found, 500 Server Error, 403 Forbidden, Maintenance Mode, Coming Soon, Success / Confirmation.
- **Dynamic JSON Metadata Engine**:
  - `GpDynamicBlockRenderer`: Render complete layouts, headers, and views from declarative JSON schemas.
  - `GpDynamicForm`: Render reactive forms with real-time validation, responsive column grids, and custom control mappings from simple JSON metadata.
- **100% Configurable & Localizable**:
  - Built-in internationalization tokens, translatable labels, RTL/LTR support, and customizable theming.

## Installation

```bash
npm install @generatedpixel/gp-blocks @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-css
```

## Quick Start

### 1. Using Pre-built Blocks

```typescript
import { Component } from '@angular/core';
import { GpLayoutSidebarDarkComponent, GpDashboardSaasOverviewComponent } from '@generatedpixel/gp-blocks';

@Component({
  standalone: true,
  imports: [GpLayoutSidebarDarkComponent, GpDashboardSaasOverviewComponent],
  template: `
    <gp-layout-sidebar-dark>
      <gp-dashboard-saas-overview />
    </gp-layout-sidebar-dark>
  `
})
export class MyPageComponent {}
```

### 2. Using Dynamic JSON Schema Engine

```typescript
import { Component } from '@angular/core';
import { GpDynamicFormComponent, GpFormSchema } from '@generatedpixel/gp-blocks';

@Component({
  standalone: true,
  imports: [GpDynamicFormComponent],
  template: `
    <gp-dynamic-form [schema]="myFormSchema" (formSubmit)="onSubmit($event)" />
  `
})
export class MyDynamicPage {
  myFormSchema: GpFormSchema = {
    title: 'Account Registration',
    fields: [
      { name: 'username', type: 'text', label: 'Username', required: true, colSpan: 6 },
      { name: 'email', type: 'text', label: 'Email Address', required: true, colSpan: 6 },
      { name: 'bio', type: 'textarea', label: 'Biography', colSpan: 12 }
    ],
    submitLabel: 'Create Account'
  };

  onSubmit(data: any) {
    console.log('Form data:', data);
  }
}
```

## License

MIT © Generated Pixel
