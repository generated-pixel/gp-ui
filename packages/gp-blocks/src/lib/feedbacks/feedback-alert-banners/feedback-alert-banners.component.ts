import { Component, input, output } from '@angular/core';
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
}
