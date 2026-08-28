import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpMenubarComponent,
  GpMenuComponent,
  GpContextMenuComponent,
  GpTieredMenuComponent,
  GpMegaMenuComponent,
  GpPanelMenuComponent,
  GpBreadcrumbComponent,
  GpTabsComponent,
  GpTabPanelComponent,
  GpStepperComponent,
  GpStepComponent,
  GpDockComponent,
  GpToolbarComponent,
  GpButtonComponent,
  GpMenubarItem,
  GpMegaMenuItem,
  GpMenuItem
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-navigation-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpMenubarComponent,
    GpMenuComponent,
    GpContextMenuComponent,
    GpTieredMenuComponent,
    GpMegaMenuComponent,
    GpPanelMenuComponent,
    GpBreadcrumbComponent,
    GpTabsComponent,
    GpTabPanelComponent,
    GpStepperComponent,
    GpStepComponent,
    GpDockComponent,
    GpToolbarComponent,
    GpButtonComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Navigation Components</h1>
        <p class="page-desc">
          Header Menubars, Context Menus, Breadcrumbs, TabView Panels, Multi-Step Wizards, Tiered Menus, Mega Menus, Panel Menus, Toolbars, and macOS-style animated Docks.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import navigation components in your standalone component:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Menubar -->
      <div class="doc-section">
        <h2 class="doc-section-title">Menubar (Multi-Level Navigation)</h2>
        <p class="doc-section-desc">
          Top application navigation bar with multi-level nested sub-menus, badges, click/hover toggle, and custom start/end content templates.
        </p>
        <gp-menubar [model]="menubarItems">
          <div start>
            <strong style="margin-right: 1rem; color: var(--gp-primary); font-size: 1.1rem;">GP-UI</strong>
          </div>
          <div end>
            <gp-button label="Sign In" size="sm" severity="primary" />
          </div>
        </gp-menubar>
        <doc-code [code]="menubarCode" language="html" />
      </div>

      <!-- Menu & TieredMenu -->
      <div class="doc-section">
        <h2 class="doc-section-title">Menu &amp; Tiered Menu</h2>
        <p class="doc-section-desc">
          Inline and popup menus with multi-tier flyout sub-levels and click-outside dismissal.
        </p>
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start;">
          <div>
            <h4 style="margin: 0 0 0.75rem 0;">Inline Menu</h4>
            <gp-menu [model]="menuItems" />
          </div>
          <div>
            <h4 style="margin: 0 0 0.75rem 0;">Tiered Menu (Flyouts)</h4>
            <gp-tiered-menu [model]="tieredMenuItems" />
          </div>
          <div>
            <h4 style="margin: 0 0 0.75rem 0;">Popup Tiered Menu</h4>
            <gp-button label="Open Tiered Menu" icon="bars" (onClickEvent)="popupTieredMenu.toggle($event)" />
            <gp-tiered-menu #popupTieredMenu [model]="tieredMenuItems" [popup]="true" />
          </div>
        </div>
      </div>

      <!-- MegaMenu -->
      <div class="doc-section">
        <h2 class="doc-section-title">Mega Menu</h2>
        <p class="doc-section-desc">
          Full-width or multi-column grid dropdown navigation ideal for complex application sites.
        </p>
        <gp-mega-menu [model]="megaMenuItems" />
      </div>

      <!-- PanelMenu -->
      <div class="doc-section">
        <h2 class="doc-section-title">Panel Menu (Accordion Navigation)</h2>
        <p class="doc-section-desc">
          Collapsible vertical tree navigation with animated headers and nested sub-tiers.
        </p>
        <div style="max-width: 320px;">
          <gp-panel-menu [model]="panelMenuItems" />
        </div>
      </div>

      <!-- Context Menu -->
      <div class="doc-section">
        <h2 class="doc-section-title">Context Menu</h2>
        <p class="doc-section-desc">Right-click anywhere inside the interactive target area below to display the contextual popup menu.</p>
        <div
          (contextmenu)="contextMenu.show($event)"
          style="padding: 2.5rem; border: 2px dashed var(--gp-surface-border); border-radius: 8px; cursor: context-menu; text-align: center; background: var(--gp-surface-card);"
        >
          <strong style="color: var(--gp-primary);">Right-click here</strong> to open the Context Menu with nested actions.
          <gp-context-menu #contextMenu [model]="contextMenuItems" />
        </div>
      </div>

      <!-- Breadcrumb -->
      <div class="doc-section">
        <h2 class="doc-section-title">Breadcrumb</h2>
        <p class="doc-section-desc">Hierarchical trail showing the current page location within the app hierarchy.</p>
        <gp-breadcrumb [model]="breadcrumbItems" [home]="{ icon: 'home' }" />
        <doc-code [code]="breadcrumbCode" language="html" />
      </div>

      <!-- Tabs -->
      <div class="doc-section">
        <h2 class="doc-section-title">Tabs (TabView)</h2>
        <p class="doc-section-desc">Tabbed interface with icons, close buttons, and lazy content projection.</p>
        <gp-tabs>
          <gp-tab-panel header="Dashboard" icon="window" [selected]="true">
            <p>Welcome to your central application dashboard with real-time metrics.</p>
          </gp-tab-panel>
          <gp-tab-panel header="Analytics" icon="sliders">
            <p>Interactive analytics charts and performance reports.</p>
          </gp-tab-panel>
          <gp-tab-panel header="Settings" icon="palette" [closable]="true">
            <p>Manage application preferences, notifications, and security keys.</p>
          </gp-tab-panel>
        </gp-tabs>
        <doc-code [code]="tabsCode" language="html" />
      </div>

      <!-- Stepper -->
      <div class="doc-section">
        <h2 class="doc-section-title">Stepper Workflow</h2>
        <p class="doc-section-desc">Multi-step guided wizard with step validation and linear progression support.</p>
        <gp-stepper #stepper>
          <gp-step label="Personal Info" [active]="true">
            <p>Step 1: Fill out your basic contact details.</p>
            <gp-button label="Next Step" (onClickEvent)="stepper.next()" />
          </gp-step>
          <gp-step label="Payment Method">
            <p>Step 2: Enter payment information securely.</p>
            <div style="display: flex; gap: 0.5rem;">
              <gp-button label="Back" variant="outlined" severity="secondary" (onClickEvent)="stepper.prev()" />
              <gp-button label="Next Step" (onClickEvent)="stepper.next()" />
            </div>
          </gp-step>
          <gp-step label="Confirmation">
            <p>Step 3: Review and place your order.</p>
            <gp-button label="Back" variant="outlined" severity="secondary" (onClickEvent)="stepper.prev()" />
          </gp-step>
        </gp-stepper>
        <doc-code [code]="stepperCode" language="html" />
      </div>

      <!-- Toolbar & Dock -->
      <div class="doc-section">
        <h2 class="doc-section-title">Toolbar &amp; Dock</h2>
        <gp-toolbar>
          <div start>
            <gp-button label="New" icon="plus" severity="success" size="sm" />
            <gp-button label="Upload" icon="upload" severity="secondary" size="sm" />
          </div>
          <div end>
            <gp-button icon="search" [iconOnly]="true" severity="secondary" size="sm" />
            <gp-button icon="trash" [iconOnly]="true" severity="danger" size="sm" />
          </div>
        </gp-toolbar>

        <h3 style="margin-top: 1.5rem;">Animated Dock</h3>
        <gp-dock [model]="dockItems" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpTabsComponent Properties (Inputs)" [properties]="tabsProperties" />
        <doc-api-table title="GpStepperComponent Properties (Inputs)" [properties]="stepperProperties" />
      </div>
    </div>
  `
})
export class NavigationDemoComponent {
  importCode = `import {
  GpMenubarComponent,
  GpMenuComponent,
  GpContextMenuComponent,
  GpTieredMenuComponent,
  GpMegaMenuComponent,
  GpPanelMenuComponent,
  GpTabsComponent,
  GpTabPanelComponent,
  GpStepperComponent,
  GpStepComponent,
  GpBreadcrumbComponent,
  GpDockComponent,
  GpToolbarComponent
} from '@generatedpixel/gp-ui';`;

  menubarCode = `<gp-menubar [model]="menubarItems">
  <div start><strong>MyApp</strong></div>
  <div end><gp-button label="Profile" size="sm" /></div>
