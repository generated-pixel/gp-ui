import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpRatingComponent } from '@generatedpixel/gp-ui';

@Component({
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public starsTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('stars') public contentStars?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveStars(): TemplateRef<any> | undefined {
    return this.starsTemplate || this.contentStars;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
