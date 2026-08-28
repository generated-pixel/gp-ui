import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpMenubarComponent,
  GpBreadcrumbComponent,
  GpTabsComponent,
  GpTabPanelComponent,
  GpStepperComponent,
  GpStepComponent,
  GpDockComponent,
  GpToolbarComponent,
  GpButtonComponent,
  GpMenubarItem
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-navigation-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpMenubarComponent,
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
          Header Menubars, Context Menus, Breadcrumbs, TabView Panels, Multi-Step Wizards, Toolbars, and macOS-style
          animated Docks.
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
          Top application navigation bar with nested sub-menus and custom start/end content templates.
        </p>
        <gp-menubar [model]="menubarItems">
          <div start>
            <strong style="margin-right: 1rem; color: var(--gp-primary);">GP-UI</strong>
          </div>
          <div end>
            <gp-button label="Sign In" size="sm" severity="primary" />
          </div>
        </gp-menubar>
        <doc-code [code]="menubarCode" language="html" />
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
        <h2 class="doc-section-title">Toolbar & Dock</h2>
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
        { label: 'Open', icon: 'folder-open' },
        { separator: true },
        { label: 'Export', icon: 'download' }
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

  breadcrumbItems = [{ label: 'Components' }, { label: 'Navigation' }, { label: 'Breadcrumb' }];

  dockItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'search', label: 'Search' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'user', label: 'Profile' },
    { icon: 'sliders', label: 'Settings' }
  ];

  tabsProperties: DocApiProperty[] = [
    { name: 'activeIndex', type: 'number', default: '0', description: 'Zero-based index of the currently active tab.' },
    { name: 'styleClass', type: 'string', default: "''", description: 'Custom CSS classes applied to tab wrapper.' }
  ];

  stepperProperties: DocApiProperty[] = [
    { name: 'activeStep', type: 'number', default: '0', description: 'Zero-based index of the active step.' },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Layout orientation of the stepper.'
    },
    {
      name: 'linear',
      type: 'boolean',
      default: 'false',
      description: 'Enforces strictly sequential forward progression.'
    }
  ];
}
