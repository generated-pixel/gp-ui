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

export interface GpMenubarItem extends GpMenuItem {
  items?: GpMenubarItem[];
}

@Component({
  selector: 'gp-menubar',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class GpMenubarComponent extends GpBaseComponent {
  public model = input<GpMenubarItem[]>([]);

  public activeItem = signal<GpMenubarItem | null>(null);
  public activeSubItem = signal<GpMenubarItem | null>(null);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  public onItemMouseEnter(item: GpMenubarItem): void {
    if (this.activeItem() !== null || (item.items && item.items.length > 0)) {
      this.activeItem.set(item);
      this.activeSubItem.set(null);
    }
  }

  public onSubItemMouseEnter(subItem: GpMenubarItem): void {
    if (subItem.items && subItem.items.length > 0) {
      this.activeSubItem.set(subItem);
    } else {
      this.activeSubItem.set(null);
    }
  }

  public onRootItemClick(item: GpMenubarItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.items && item.items.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      if (this.activeItem() === item) {
        this.close();
      } else {
        this.activeItem.set(item);
        this.activeSubItem.set(null);
      }
    } else {
      this.onItemClick(item, event);
    }
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.close();
  }

  public close(): void {
    this.activeItem.set(null);
    this.activeSubItem.set(null);
  }
}
