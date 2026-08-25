import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenubarItem } from './menubar.component';

@Component({
  selector: 'gp-tiered-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-menu gp-tieredmenu" role="menu">
      <ul class="gp-menu-list">
        @for (item of model; track $index) {
          @if (item.separator) {
            <li class="gp-menu-separator" role="separator"></li>
          } @else {
            <li
              class="gp-menu-item gp-tieredmenu-item"
              (mouseenter)="activeItem.set(item)"
              (mouseleave)="activeItem.set(null)"
              role="none"
            >
              <a
                [routerLink]="item.routerLink"
                [attr.href]="item.url || null"
                class="gp-menu-item-link"
                (click)="onItemClick(item, $event)"
                role="menuitem"
              >
                @if (item.icon) {
                  <gp-icon [name]="item.icon" class="gp-menu-item-icon" />
                }
                <span class="gp-menu-item-text">{{ item.label }}</span>
                @if (item.items && item.items.length > 0) {
                  <gp-icon name="chevron-right" size="0.75em" />
                }
              </a>

              @if (item.items && item.items.length > 0 && activeItem() === item) {
                <div class="gp-menu-overlay gp-tieredmenu-sub">
                  <ul class="gp-menu-list">
                    @for (sub of item.items; track $index) {
                      <li class="gp-menu-item" role="none">
                        <a
                          [routerLink]="sub.routerLink"
                          [attr.href]="sub.url || null"
                          class="gp-menu-item-link"
                          (click)="onItemClick(sub, $event)"
                          role="menuitem"
                        >
                          @if (sub.icon) {
                            <gp-icon [name]="sub.icon" class="gp-menu-item-icon" />
                          }
                          <span>{{ sub.label }}</span>
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              }
            </li>
          }
        }
      </ul>
    </div>
  `,
  styles: [`
    .gp-tieredmenu-item {
      position: relative;
    }
    .gp-tieredmenu-sub {
      position: absolute;
      top: 0;
      left: 100%;
      margin-left: 2px;
      z-index: 1100;
    }
  `]
})
export class GpTieredMenuComponent {
  @Input() model: GpMenubarItem[] = [];

  protected activeItem = signal<GpMenubarItem | null>(null);

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
