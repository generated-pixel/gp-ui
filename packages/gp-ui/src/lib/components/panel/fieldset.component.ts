import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-fieldset',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <fieldset class="gp-fieldset" [class.gp-fieldset-collapsed]="collapsed()">
      <legend class="gp-fieldset-legend" (click)="toggleable ? toggle() : null" [class.gp-fieldset-toggleable]="toggleable">
        @if (toggleable) {
          <gp-icon [name]="collapsed() ? 'chevron-down' : 'chevron-up'" size="0.75em" class="gp-fieldset-toggler" />
        }
        <span class="gp-fieldset-legend-text">{{ legend }}</span>
      </legend>

      @if (!collapsed()) {
        <div class="gp-fieldset-content">
          <ng-content />
        </div>
      }
    </fieldset>
  `,
  styles: [`
    .gp-fieldset {
      border: 1px solid var(--gp-surface-border);
      background: var(--gp-surface-card);
      border-radius: var(--gp-border-radius-md);
      padding: 0.5rem 1.25rem 1.25rem 1.25rem;
      margin: 0;
      width: 100%;
    }
    .gp-fieldset-legend {
      padding: 0.4rem 0.75rem;
      border: 1px solid var(--gp-surface-border);
      background: var(--gp-surface-section);
      border-radius: var(--gp-border-radius);
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-fieldset-toggleable {
      cursor: pointer;
      user-select: none;
      transition: background var(--gp-transition-duration);
    }
    .gp-fieldset-toggleable:hover {
      background: var(--gp-surface-hover);
    }
    .gp-fieldset-toggler {
      color: var(--gp-text-color-muted);
    }
    .gp-fieldset-content {
      padding-top: 0.5rem;
      color: var(--gp-text-color);
      line-height: 1.5;
      font-size: var(--gp-font-size-sm);
    }
  `]
})
export class GpFieldsetComponent {
  @Input() legend = '';
  @Input() toggleable = false;

  protected collapsed = signal<boolean>(false);

  public toggle(): void {
    this.collapsed.update(v => !v);
  }
}
