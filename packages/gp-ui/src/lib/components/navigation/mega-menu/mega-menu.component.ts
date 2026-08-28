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
import { GpButtonComponent } from '../../button/button/button.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';

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
  imports: [CommonModule, RouterModule, GpIconComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mega-menu.component.html',
  styleUrl: './mega-menu.component.scss'
})
export class GpMegaMenuComponent extends GpBaseComponent {
  public model = input<GpMegaMenuItem[]>([]);
  public orientation = input<'horizontal' | 'vertical'>('horizontal');

  public activeItem = signal<GpMegaMenuItem | null>(null);

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
      if (this.activeItem() === item) {
        this.close();
      } else {
        this.activeItem.set(item);
      }
    } else {
      this.onItemClick(item, event);
    }
  }

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
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
