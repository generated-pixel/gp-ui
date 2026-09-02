import { GpFeedbackBase, GpFeedbackSeverity } from '../../../base/gp-feedback-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-tag',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tag.html',
  styleUrl: './tag.scss'
})
export class GpTag extends GpFeedbackBase {
  public override severity = input<GpFeedbackSeverity>('primary');
  public rounded = input<boolean>(false);
}
