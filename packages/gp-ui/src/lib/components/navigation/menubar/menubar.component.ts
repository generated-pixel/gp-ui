import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
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
  @Input() model: GpMenubarItem[] = [];

  protected activeItem = signal<GpMenubarItem | null>(null);

  public onItemMouseEnter(item: GpMenubarItem): void {
    if (item.items && item.items.length > 0) {
      this.activeItem.set(item);
    }
  }

  public onItemMouseLeave(item: GpMenubarItem): void {
    if (this.activeItem() === item) {
      this.activeItem.set(null);
    }
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.activeItem.set(null);
  }
}
