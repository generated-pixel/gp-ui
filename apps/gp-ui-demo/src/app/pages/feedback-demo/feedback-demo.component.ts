import { Component, inject } from '@angular/core';

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
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-feedback-demo',
  standalone: true,
  imports: [
    GpButtonComponent,
    GpToastComponent,
    GpMessageComponent,
    GpProgressBarComponent,
    GpProgressSpinnerComponent,
    GpSkeletonComponent,
    GpBadgeComponent,
    GpTagComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <gp-toast />

      <div class="page-header">
        <h1>Messages & Feedback Indicators</h1>
        <p class="page-desc">
          User feedback mechanisms including service-driven toast alerts, inline contextual messages,
          determinate/indeterminate progress indicators, animated skeleton loaders, badges, and status tags.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import feedback components and toast service:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Toast Notifications -->
      <div class="doc-section">
        <h2 class="doc-section-title">Toast Notifications (Service-Driven)</h2>
        <p class="doc-section-desc">Trigger animated popup toasts anywhere across your Angular application:</p>
        <div class="doc-demo-box">
          <gp-button label="Success" severity="success" (onClickEvent)="showSuccessToast()" />
          <gp-button label="Info" severity="info" (onClickEvent)="showInfoToast()" />
          <gp-button label="Warning" severity="warning" (onClickEvent)="showWarnToast()" />
          <gp-button label="Error" severity="danger" (onClickEvent)="showErrorToast()" />
        </div>
        <doc-code [code]="toastCode" language="typescript" />
      </div>

      <!-- Inline Messages -->
      <div class="doc-section">
        <h2 class="doc-section-title">Inline Contextual Messages</h2>
        <p class="doc-section-desc">Embedded callout alert banners with optional dismiss button.</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <gp-message severity="success" text="Success: Your profile changes have been saved." [closable]="true" />
          <gp-message severity="info" text="Info: New system update scheduled for midnight." [closable]="true" />
          <gp-message severity="warning" text="Warning: Your storage is approaching 90% capacity." [closable]="true" />
          <gp-message severity="error" text="Error: Could not connect to remote database." [closable]="true" />
        </div>
        <doc-code [code]="messageCode" language="html" />
      </div>

      <!-- Progress & Spinners -->
      <div class="doc-section">
        <h2 class="doc-section-title">Progress Bars & Spinners</h2>
        <p class="doc-section-desc">Visual progress and async activity spinners.</p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <gp-progress-bar [value]="65" />
          <gp-progress-bar mode="indeterminate" />
          <div style="display: flex; gap: 1.5rem; align-items: center;">
            <gp-progress-spinner />
          </div>
        </div>
        <doc-code [code]="progressCode" language="html" />
      </div>

      <!-- Skeletons -->
      <div class="doc-section">
        <h2 class="doc-section-title">Skeleton Loading Shimmers</h2>
        <p class="doc-section-desc">Placeholder shimmer layout while asynchronous data is fetching.</p>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <gp-skeleton shape="circle" width="3rem" height="3rem" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <gp-skeleton width="60%" height="1.2rem" />
            <gp-skeleton width="100%" height="0.9rem" />
          </div>
        </div>
        <doc-code [code]="skeletonCode" language="html" />
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
        <doc-code [code]="badgeTagCode" language="html" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpMessageComponent Properties (Inputs)" [properties]="messageProperties" />
        <doc-api-table title="GpProgressBarComponent Properties (Inputs)" [properties]="progressBarProperties" />
      </div>
    </div>
  `
})
export class FeedbackDemoComponent {
  importCode = `import {
  GpToastComponent,
  GpToastService,
  GpMessageComponent,
  GpProgressBarComponent,
  GpProgressSpinnerComponent,
  GpSkeletonComponent,
  GpBadgeComponent,
  GpTagComponent
} from '@generatedpixel/gp-ui';`;

  toastCode = `// Add <gp-toast /> once in your root app component template
export class MyComponent {
  private toast = inject(GpToastService);

  showToast(): void {
    this.toast.success('Saved', 'Record updated successfully!');
  }
}`;

  messageCode = `<gp-message severity="success" text="Success alert message" [closable]="true" />
<gp-message severity="error" text="Failed to process request" />`;

  progressCode = `<gp-progress-bar [value]="65" />
<gp-progress-bar mode="indeterminate" />
<gp-progress-spinner />`;

  skeletonCode = `<gp-skeleton shape="circle" width="3rem" height="3rem" />
<gp-skeleton width="60%" height="1.2rem" />`;

  badgeTagCode = `<gp-badge value="5" severity="primary" />
<gp-tag value="Active" severity="success" [rounded]="true" icon="check" />`;

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

  messageProperties: DocApiProperty[] = [
    {
      name: 'severity',
      type: "'success' | 'info' | 'warning' | 'error'",
      default: "'info'",
      description: 'Semantic color severity.'
    },
    { name: 'text', type: 'string', default: "''", description: 'Message body text.' },
    { name: 'closable', type: 'boolean', default: 'false', description: 'Renders a close dismissal icon.' }
  ];

  progressBarProperties: DocApiProperty[] = [
    { name: 'value', type: 'number', default: '0', description: 'Percentage completion (0 to 100).' },
    {
      name: 'mode',
      type: "'determinate' | 'indeterminate'",
      default: "'determinate'",
      description: 'Animation behavior.'
    }
  ];
}
