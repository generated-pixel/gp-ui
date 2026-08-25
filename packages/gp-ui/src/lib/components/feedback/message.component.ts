import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

export type GpMessageSeverity = 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'contrast';

@Component({
  selector: 'gp-message',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div
        class="gp-message"
        [class]="'gp-message-' + severity"
        role="alert"
      >
        <gp-icon [name]="icon || defaultIcon()" size="1.25em" class="gp-message-icon" />

        <div class="gp-message-content">
          @if (text) {
            <span class="gp-message-text">{{ text }}</span>
          }
          <ng-content />
        </div>

        @if (closable) {
          <button
            type="button"
            class="gp-message-close"
            (click)="close()"
            aria-label="Close message"
          >
            <gp-icon name="times" size="0.85em" />
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .gp-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--gp-border-radius);
      border: 1px solid transparent;
      margin-bottom: 0.5rem;
      font-size: var(--gp-font-size-sm);
    }
    .gp-message-success { background: var(--gp-success-light); border-color: var(--gp-success-border); color: #065f46; }
    .gp-message-success .gp-message-icon { color: var(--gp-success); }
    .gp-message-info { background: var(--gp-info-light); border-color: var(--gp-info-border); color: #075985; }
    .gp-message-info .gp-message-icon { color: var(--gp-info); }
    .gp-message-warning { background: var(--gp-warning-light); border-color: var(--gp-warning-border); color: #92400e; }
    .gp-message-warning .gp-message-icon { color: var(--gp-warning); }
    .gp-message-error { background: var(--gp-danger-light); border-color: var(--gp-danger-border); color: #991b1b; }
    .gp-message-error .gp-message-icon { color: var(--gp-danger); }
    .gp-message-secondary { background: var(--gp-secondary-light); border-color: var(--gp-surface-border); color: var(--gp-text-color); }
    .gp-message-content { flex: 1; line-height: 1.4; }
    .gp-message-close {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      padding: 0.15rem;
      display: inline-flex;
    }
    .gp-message-close:hover { opacity: 1; }
  `]
})
export class GpMessageComponent {
  @Input() severity: GpMessageSeverity = 'info';
  @Input() text = '';
  @Input() icon = '';
  @Input() closable = false;

  @Output() onClose = new EventEmitter<void>();

  protected visible = signal<boolean>(true);

  protected defaultIcon(): string {
    switch (this.severity) {
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'times-circle';
      default: return 'info-circle';
    }
  }

  public close(): void {
    this.visible.set(false);
    this.onClose.emit();
  }
}