</gp-menubar>`;

  breadcrumbCode = `<gp-breadcrumb [model]="breadcrumbItems" [home]="{ icon: 'home' }" />`;

  tabsCode = `<gp-tabs>
  <gp-tab-panel header="Overview" icon="home">Overview tab content...</gp-tab-panel>
  <gp-tab-panel header="Settings" icon="sliders" [closable]="true">Settings tab content...</gp-tab-panel>
</gp-tabs>`;

  stepperCode = `<gp-stepper #stepper>
  <gp-step label="Step 1">
    <p>Step 1 content...</p>
    <gp-button label="Next" (onClickEvent)="stepper.next()" />
  </gp-step>
  <gp-step label="Step 2">
    <p>Step 2 content...</p>
  </gp-step>
</gp-stepper>`;

  menubarItems: GpMenubarItem[] = [
    {
      label: 'File',
      icon: 'file',
      items: [
        { label: 'New Project', icon: 'plus' },
        {
          label: 'Open',
          icon: 'folder-open',
          items: [
            { label: 'Workspace', icon: 'window' },
            { label: 'Recent Files', icon: 'clock' }
          ]
        },
        { separator: true },
        { label: 'Export', icon: 'download', badge: 'PRO' }
      ]
    },
    {
      label: 'Edit',
      icon: 'edit',
      items: [
        { label: 'Undo', icon: 'refresh' },
        { label: 'Copy', icon: 'copy' }
      ]
    },
    { label: 'Users', icon: 'user' },
    { label: 'Settings', icon: 'sliders' }
  ];

  menuItems: GpMenuItem[] = [
    { label: 'Dashboard', icon: 'home' },
    { label: 'Messages', icon: 'envelope', badge: '3' },
    { label: 'Settings', icon: 'sliders' },
    { separator: true },
    { label: 'Logout', icon: 'sign-out' }
  ];

  tieredMenuItems: GpMenubarItem[] = [
    {
      label: 'File',
      icon: 'file',
      items: [
        { label: 'New Document', icon: 'plus' },
        {
          label: 'Export As',
          icon: 'download',
          items: [
            { label: 'PDF Document', icon: 'file' },
            { label: 'CSV Sheet', icon: 'table' },
            { label: 'JSON Data', icon: 'code' }
          ]
        }
      ]
    },
    {
      label: 'Edit',
      icon: 'edit',
      items: [
        { label: 'Undo', icon: 'refresh' },
        { label: 'Redo', icon: 'refresh' }
      ]
    },
    { label: 'Help', icon: 'question-circle' }
  ];

  megaMenuItems: GpMegaMenuItem[] = [
    {
      label: 'Products',
      icon: 'window',
      root: true,
      columns: [
        {
          label: 'UI Framework',
          icon: 'palette',
          items: [
            {
              label: 'Buttons & Actions',
              icon: 'check',
              description: 'Interactive buttons, split triggers & speed dials',
              iconColor: '#6366f1',
              iconBg: 'rgba(99, 102, 241, 0.12)',
              badge: 'NEW',
              badgeSeverity: 'success'
            },
            {
              label: 'Form Controls',
              icon: 'edit',
              description: '20+ accessible form components with signals',
              iconColor: '#0ea5e9',
              iconBg: 'rgba(14, 165, 233, 0.12)'
            },
            {
              label: 'Data Tables',
              icon: 'table',
              description: 'Sorting, filtering, pagination & virtual scroll',
              iconColor: '#10b981',
              iconBg: 'rgba(16, 185, 129, 0.12)'
            }
          ]
        },
        {
          label: 'Platform Services',
          icon: 'sliders',
          items: [
            {
              label: 'Theme Engine',
              icon: 'sliders',
              description: '8 curated color palettes with dark mode support',
              iconColor: '#f59e0b',
              iconBg: 'rgba(245, 158, 11, 0.12)'
            },
            {
              label: 'Cloud Sync',
              icon: 'folder',
              description: 'Real-time reactive state synchronization',
              iconColor: '#8b5cf6',
              iconBg: 'rgba(139, 92, 246, 0.12)'
            },
            {
              label: 'Enterprise Security',
              icon: 'lock',
              description: 'Role-based access control & SOC2 compliance',
              iconColor: '#ec4899',
              iconBg: 'rgba(236, 72, 153, 0.12)'
            }
          ],
          featured: {
            title: 'GP-UI Enterprise Suite',
            description: 'Unlock 75+ advanced components, templates & priority SLA support.',
            actionLabel: 'Learn More'
          }
        }
      ]
    },
    {
      label: 'Solutions',
      icon: 'layer-group',
      root: true,
      columns: [
        {
          label: 'By Use Case',
          items: [
            {
              label: 'Admin Dashboards',
              icon: 'window',
              description: 'High-density metrics, tables, and analytics'
            },
            {
              label: 'Design Systems',
              icon: 'palette',
              description: 'Tokenized multi-brand styling architecture'
            }
          ]
        },
        {
          label: 'By Industry',
          items: [
            {
              label: 'Fintech & Banking',
              icon: 'dollar-sign',
              description: 'Strict security, validation & real-time streams'
            },
            {
              label: 'Healthcare',
              icon: 'heart',
              description: 'HIPAA-compliant, accessible interfaces'
            }
          ]
        }
      ]
    },
    {
      label: 'Documentation',
      icon: 'file',
      routerLink: '/getting-started'
    }
  ];

  panelMenuItems: GpMenubarItem[] = [
    {
      label: 'Documents',
      icon: 'folder',
      items: [
        {
          label: 'Work',
          icon: 'folder',
          items: [
            { label: 'Resume.pdf', icon: 'file' },
            { label: 'Proposal.docx', icon: 'file' }
          ]
        },
        { label: 'Personal', icon: 'folder' }
      ]
    },
    {
      label: 'Settings',
      icon: 'sliders',
      items: [
        { label: 'Profile', icon: 'user' },
        { label: 'Security', icon: 'lock' },
        { label: 'Billing', icon: 'dollar-sign' }
      ]
    }
  ];

  contextMenuItems: GpMenuItem[] = [
    { label: 'Cut', icon: 'cut' },
    { label: 'Copy', icon: 'copy' },
    { label: 'Paste', icon: 'paste' },
    { separator: true },
    {
      label: 'Share',
      icon: 'share-alt',
      items: [
        { label: 'Copy Link', icon: 'link' },
        { label: 'Email Report', icon: 'envelope' }
      ]
    },
    { separator: true },
    { label: 'Delete', icon: 'trash' }
  ];

  breadcrumbItems = [{ label: 'Components' }, { label: 'Navigation' }, { label: 'Breadcrumb' }];

  dockItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'search', label: 'Search' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'user', label: 'Profile' },
    { icon: 'sliders', label: 'Settings' }
  ];

  tabsProperties: DocApiProperty[] = [
    { name: 'activeIndex', type: 'model<number>', default: '0', description: 'Zero-based index model of the currently active tab.' },
    { name: 'styleClass', type: 'input<string>', default: "''", description: 'Custom CSS classes applied to tab wrapper.' }
  ];

  stepperProperties: DocApiProperty[] = [
    { name: 'activeStep', type: 'model<number>', default: '0', description: 'Zero-based index model of the active step.' },
    {
      name: 'orientation',
      type: "input<'horizontal' | 'vertical'>",
      default: "'horizontal'",
      description: 'Layout orientation of the stepper.'
    },
    {
      name: 'linear',
      type: 'input<boolean>',
      default: 'false',
      description: 'Enforces strictly sequential forward progression.'
    }
  ];
}
