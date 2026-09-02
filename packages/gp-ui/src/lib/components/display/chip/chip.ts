import { GpBase } from '../../../base/gp-base';
import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';

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
export class GpChip extends GpBase {
  public label = input<string>('');
  public icon = input<string>('');
  public image = input<string>('');
  public removable = input<boolean>(false);

  public onRemove = output<{ originalEvent: MouseEvent }>();

  protected visible = signal<boolean>(true);

  public remove(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.set(false);
    this.onRemove.emit({ originalEvent: event });
  }
}
