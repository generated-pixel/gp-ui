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

import { GpButtonComponent } from '../button/button.component';
import { GpTooltipDirective } from '../../../directives/tooltip.directive';
import { GpMenuItem } from '../split-button/split-button.component';
import { GpButtonBaseComponent, GpButtonSeverity, GpButtonVariant } from '../../../base/gp-button-base.component';

export type GpSpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type GpSpeedDialType = 'linear' | 'circle' | 'semi-circle';

@Component({
  selector: 'gp-speed-dial',
  standalone: true,
  imports: [GpButtonComponent, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './speed-dial.component.html',
  styleUrl: './speed-dial.component.scss'
})
export class GpSpeedDialComponent extends GpButtonBaseComponent {
  public model = input<GpMenuItem[]>([]);
  public direction = input<GpSpeedDialDirection>('up');
  public showIcon = input<string>('plus');
  public hideIcon = input<string>('times');
  public buttonSeverity = input<GpButtonSeverity>('primary');
  public buttonVariant = input<GpButtonVariant>('filled');

  public onVisibleChange = output<boolean>();
  public onShow = output<void>();
  public onHide = output<void>();
  public onMenuItemClick = output<{ originalEvent: Event; item: GpMenuItem }>();

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
    if (next) {
      this.onShow.emit();
    } else {
      this.onHide.emit();
    }
  }

  public hide(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.onVisibleChange.emit(false);
      this.onHide.emit();
    }
  }

  public show(): void {
    if (!this.visible()) {
      this.visible.set(true);
      this.onVisibleChange.emit(true);
      this.onShow.emit();
    }
  }

  public onTriggerClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    this.onClickEvent.emit(event);
    this.toggle();
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.onMenuItemClick.emit({ originalEvent: event, item });
    this.hide();
  }
}
