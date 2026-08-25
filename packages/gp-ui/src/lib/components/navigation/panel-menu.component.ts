import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenubarItem } from './menubar.component';

@Component({
  selector: 'gp-panel-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-panelmenu">
      @for (item of model; track $index) {
        <div class="gp-panelmenu-panel">
          <div
            class="gp-panelmenu-header"
            [class.gp-panelmenu-header-active]="item.expanded"
            (click)="toggle(item)"
          >
            @if (item.icon) {
              <gp-icon [name]="item.icon" class="gp-panelmenu-icon" />
            }
            <span class="gp-panelmenu-label">{{ item.label }}</span>
            @if (item.items && item.items.length > 0) {
              <gp-icon [name]="item.expanded ? 'chevron-down' : 'chevron-right'" size="0.8em" class="gp-panelmenu-arrow" />
            }
          </div>

          @if (item.items && item.items.length > 0 && item.expanded) {
            <ul class="gp-panelmenu-list">
              @for (sub of item.items; track $index) {
                <li class="gp-panelmenu-item">
                  <a
                    [routerLink]="sub.routerLink"
                    [attr.href]="sub.url || null"
                    class="gp-panelmenu-link"
                    (click)="onItemClick(sub, $event)"
                  >
                    @if (sub.icon) {
                      <gp-icon [name]="sub.icon" size="0.9em" class="gp-panelmenu-icon" />
                    }
                    <span>{{ sub.label }}</span>
                  </a>
                </li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-panelmenu {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      width: 100%;
    }
    .gp-panelmenu-panel {
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      overflow: hidden;
      background: var(--gp-surface-card);
    }
    .gp-panelmenu-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--gp-surface-card);
      cursor: pointer;
      font-size: var(--gp-font-size-sm);
      font-weight: 600;
      color: var(--gp-text-color);
      transition: background var(--gp-transition-duration);
    }
    .gp-panelmenu-header:hover {
      background: var(--gp-surface-hover);
    }
    .gp-panelmenu-label {
      flex: 1;
    }
    .gp-panelmenu-icon {
      color: var(--gp-text-color-secondary);
    }
    .gp-panelmenu-arrow {
      color: var(--gp-text-color-muted);
    }
    .gp-panelmenu-list {
      list-style: none;
      margin: 0;
      padding: 0.25rem 0 0.5rem 1.5rem;
      border-top: 1px solid var(--gp-surface-divider);
    }
    .gp-panelmenu-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.75rem;
      color: var(--gp-text-color-secondary);
      text-decoration: none;
      font-size: var(--gp-font-size-sm);
      transition: color var(--gp-transition-duration);
    }
    .gp-panelmenu-link:hover {
      color: var(--gp-primary);
    }
  `]
})
export class GpPanelMenuComponent {
  @Input() model: (GpMenubarItem & { expanded?: boolean })[] = [];

  public toggle(item: any): void {
    item.expanded = !item.expanded;
  }

  public onItemClick(item: any, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
