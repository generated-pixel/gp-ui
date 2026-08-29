import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpRatingComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-rating-review',
  standalone: true,
  imports: [CommonModule, GpRatingComponent, GpButtonComponent],
  templateUrl: './feedback-rating-review.component.html',
  styleUrl: './feedback-rating-review.component.scss'
})
export class GpFeedbackRatingReviewComponent {
  @Input() title = 'How satisfied are you with gp-ui?';
  @Input() subtitle = 'Your feedback helps us continuously improve components and design tokens.';
  rating = 5;
}
