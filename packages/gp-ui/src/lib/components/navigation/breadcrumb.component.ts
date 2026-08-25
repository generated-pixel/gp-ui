import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenuItem } from '../button/split-button.component';

@Component({
  selector: 'gp-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav class="gp-breadcrumb" aria-label="Breadcrumb">
      <ol class="gp-breadcrumb-list">
        @if (home) {
          <li class="gp-breadcrumb-item">
            <a
              [routerLink]="home.routerLink"
              [attr.href]="home.url || null"
              class="gp-breadcrumb-link"
              (click)="onItemClick(home, $event)"
              aria-label="Home"
            >
              <gp-icon [name]="home.icon || 'home'" size="1em" />
            </a>
          </li>
          @if (model && model.length > 0) {
            <li class="gp-breadcrumb-separator" aria-hidden="true">
              <gp-icon [name]="separatorIcon" size="0.75em" />
            </li>
          }
        }

        @for (item of model; track $index; let last = $last) {
          <li class="gp-breadcrumb-item" [class.gp-breadcrumb-item-last]="last">
            @if (last || item.disabled) {
              <span class="gp-breadcrumb-current" aria-current="page">{{ item.label }}</span>
            } @else {
              <a
                [routerLink]="item.routerLink"
                [attr.href]="item.url || null"
                class="gp-breadcrumb-link"
                (click)="onItemClick(item, $event)"
              >
                @if (item.icon) {
                  <gp-icon [name]="item.icon" size="0.9em" />
                }
                <span>{{ item.label }}</span>
              </a>
            }
          </li>

          @if (!last) {
            <li class="gp-breadcrumb-separator" aria-hidden="true">
              <gp-icon [name]="separatorIcon" size="0.75em" />
            </li>
          }
        }
      </ol>
    </nav>
  `,
  styles: [`
    .gp-breadcrumb {
      padding: 0.5rem 0.75rem;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
    }
    .gp-breadcrumb-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0.5rem;
    }
    .gp-breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: var(--gp-text-color-secondary);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      transition: color var(--gp-transition-duration);
    }
    .gp-breadcrumb-link:hover {
      color: var(--gp-primary);
    }
    .gp-breadcrumb-separator {
      color: var(--gp-text-color-muted);
      display: inline-flex;
    }
    .gp-breadcrumb-current {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      font-weight: 600;
    }
  `]
})
export class GpBreadcrumbComponent {
  @Input() model: GpMenuItem[] = [];
  @Input() home?: GpMenuItem;
  @Input() separatorIcon = 'chevron-right';

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
