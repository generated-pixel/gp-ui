import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../icons/icon.component';
import { GpTooltipDirective } from '../../directives/tooltip.directive';
import { GpMenuItem } from '../button/split-button.component';

export type GpDockPosition = 'bottom' | 'top' | 'left' | 'right';

@Component({
  selector: 'gp-dock',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent, GpTooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-dock" [class]="'gp-dock-' + position">
      <ul class="gp-dock-list" role="toolbar">
        @for (item of model; track $index) {
          <li class="gp-dock-item" role="none">
            <a
              [routerLink]="item.routerLink"
              [attr.href]="item.url || null"
              class="gp-dock-link"
              [gpTooltip]="item.label || ''"
              [tooltipPosition]="position === 'bottom' ? 'top' : 'bottom'"
              (click)="onItemClick(item, $event)"
              role="button"
            >
              @if (item.icon) {
                <gp-icon [name]="item.icon" size="1.75em" />
              }
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    .gp-dock {
      display: flex;
      justify-content: center;
      padding: 0.5rem;
      pointer-events: none;
    }
    .gp-dock-list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-lg);
      box-shadow: var(--gp-shadow-xl);
      pointer-events: auto;
    }
    .gp-dock-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--gp-border-radius-md);
      color: var(--gp-text-color);
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      text-decoration: none;
    }
    .gp-dock-link:hover {
      transform: scale(1.35) translateY(-6px);
      color: var(--gp-primary);
    }
  `]
})
export class GpDockComponent {
  @Input() model: GpMenuItem[] = [];
  @Input() position: GpDockPosition = 'bottom';

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
  }
}
