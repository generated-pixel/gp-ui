import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-toast-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './feedback-toast-status.component.html',
  styleUrl: './feedback-toast-status.component.scss'
})
export class GpFeedbackToastStatusComponent {}
