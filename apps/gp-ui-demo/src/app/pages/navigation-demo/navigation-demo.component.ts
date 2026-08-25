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
    GpButtonComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Navigation Components</h1>
        <p class="page-desc">Menubar, Breadcrumb, Tabs, Stepper workflow, Toolbar, and animated Dock.</p>
      </div>

      <!-- Menubar -->
      <div class="doc-section">
        <h2 class="doc-section-title">Menubar</h2>
        <gp-menubar [model]="menubarItems">
          <div start>
            <strong style="margin-right: 1rem; color: var(--gp-primary);">GP-UI</strong>
          </div>
          <div end>
            <gp-button label="Sign In" size="sm" severity="primary" />
          </div>
        </gp-menubar>
      </div>

      <!-- Breadcrumb -->
      <div class="doc-section">
        <h2 class="doc-section-title">Breadcrumb</h2>
        <gp-breadcrumb [model]="breadcrumbItems" [home]="{ icon: 'home' }" />
      </div>

      <!-- Tabs -->
      <div class="doc-section">
        <h2 class="doc-section-title">Tabs (TabView)</h2>
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
      </div>

      <!-- Stepper -->
      <div class="doc-section">
        <h2 class="doc-section-title">Stepper Workflow</h2>
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
      </div>

      <!-- Toolbar -->
      <div class="doc-section">
        <h2 class="doc-section-title">Toolbar</h2>
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
      </div>

      <!-- Dock -->
      <div class="doc-section">
        <h2 class="doc-section-title">macOS-Style Dock</h2>
        <gp-dock [model]="dockItems" />
      </div>
    </div>
  `
})
export class NavigationDemoComponent {
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

  breadcrumbItems = [
    { label: 'Components' },
    { label: 'Navigation' },
    { label: 'Breadcrumb' }
  ];

  dockItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'search', label: 'Search' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'user', label: 'Profile' },
    { icon: 'sliders', label: 'Settings' }
  ];
}
