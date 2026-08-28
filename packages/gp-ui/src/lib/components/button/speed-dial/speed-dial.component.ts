import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from '../button/button.component';
import { GpTooltipDirective } from '../../../directives/tooltip.directive';
import { GpMenuItem } from '../split-button/split-button.component';

export type GpSpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type GpSpeedDialType = 'linear' | 'circle' | 'semi-circle';

@Component({
  selector: 'gp-speed-dial',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss'
})
export class GpSpeedDialComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);
  public direction = input<GpSpeedDialDirection>('up');
  public showIcon = input<string>('plus');
  public hideIcon = input<string>('times');

  public onVisibleChange = output<boolean>();

  public visible = signal<boolean>(false);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.visible() && !this.el.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible()) {
      this.hide();
    }
  }

  public toggle(): void {
    if (this.disabled()) {
      return;
    }
    const next = !this.visible();
    this.visible.set(next);
    this.onVisibleChange.emit(next);
  }

  public hide(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.onVisibleChange.emit(false);
    }
  }

  public show(): void {
    if (!this.visible()) {
      this.visible.set(true);
      this.onVisibleChange.emit(true);
    }
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
