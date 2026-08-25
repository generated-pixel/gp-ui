import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpToastComponent,
  GpToastService,
  GpMessageComponent,
  GpProgressBarComponent,
  GpProgressSpinnerComponent,
  GpSkeletonComponent,
  GpBadgeComponent,
  GpTagComponent
} from 'gp-ui';

@Component({
  selector: 'app-feedback-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpToastComponent,
    GpMessageComponent,
    GpProgressBarComponent,
    GpProgressSpinnerComponent,
    GpSkeletonComponent,
    GpBadgeComponent,
    GpTagComponent
  ],
  template: `
    <div class="page-container">
      <gp-toast />

      <div class="page-header">
        <h1>Messages & Feedback Components</h1>
        <p class="page-desc">Toast notifications, inline alerts, progress bars, loading spinners, skeletons, badges, and tags.</p>
      </div>

      <!-- Toast Notifications -->
      <div class="doc-section">
        <h2 class="doc-section-title">Toast Notifications (Service-Driven)</h2>
        <div class="doc-demo-box">
          <gp-button label="Success" severity="success" (onClickEvent)="showSuccessToast()" />
          <gp-button label="Info" severity="info" (onClickEvent)="showInfoToast()" />
          <gp-button label="Warning" severity="warning" (onClickEvent)="showWarnToast()" />
          <gp-button label="Error" severity="danger" (onClickEvent)="showErrorToast()" />
        </div>
      </div>

      <!-- Inline Messages -->
      <div class="doc-section">
        <h2 class="doc-section-title">Inline Messages</h2>
        <gp-message severity="success" text="Success: Your profile changes have been saved." [closable]="true" />
        <gp-message severity="info" text="Info: New system update scheduled for midnight." [closable]="true" />
        <gp-message severity="warning" text="Warning: Your storage is approaching 90% capacity." [closable]="true" />
        <gp-message severity="error" text="Error: Could not connect to remote database." [closable]="true" />
      </div>

      <!-- Progress & Spinners -->
      <div class="doc-section">
        <h2 class="doc-section-title">Progress Bar & Spinners</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <gp-progress-bar [value]="65" />
          <gp-progress-bar mode="indeterminate" />
          <div style="display: flex; gap: 1.5rem; align-items: center;">
            <gp-progress-spinner />
          </div>
        </div>
      </div>

      <!-- Skeletons -->
      <div class="doc-section">
        <h2 class="doc-section-title">Skeleton Loading Shimmers</h2>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <gp-skeleton shape="circle" width="3rem" height="3rem" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <gp-skeleton width="60%" height="1.2rem" />
            <gp-skeleton width="100%" height="0.9rem" />
          </div>
        </div>
      </div>

      <!-- Badges & Tags -->
      <div class="doc-section">
        <h2 class="doc-section-title">Badges & Tags</h2>
        <div class="doc-demo-box">
          <gp-badge value="8" severity="primary" />
          <gp-badge value="New" severity="success" />
          <gp-badge severity="danger" />
          <gp-tag value="Production" severity="success" [rounded]="true" icon="check" />
          <gp-tag value="Staging" severity="warning" [rounded]="true" icon="exclamation-triangle" />
          <gp-tag value="Archived" severity="secondary" [rounded]="true" />
        </div>
      </div>
    </div>
  `
})
export class FeedbackDemoComponent {
  private toastService = inject(GpToastService);

  public showSuccessToast(): void {
    this.toastService.success('Success', 'Action completed successfully!');
  }

  public showInfoToast(): void {
    this.toastService.info('Info', 'Here is helpful information.');
  }

  public showWarnToast(): void {
    this.toastService.warn('Warning', 'Please check your input values.');
  }

  public showErrorToast(): void {
    this.toastService.error('Error', 'An unexpected error occurred.');
  }
}
