import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpAlertBannerItem {
  id?: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  icon?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-feedback-alert-banners',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-alert-banners.component.html',
  styleUrl: './feedback-alert-banners.component.scss'
})
export class GpFeedbackAlertBannersComponent {
  public alerts = input<GpAlertBannerItem[]>([]);

  public dismiss = output<GpAlertBannerItem>();

  public alertTemplate = input<TemplateRef<{ $implicit: GpAlertBannerItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentAlertTemplate = contentChild<TemplateRef<{ $implicit: GpAlertBannerItem }>>('alertTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveAlertTemplate = computed(() => this.alertTemplate() || this.contentAlertTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
