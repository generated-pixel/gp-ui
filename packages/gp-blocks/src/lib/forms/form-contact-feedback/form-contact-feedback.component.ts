import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpSelectComponent,
  GpRatingComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-contact-feedback',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpSelectComponent,
    GpRatingComponent
  ],
  templateUrl: './form-contact-feedback.component.html',
  styleUrl: './form-contact-feedback.component.scss'
})
export class GpFormContactFeedbackComponent {
  @Input() title = 'Get in Touch';
  @Input() subtitle = 'Have a question or suggestions? We’d love to hear from you.';

  categories = [
    { label: 'Technical Support', value: 'tech_support' },
    { label: 'Enterprise Sales & Pricing', value: 'sales' },
    { label: 'Product Feedback & Feature Request', value: 'feedback' },
    { label: 'Security Disclosure', value: 'security' }
  ];
}
