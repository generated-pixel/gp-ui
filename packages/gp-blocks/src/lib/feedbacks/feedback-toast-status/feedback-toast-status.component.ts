import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

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
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-toast-status.component.html',
  styleUrl: './feedback-toast-status.component.scss'
})
export class GpFeedbackToastStatusComponent {
  public toasts = input<GpToastStatusItem[]>([]);

  public closeToast = output<GpToastStatusItem>();

  @Input() public toastTemplate?: TemplateRef<{ $implicit: GpToastStatusItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('toastTemplate') public contentToastTemplate?: TemplateRef<{ $implicit: GpToastStatusItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveToastTemplate(): TemplateRef<{ $implicit: GpToastStatusItem }> | undefined {
    return this.toastTemplate || this.contentToastTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
