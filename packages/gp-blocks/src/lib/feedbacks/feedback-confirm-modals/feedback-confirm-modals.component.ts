import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-confirm-modals',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-confirm-modals.component.html',
  styleUrl: './feedback-confirm-modals.component.scss'
})
export class GpFeedbackConfirmModalsComponent {
  @Input() title = 'Deactivate cluster deployment?';
  @Input() message = 'Are you sure you want to deactivate and remove us-east-cluster-01? All running pods and in-flight client sessions will be immediately terminated.';
}
