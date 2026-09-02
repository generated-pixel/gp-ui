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
import { GpButtonComponent, GpIconComponent, GpButtonSeverity } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-feedback-confirm-modals',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-confirm-modals.component.html',
  styleUrl: './feedback-confirm-modals.component.scss'
})
export class GpFeedbackConfirmModalsComponent {
  public icon = input<string>('trash');
  public iconSeverity = input<string>('icon-danger');
  public title = input<string>('');
  public message = input<string>('');
  public confirmBtnLabel = input<string>('Confirm');
  public cancelBtnLabel = input<string>('Cancel');
  public confirmSeverity = input<GpButtonSeverity>('danger');

  public confirm = output<void>();
  public cancel = output<void>();

  public iconTemplate = input<TemplateRef<any> | undefined>(undefined);
  public bodyTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentIcon = contentChild<TemplateRef<any>>('icon');
  public contentBody = contentChild<TemplateRef<any>>('body');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveIcon = computed(() => this.iconTemplate() || this.contentIcon());

  public effectiveBody = computed(() => this.bodyTemplate() || this.contentBody());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
