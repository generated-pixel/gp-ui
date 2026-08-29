import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-rating-review',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-rating-review.component.html',
  styleUrl: './feedback-rating-review.component.scss'
})
export class GpFeedbackRatingReviewComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public dismissBtnLabel = input<string>('Not Now');
  public submitBtnLabel = input<string>('Submit Feedback');

  public rating = signal<number>(5);

  public dismiss = output<void>();
  public submitRating = output<number>();
}
