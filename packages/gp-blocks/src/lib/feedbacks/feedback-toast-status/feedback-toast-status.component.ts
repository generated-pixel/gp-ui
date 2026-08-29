import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpToastStatusItem {
  id?: string;
  title: string;
  desc: string;
  severity: 'success' | 'info' | 'warning' | 'danger';
  icon?: string;
}

@Component({
  selector: 'gp-feedback-toast-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './feedback-toast-status.component.html',
  styleUrl: './feedback-toast-status.component.scss'
})
export class GpFeedbackToastStatusComponent {
  public toasts = input<GpToastStatusItem[]>([]);

  public closeToast = output<GpToastStatusItem>();
}
