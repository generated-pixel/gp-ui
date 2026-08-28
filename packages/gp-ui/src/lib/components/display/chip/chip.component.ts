import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-chip',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class GpChipComponent extends GpBaseComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() image = '';
  @Input() removable = false;

  @Output() onRemove = new EventEmitter<{ originalEvent: MouseEvent }>();

  protected visible = signal<boolean>(true);

  public remove(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.set(false);
    this.onRemove.emit({ originalEvent: event });
  }
}
