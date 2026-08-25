import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenuItem } from '../button/split-button.component';

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
  template: `
    <div class="gp-menubar gp-megamenu" role="menubar">
      <ul class="gp-menubar-root-list">
        @for (item of model; track $index) {
          <li
            class="gp-menubar-item"
            [class.gp-menubar-item-active]="activeItem() === item"
            (mouseenter)="activeItem.set(item)"
            (mouseleave)="activeItem.set(null)"
            role="none"
          >
            <a
              [routerLink]="item.routerLink"
              [attr.href]="item.url || null"
              class="gp-menubar-item-link"
              role="menuitem"
            >
              @if (item.icon) {
                <gp-icon [name]="item.icon" class="gp-menubar-icon" />
              }
              <span>{{ item.label }}</span>
              @if (item.columns && item.columns.length > 0) {
                <gp-icon name="chevron-down" size="0.75em" class="gp-menubar-submenu-icon" />
              }
            </a>

            @if (item.columns && item.columns.length > 0 && activeItem() === item) {
              <div class="gp-megamenu-panel">
                <div class="gp-megamenu-grid">
                  @for (col of item.columns; track $index) {
                    <div class="gp-megamenu-col">
                      @if (col.label) {
                        <div class="gp-megamenu-col-header">{{ col.label }}</div>
                      }
                      <ul class="gp-menu-list">
                        @for (sub of col.items; track $index) {
                          <li class="gp-menu-item" role="none">
                            <a
                              [routerLink]="sub.routerLink"
                              [attr.href]="sub.url || null"
                              class="gp-menu-item-link"
                              (click)="onItemClick(sub, $event)"
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
                </div>
              </div>
            }
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .gp-megamenu-panel {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      padding: 1rem;
      z-index: 1050;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-megamenu-grid {
      display: flex;
      gap: 1.5rem;
    }
    .gp-megamenu-col {
      min-width: 10rem;
    }
    .gp-megamenu-col-header {
      font-weight: 700;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-primary);
      margin-bottom: 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
  `]
})
export class GpMegaMenuComponent {
  @Input() model: GpMegaMenuItem[] = [];

  protected activeItem = signal<GpMegaMenuItem | null>(null);

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.activeItem.set(null);
  }
}
