import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpDialogComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpDrawerComponent,
  GpPopoverComponent,
  GpTooltipDirective
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpDialogComponent,
    GpConfirmDialogComponent,
    GpDrawerComponent,
    GpPopoverComponent,
    GpTooltipDirective,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <gp-confirm-dialog />

      <div class="page-header">
        <h1>Overlay & Modal Components</h1>
        <p class="page-desc">
          Centralized overlay infrastructure featuring focus trapping, dynamic z-index layering, off-canvas drawers,
          popovers, and programmatic confirmation dialogs.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import overlay components and services:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Live Overlays Demo -->
      <div class="doc-section">
        <h2 class="doc-section-title">Interactive Overlays</h2>
        <p class="doc-section-desc">
          Click below to trigger modal dialogs, programmatic confirm dialogs, slide-out drawers, popovers, and tooltips:
        </p>
        <div class="doc-demo-box">
          <gp-button label="Show Dialog" (onClickEvent)="dialog.show()" />
          <gp-button label="Confirmation Dialog" severity="danger" (onClickEvent)="confirmDelete()" />
          <gp-button label="Open Drawer (Left)" severity="secondary" (onClickEvent)="drawer.show()" />
          <gp-button label="Toggle Popover" severity="info" (onClickEvent)="popover.toggle($event)" />
          <gp-button label="Hover for Tooltip" [gpTooltip]="'This is an accessible tooltip!'" severity="contrast" />
        </div>
        <doc-code [code]="overlayCode" language="html" />
      </div>

      <!-- Dialog Component instance -->
      <gp-dialog #dialog header="User Profile Details" [maximizable]="true">
        <p>
          This is a fully accessible, focus-trapped dialog component with maximize, close, and custom footer actions.
        </p>
        <div footer>
          <gp-button label="Cancel" variant="outlined" severity="secondary" (onClickEvent)="dialog.close()" />
          <gp-button label="Save" severity="primary" (onClickEvent)="dialog.close()" />
        </div>
      </gp-dialog>

      <!-- Drawer Component instance -->
      <gp-drawer #drawer header="Sidebar Navigation" position="left">
        <p>Off-canvas sliding drawer with smooth animations and backdrop mask.</p>
      </gp-drawer>

      <!-- Popover Component instance -->
      <gp-popover #popover>
        <div style="padding: 0.25rem;">
          <h4 style="margin: 0 0 0.5rem 0;">Quick Actions</h4>
          <p style="font-size: 0.85rem; color: var(--gp-text-color-secondary); margin: 0 0 0.75rem 0;">
            Tethered floating overlay with auto-positioning.
          </p>
          <gp-button label="Got it" size="sm" (onClickEvent)="popover.hide()" />
        </div>
      </gp-popover>

      <!-- Programmatic Confirmation Service Guide -->
      <div class="doc-section">
        <h2 class="doc-section-title">Programmatic Confirmation Dialog Guide</h2>
        <p class="doc-section-desc">
          Trigger confirmation prompts from TypeScript using <code>GpConfirmationService</code>:
        </p>
        <doc-code [code]="confirmServiceCode" language="typescript" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpDialogComponent Properties (Inputs)" [properties]="dialogProperties" />
        <doc-api-table title="GpDrawerComponent Properties (Inputs)" [properties]="drawerProperties" />
      </div>
    </div>
  `
})
export class OverlayDemoComponent {
  importCode = `import {
  GpDialogComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpDrawerComponent,
  GpPopoverComponent,
  GpTooltipDirective
} from '@generatedpixel/gp-ui';`;

  overlayCode = `<!-- Modal Dialog -->
<gp-button label="Show Dialog" (onClickEvent)="dialog.show()" />
<gp-dialog #dialog header="Dialog Title" [maximizable]="true">
  <p>Dialog body content...</p>
  <div footer>
    <gp-button label="Close" (onClickEvent)="dialog.close()" />
  </div>
</gp-dialog>

<!-- Tooltip Directive -->
<gp-button label="Hover me" [gpTooltip]="'Helpful tooltip information'" />`;

  confirmServiceCode = `export class MyComponent {
  private confirmationService = inject(GpConfirmationService);

  deleteItem(): void {
    this.confirmationService.confirm({
      header: 'Delete Item',
      message: 'Are you sure you want to proceed?',
      icon: 'exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => console.log('Deleted!')
    });
  }
}`;

  private confirmationService = inject(GpConfirmationService);

  public confirmDelete(): void {
    this.confirmationService.confirm({
      header: 'Delete Record',
      message: 'Are you sure you want to permanently delete this customer?',
      icon: 'exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => alert('Record deleted!')
    });
  }

  dialogProperties: DocApiProperty[] = [
    { name: 'header', type: 'string', default: "''", description: 'Title text in dialog header bar.' },
    { name: 'visible', type: 'boolean', default: 'false', description: 'Controls modal open/close state.' },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: 'Renders a backdrop overlay mask behind the dialog.'
    },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Renders a top-right close icon button.' },
    {
      name: 'maximizable',
      type: 'boolean',
      default: 'false',
      description: 'Renders a maximize/restore viewport toggle.'
    }
  ];

  drawerProperties: DocApiProperty[] = [
    { name: 'header', type: 'string', default: "''", description: 'Header title text.' },
    {
      name: 'position',
      type: "'left' | 'right' | 'top' | 'bottom'",
      default: "'left'",
      description: 'Sliding origin side.'
    },
    { name: 'visible', type: 'boolean', default: 'false', description: 'Controls drawer open/close visibility.' }
  ];
}
