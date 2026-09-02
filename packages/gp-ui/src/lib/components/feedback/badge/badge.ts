import { GpFeedbackBase, GpFeedbackSeverity, GpFeedbackSize } from '../../../base/gp-feedback-base';
import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpBadgeSeverity = GpFeedbackSeverity;
export type GpBadgeSize = GpFeedbackSize;

@Component({
  selector: 'gp-badge',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class GpBadge extends GpFeedbackBase {
  public override severity = input<GpBadgeSeverity>('primary');
  public tooltip = input<string | undefined>(undefined);

  public displayTitle = computed(() => {
    if (this.tooltip() !== undefined) {
      return this.tooltip() || null;
    }
    const val = this.value();
    return val !== undefined && val !== null ? String(val) : null;
  });
}
