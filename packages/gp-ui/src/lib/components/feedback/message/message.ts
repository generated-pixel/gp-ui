import { GpFeedbackBase, GpFeedbackSeverity } from '../../../base/gp-feedback-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GpIcon } from '../../../icons/icon';

export type GpMessageSeverity = GpFeedbackSeverity;

@Component({
  selector: 'gp-message',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class GpMessage extends GpFeedbackBase {
  public text = input<string>('');
}
