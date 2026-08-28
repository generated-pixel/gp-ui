import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';

export interface GpMegaMenuColumn {
  label?: string;
  items: GpMenuItem[];
}

export interface GpMegaMenuItem extends GpMenuItem {
  root?: boolean;
  columns?: GpMegaMenuColumn[];
}

@Component({
  selector: 'gp-mega-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mega-menu.component.html',
  styleUrl: './mega-menu.component.scss'
})
export class GpMegaMenuComponent extends GpBaseComponent {
  public model = input<GpMegaMenuItem[]>([]);

  protected activeItem = signal<GpMegaMenuItem | null>(null);

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.activeItem.set(null);
  }
}
