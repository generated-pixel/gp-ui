import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpRatingComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-feedback-rating-review',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpRatingComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public starsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentStars = contentChild<TemplateRef<any>>('stars');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveStars = computed(() => this.starsTemplate() || this.contentStars());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
