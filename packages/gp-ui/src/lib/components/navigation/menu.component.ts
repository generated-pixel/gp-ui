import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenuItem } from '../button/split-button.component';

@Component({
  selector: 'gp-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (!popup || visible()) {
      <div
        class="gp-menu"
        [class.gp-menu-popup]="popup"
        role="menu"
        (click)="$event.stopPropagation()"
      >
        <ul class="gp-menu-list">
          @for (item of model; track $index) {
            @if (item.separator) {
              <li class="gp-menu-separator" role="separator"></li>
            } @else {
              <li
                class="gp-menu-item"
                [class.gp-menu-item-disabled]="item.disabled"
                role="menuitem"
                (click)="onItemClick(item, $event)"
              >
                <a
                  [routerLink]="item.routerLink"
                  [attr.href]="item.url || null"
                  class="gp-menu-item-link"
                >
                  @if (item.icon) {
                    <gp-icon [name]="item.icon" class="gp-menu-item-icon" />
                  }
                  <span class="gp-menu-item-text">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="gp-menu-item-badge">{{ item.badge }}</span>
                  }
                </a>
              </li>
            }
          }
        </ul>
      </div>
    }
  `,
  styles: [`
    .gp-menu {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      padding: 0.35rem 0;
      min-width: 12.5rem;
      width: 100%;
    }
    .gp-menu-popup {
      position: absolute;
      box-shadow: var(--gp-shadow-lg);
      z-index: 1050;
      width: auto;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .gp-menu-item-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      color: var(--gp-text-color);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      cursor: pointer;
      transition: background var(--gp-transition-duration);
    }
    .gp-menu-item:hover:not(.gp-menu-item-disabled) .gp-menu-item-link {
      background: var(--gp-surface-hover);
    }
    .gp-menu-item-icon {
      color: var(--gp-text-color-secondary);
    }
    .gp-menu-item-text {
      flex: 1;
    }
    .gp-menu-item-badge {
      background: var(--gp-primary-light);
      color: var(--gp-primary);
      font-size: var(--gp-font-size-xs);
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: var(--gp-border-radius-full);
    }
    .gp-menu-item-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .gp-menu-separator {
      height: 1px;
      background: var(--gp-surface-divider);
      margin: 0.35rem 0;
    }
  `]
})
export class GpMenuComponent {
  @Input() model: GpMenuItem[] = [];
  @Input() popup = false;

  protected visible = signal<boolean>(false);

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.popup && !this.el.nativeElement.contains(event.target)) {
      this.visible.set(false);
    }
  }

  public toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.update(v => !v);
  }

  public show(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    if (this.popup) {
      this.hide();
    }
  }
}
