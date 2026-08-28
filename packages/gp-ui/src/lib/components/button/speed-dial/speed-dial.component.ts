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
import { GpButtonComponent } from '../button/button.component';
import { GpMenuItem } from '../split-button/split-button.component';

export type GpSpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type GpSpeedDialType = 'linear' | 'circle' | 'semi-circle';

@Component({
  selector: 'gp-speed-dial',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss'
})
export class GpSpeedDialComponent extends GpBaseComponent {
  @Input() model: GpMenuItem[] = [];
  @Input() direction: GpSpeedDialDirection = 'up';
  @Input() showIcon = 'plus';
  @Input() hideIcon = 'times';
  @Input() override disabled = false;

  @Output() onVisibleChange = new EventEmitter<boolean>();

  protected visible = signal<boolean>(false);

  public toggle(): void {
    if (this.disabled) {
      return;
    }
    const next = !this.visible();
    this.visible.set(next);
    this.onVisibleChange.emit(next);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.visible.set(false);
  }
}
