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

import { RouterModule } from '@angular/router';
import { GpButtonComponent } from '../button/button.component';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';
import {
  GpButtonBaseComponent,
  GpButtonSeverity,
  GpButtonSize,
  GpButtonVariant
} from '../../../base/gp-button-base.component';

export interface GpMenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  disabled?: boolean;
  separator?: boolean;
  badge?: string;
  items?: GpMenuItem[];
  target?: string;
  title?: string;
  expanded?: boolean;
}

@Component({
  selector: 'gp-split-button',
  standalone: true,
  imports: [RouterModule, GpButtonComponent, GpIconComponent, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './split-button.component.html',
  styleUrl: './split-button.component.scss'
})
export class GpSplitButtonComponent extends GpButtonBaseComponent {
  public appendTo = input<GpAppendToTarget>('body');
  public model = input<GpMenuItem[]>([]);
  public dropdownIcon = input<string>('chevron-down');

  public onDropdownClick = output<MouseEvent>();
  public onOpen = output<void>();
  public onClose = output<void>();
  public onMenuItemClick = output<{ originalEvent: Event; item: GpMenuItem }>();

  public overlayVisible = signal<boolean>(false);

  constructor(public el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.overlayVisible() && !this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.overlayVisible()) {
      this.close();
    }
  }

  public onDefaultClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    this.onClickEvent.emit(event);
  }

  public toggleOverlay(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    event.stopPropagation();
    const next = !this.overlayVisible();
    this.overlayVisible.set(next);
    this.onDropdownClick.emit(event);

    if (next) {
      this.onOpen.emit();
    } else {
      this.onClose.emit();
    }
  }

  public open(): void {
    if (!this.overlayVisible() && !this.disabled()) {
      this.overlayVisible.set(true);
      this.onOpen.emit();
    }
  }

  public close(): void {
    if (this.overlayVisible()) {
      this.overlayVisible.set(false);
      this.onClose.emit();
    }
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.onMenuItemClick.emit({ originalEvent: event, item });
    this.close();
  }
}
