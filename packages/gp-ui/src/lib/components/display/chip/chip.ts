import { GpFeedbackBase } from '../../../base/gp-feedback-base';
import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-chip',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chip.html',
  styleUrl: './chip.scss'
})
export class GpChip extends GpFeedbackBase {
  public label = input<string>('');
  public image = input<string>('');
  public removable = input<boolean>(false);

  public onRemove = output<{ originalEvent: MouseEvent }>();

  public remove(event: MouseEvent): void {
    event.stopPropagation();
    this.close();
    this.onRemove.emit({ originalEvent: event });
  }
}
