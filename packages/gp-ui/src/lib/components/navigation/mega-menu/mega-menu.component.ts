import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, HostListener } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpButtonComponent } from '../../button/button/button.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';
import { GpMenuBaseComponent } from '../../../base/gp-menu-base.component';

export interface GpMegaMenuSubItem extends GpMenuItem {
  description?: string;
  iconColor?: string;
  iconBg?: string;
  badgeSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
}

export interface GpMegaMenuColumn {
  label?: string;
  icon?: string;
  items: GpMegaMenuSubItem[];
  featured?: {
    badge?: string;
    title: string;
    description?: string;
    image?: string;
    actionLabel?: string;
    actionUrl?: string;
    actionCommand?: () => void;
  };
}

export interface GpMegaMenuItem extends GpMenuItem {
  root?: boolean;
  columns?: GpMegaMenuColumn[];
}

@Component({
  selector: 'gp-mega-menu',
  standalone: true,
  imports: [RouterModule, GpIconComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mega-menu.component.html',
  styleUrl: './mega-menu.component.scss'
})
export class GpMegaMenuComponent extends GpMenuBaseComponent<GpMegaMenuItem> {
  public orientation = input<'horizontal' | 'vertical'>('horizontal');

  @HostListener('document:click', ['$event'])
  override onDocumentClick(event: MouseEvent): void {
    if (this.menuHostEl?.nativeElement && !this.menuHostEl.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  override onEscape(): void {
    this.close();
  }

  public onItemMouseEnter(item: GpMegaMenuItem): void {
    if (this.activeItem() !== null || (item.columns && item.columns.length > 0)) {
      this.activeItem.set(item);
    }
  }

  public onRootItemClick(item: GpMegaMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.columns && item.columns.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      this.activeItem.set(item);
    } else {
      this.onItemClick(item, event);
    }
  }

  public onItemClick(item: any, event: MouseEvent): void {
    this.handleMenuItemClick(item, event);
    this.close();
  }

  public onFeaturedClick(featured: NonNullable<GpMegaMenuColumn['featured']>, event: MouseEvent): void {
    if (featured.actionCommand) {
      featured.actionCommand();
    }
    this.close();
  }

  public close(): void {
    this.activeItem.set(null);
  }
}
