import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';

@Component({
  selector: 'gp-context-menu',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class GpContextMenuComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);

  protected visible = signal<boolean>(false);
  protected position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  public show(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.position.set({ x: event.clientX, y: event.clientY });
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.hide();
  }
}
