import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';

@Component({
  selector: 'gp-context-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class GpContextMenuComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);

  public visible = signal<boolean>(false);
  protected position = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  protected activeSubItem = signal<GpMenuItem | null>(null);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.visible() && !this.el.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onDocumentContextMenu(event: MouseEvent): void {
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

  public show(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const menuWidth = 220;
    const menuHeight = 240;

    let x = event.clientX;
    let y = event.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = Math.max(8, x - menuWidth);
    }
    if (y + menuHeight > window.innerHeight) {
      y = Math.max(8, y - menuHeight);
    }

    this.position.set({ x, y });
    this.activeSubItem.set(null);
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
    this.activeSubItem.set(null);
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
