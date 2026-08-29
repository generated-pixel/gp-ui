import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpButtonSeverity } from '@generatedpixel/gp-ui';

@Component({
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
}
