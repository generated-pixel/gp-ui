import { Component, inject } from '@angular/core';

import {
  GpButton,
  GpToast,
  GpToastService,
  GpMessage,
  GpProgressBar,
  GpProgressSpinner,
  GpSkeleton,
  GpBadge,
  GpTag
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-feedback-demo',
  standalone: true,
  imports: [
    GpButton,
    GpToast,
    GpMessage,
    GpProgressBar,
    GpProgressSpinner,
    GpSkeleton,
    GpBadge,
    GpTag,
    DocCode,
    DocApiTable
  ],
  templateUrl: './feedback-demo.html',
  styleUrl: './feedback-demo.scss'
})
export class FeedbackDemo {
  importCode = `import {
  GpToast,
  GpToastService,
  GpMessage,
  GpProgressBar,
  GpProgressSpinner,
  GpSkeleton,
  GpBadge,
  GpTag
} from '@generatedpixel/gp-ui';`;

  toastCode = `// Add <gp-toast /> once in your root app component template
export class My {
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

  messageProperties: DocApiProperty[] = getComponentDoc('message')?.properties ?? [];
  progressBarProperties: DocApiProperty[] = getComponentDoc('progress-bar')?.properties ?? [];
  progressSpinnerProperties: DocApiProperty[] = getComponentDoc('progress-spinner')?.properties ?? [];
  toastProperties: DocApiProperty[] = getComponentDoc('toast')?.properties ?? [];
  tagProperties: DocApiProperty[] = getComponentDoc('tag')?.properties ?? [];
  badgeProperties: DocApiProperty[] = getComponentDoc('badge')?.properties ?? [];
  skeletonProperties: DocApiProperty[] = getComponentDoc('skeleton')?.properties ?? [];
  announcementBarProperties: DocApiProperty[] = getComponentDoc('announcement-bar')?.properties ?? [];
}
