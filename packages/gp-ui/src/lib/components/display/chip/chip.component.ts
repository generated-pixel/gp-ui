import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';

import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-chip',
  standalone: true,
  imports: [GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class GpChipComponent extends GpBaseComponent {
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
