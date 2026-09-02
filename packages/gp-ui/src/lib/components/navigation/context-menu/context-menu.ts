import { Component, ChangeDetectionStrategy, ViewEncapsulation, HostListener, signal, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GpIcon } from '../../../icons/icon';
import { GpMenuItem } from '../../button/split-button/split-button';
import { GpMenuBase } from '../../../base/gp-menu-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-context-menu',
  standalone: true,
  imports: [RouterModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss'
})
export class GpContextMenu extends GpMenuBase<GpMenuItem> {
  public appendTo = input<GpAppendToTarget>('body');
  protected activeSubItem = signal<GpMenuItem | null>(null);

  @HostListener('document:contextmenu', ['$event'])
  onDocumentContextMenu(event: MouseEvent): void {
    if (this.visible() && this.menuHostEl?.nativeElement && !this.menuHostEl.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  public override show(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const menuWidth = 220;
    const menuHeight = 240;

    let left = event.clientX;
    let top = event.clientY;

    if (left + menuWidth > window.innerWidth) {
      left = Math.max(8, left - menuWidth);
    }
    if (top + menuHeight > window.innerHeight) {
      top = Math.max(8, top - menuHeight);
    }

    this.position.set({ top, left });
    this.activeSubItem.set(null);
    this.visible.set(true);
    this.onShow.emit();
  }

  public override hide(): void {
    super.hide();
    this.activeSubItem.set(null);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
  }
}
