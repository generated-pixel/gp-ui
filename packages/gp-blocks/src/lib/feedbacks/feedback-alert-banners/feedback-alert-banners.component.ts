import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-alert-banners',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './feedback-alert-banners.component.html',
  styleUrl: './feedback-alert-banners.component.scss'
})
export class GpFeedbackAlertBannersComponent {}
