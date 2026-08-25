import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenuItem } from '../button/split-button.component';

export interface GpMenubarItem extends GpMenuItem {
  items?: GpMenubarItem[];
}

@Component({
  selector: 'gp-menubar',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-menubar" role="menubar">
      <div class="gp-menubar-start">
        <ng-content select="[start]" />
      </div>

      <ul class="gp-menubar-root-list">
        @for (item of model; track $index) {
          <li
            class="gp-menubar-item"
            [class.gp-menubar-item-active]="activeItem() === item"
            (mouseenter)="onItemMouseEnter(item)"
            (mouseleave)="onItemMouseLeave(item)"
            role="none"
          >
            <a
              [routerLink]="item.routerLink"
              [attr.href]="item.url || null"
              class="gp-menubar-item-link"
              (click)="onItemClick(item, $event)"
              role="menuitem"
              [attr.aria-haspopup]="item.items ? 'true' : null"
            >
              @if (item.icon) {
                <gp-icon [name]="item.icon" class="gp-menubar-icon" />
              }
              <span class="gp-menubar-label">{{ item.label }}</span>
              @if (item.items && item.items.length > 0) {
                <gp-icon name="chevron-down" size="0.75em" class="gp-menubar-submenu-icon" />
              }
            </a>

            @if (item.items && item.items.length > 0 && activeItem() === item) {
              <ul class="gp-menubar-submenu" role="menu">
                @for (sub of item.items; track $index) {
                  @if (sub.separator) {
                    <li class="gp-menu-separator" role="separator"></li>
                  } @else {
                    <li class="gp-menubar-subitem" role="none">
                      <a
                        [routerLink]="sub.routerLink"
                        [attr.href]="sub.url || null"
                        class="gp-menubar-subitem-link"
                        (click)="onItemClick(sub, $event)"
                        role="menuitem"
                      >
                        @if (sub.icon) {
                          <gp-icon [name]="sub.icon" class="gp-menubar-icon" />
                        }
                        <span>{{ sub.label }}</span>
                      </a>
                    </li>
                  }
                }
              </ul>
            }
          </li>
        }
      </ul>

      <div class="gp-menubar-end">
        <ng-content select="[end]" />
      </div>
    </div>
  `,
  styles: [`
    .gp-menubar {
      display: flex;
      align-items: center;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      padding: 0.5rem 1rem;
      position: relative;
    }
    .gp-menubar-root-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0.25rem;
    }
    .gp-menubar-item {
      position: relative;
    }
    .gp-menubar-item-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: var(--gp-border-radius);
      color: var(--gp-text-color);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      cursor: pointer;
      transition: background var(--gp-transition-duration);
    }
    .gp-menubar-item-link:hover, .gp-menubar-item-active .gp-menubar-item-link {
      background: var(--gp-surface-hover);
    }
    .gp-menubar-icon {
      color: var(--gp-text-color-secondary);
    }
    .gp-menubar-submenu-icon {
      color: var(--gp-text-color-muted);
    }
    .gp-menubar-submenu {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      list-style: none;
      margin: 0;
      padding: 0.35rem 0;
      min-width: 12.5rem;
      z-index: 1050;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-menubar-subitem-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      color: var(--gp-text-color);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      transition: background var(--gp-transition-duration);
    }
    .gp-menubar-subitem-link:hover {
      background: var(--gp-surface-hover);
    }
    .gp-menubar-end {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class GpMenubarComponent {
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
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.activeItem.set(null);
  }
}
