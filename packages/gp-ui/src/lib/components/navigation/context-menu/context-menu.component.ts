import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

@Component({
  selector: 'gp-context-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class GpContextMenuComponent extends GpMenuBaseComponent<GpMenuItem> {
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
