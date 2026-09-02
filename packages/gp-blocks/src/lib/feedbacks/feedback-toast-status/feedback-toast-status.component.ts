import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-feedback-toast-status',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-toast-status.component.html',
  styleUrl: './feedback-toast-status.component.scss'
})
export class GpFeedbackToastStatusComponent {
  public toasts = input<GpToastStatusItem[]>([]);

  public closeToast = output<GpToastStatusItem>();

  public toastTemplate = input<TemplateRef<{ $implicit: GpToastStatusItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentToastTemplate = contentChild<TemplateRef<{ $implicit: GpToastStatusItem }>>('toastTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveToastTemplate = computed(() => this.toastTemplate() || this.contentToastTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
