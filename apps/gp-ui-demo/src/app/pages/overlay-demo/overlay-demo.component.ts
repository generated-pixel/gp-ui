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
    GpTooltipDirective
  ],
  template: `
    <div class="page-container">
      <gp-confirm-dialog />

      <div class="page-header">
        <h1>Overlay & Modal Components</h1>
        <p class="page-desc">Centralized overlay infrastructure with focus trapping, z-index management, and responsive placement.</p>
      </div>

      <!-- Dialog & Modals -->
      <div class="doc-section">
        <h2 class="doc-section-title">Dialog / Modal</h2>
        <div class="doc-demo-box">
          <gp-button label="Show Dialog" (onClickEvent)="dialog.show()" />
          <gp-button label="Confirmation Dialog" severity="danger" (onClickEvent)="confirmDelete()" />
          <gp-button label="Open Drawer (Left)" severity="secondary" (onClickEvent)="drawer.show()" />
          <gp-button label="Toggle Popover" severity="info" (onClickEvent)="popover.toggle($event)" />
          <gp-button label="Hover for Tooltip" [gpTooltip]="'This is an accessible tooltip!'" severity="contrast" />
        </div>
      </div>

      <!-- Dialog Component instance -->
      <gp-dialog #dialog header="User Profile Details" [maximizable]="true">
        <p>This is a fully accessible, focus-trapped dialog component with maximize, close, and custom footer actions.</p>
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
          <p style="font-size: 0.85rem; color: var(--gp-text-color-secondary); margin: 0 0 0.75rem 0;">Tethered floating overlay with auto-positioning.</p>
          <gp-button label="Got it" size="sm" (onClickEvent)="popover.hide()" />
        </div>
      </gp-popover>
    </div>
  `
})
export class OverlayDemoComponent {
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
}
