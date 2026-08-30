import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpAlertBannerItem {
  id?: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  message: string;
  icon?: string;
}

@Component({
  selector: 'gp-feedback-alert-banners',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './feedback-alert-banners.component.html',
  styleUrl: './feedback-alert-banners.component.scss'
})
export class GpFeedbackAlertBannersComponent {
  public alerts = input<GpAlertBannerItem[]>([]);

  public dismiss = output<GpAlertBannerItem>();

  @Input() public alertTemplate?: TemplateRef<{ $implicit: GpAlertBannerItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('alertTemplate') public contentAlertTemplate?: TemplateRef<{ $implicit: GpAlertBannerItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveAlertTemplate(): TemplateRef<{ $implicit: GpAlertBannerItem }> | undefined {
    return this.alertTemplate || this.contentAlertTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
