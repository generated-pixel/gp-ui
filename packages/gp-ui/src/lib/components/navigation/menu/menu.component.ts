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
  selector: 'gp-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class GpMenuComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);
  public popup = input<boolean>(false);
  public appendTo = input<string>('body');

  public visible = signal<boolean>(false);
  protected position = signal<{ top: number; left: number }>({ top: 0, left: 0 });
  protected activeItem = signal<GpMenuItem | null>(null);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.popup() && this.visible() && !this.el.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.popup() && this.visible()) {
      this.hide();
    }
  }

  public toggle(event: MouseEvent | HTMLElement): void {
    if (this.visible()) {
      this.hide();
    } else {
      this.show(event);
    }
  }

  public show(event: MouseEvent | HTMLElement): void {
    if (event instanceof Event) {
      event.stopPropagation();
      const target = (event.currentTarget || event.target) as HTMLElement;
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        let top = rect.bottom + 4;
        let left = rect.left;

        // Viewport bounds detection
        const menuWidth = 220;
        const menuHeight = 250;
        if (left + menuWidth > window.innerWidth) {
          left = Math.max(8, window.innerWidth - menuWidth - 8);
        }
        if (top + menuHeight > window.innerHeight) {
          top = Math.max(8, rect.top - menuHeight - 4);
        }

        this.position.set({ top, left });
      } else {
        this.position.set({ top: event.clientY + 4, left: event.clientX });
      }
    } else if (event && (event as HTMLElement).getBoundingClientRect) {
      const rect = (event as HTMLElement).getBoundingClientRect();
      this.position.set({ top: rect.bottom + 4, left: rect.left });
    }
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
    this.activeItem.set(null);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    if (this.popup()) {
      this.hide();
    }
  }
}
