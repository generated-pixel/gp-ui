import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-panel',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-panel" [class.gp-panel-collapsed]="collapsed()">
      <div class="gp-panel-header">
        <span class="gp-panel-title">{{ header }}</span>
        <div class="gp-panel-icons">
          <ng-content select="[icons]" />
          @if (toggleable) {
            <button
              type="button"
              class="gp-panel-toggle-btn"
              (click)="toggle()"
              aria-label="Toggle panel"
            >
              <gp-icon [name]="collapsed() ? 'chevron-down' : 'chevron-up'" size="0.85em" />
            </button>
          }
        </div>
      </div>

      @if (!collapsed()) {
        <div class="gp-panel-content">
          <ng-content />
        </div>
      }

      @if (!collapsed() && showFooter) {
        <div class="gp-panel-footer">
          <ng-content select="[footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-panel {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-md);
      overflow: hidden;
      width: 100%;
    }
    .gp-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.875rem 1.25rem;
      background: var(--gp-surface-section);
      border-bottom: 1px solid var(--gp-surface-border);
    }
    .gp-panel-collapsed .gp-panel-header {
      border-bottom: none;
    }
    .gp-panel-title {
      font-weight: 700;
      font-size: var(--gp-font-size-base);
      color: var(--gp-text-color);
    }
    .gp-panel-icons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-panel-toggle-btn {
      background: none;
      border: none;
      color: var(--gp-text-color-secondary);
      cursor: pointer;
      padding: 0.25rem;
      display: inline-flex;
      border-radius: 50%;
    }
    .gp-panel-toggle-btn:hover {
      background: var(--gp-surface-hover);
      color: var(--gp-text-color);
    }
    .gp-panel-content {
      padding: 1.25rem;
      color: var(--gp-text-color);
      line-height: 1.5;
    }
    .gp-panel-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid var(--gp-surface-divider);
      background: var(--gp-surface-ground);
    }
  `]
})
export class GpPanelComponent {
  @Input() header = '';
  @Input() toggleable = false;
  @Input() showFooter = false;

  @Output() onToggle = new EventEmitter<{ collapsed: boolean }>();

  protected collapsed = signal<boolean>(false);

  @Input() set collapsedProp(val: boolean) {
    this.collapsed.set(val);
  }

  public toggle(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }
}
