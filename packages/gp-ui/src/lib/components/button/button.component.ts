import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpRippleDirective } from '../../directives/ripple.directive';

export type GpButtonVariant = 'filled' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'link';
export type GpButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
export type GpButtonSize = 'sm' | 'md' | 'lg';
export type GpIconPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-button',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel || label || null"
      [attr.aria-disabled]="disabled || loading"
      [attr.aria-busy]="loading"
      (click)="onClick($event)"
      gpRipple
    >
      @if (loading) {
        <gp-icon [name]="loadingIcon" [spin]="true" class="gp-button-loading-icon" />
      } @else if (icon && (iconPos === 'left' || iconPos === 'top')) {
        <gp-icon [name]="icon" class="gp-button-icon" />
      }

      @if (label) {
        <span class="gp-button-label">{{ label }}</span>
      }

      <ng-content />

      @if (!loading && icon && (iconPos === 'right' || iconPos === 'bottom')) {
        <gp-icon [name]="icon" class="gp-button-icon" />
      }

      @if (badge) {
        <span class="gp-button-badge" [class.gp-button-badge-danger]="badgeSeverity === 'danger'">{{ badge }}</span>
      }
    </button>
  `,
  styles: [`
    .gp-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-family: inherit;
      font-weight: 500;
      font-size: var(--gp-font-size-sm);
      line-height: 1.25;
      padding: 0.5rem 1rem;
      gap: 0.5rem;
      border-radius: var(--gp-border-radius);
      border: 1px solid transparent;
      cursor: pointer;
      user-select: none;
      transition: all var(--gp-transition-duration) var(--gp-transition-timing);
      outline: none;
      text-decoration: none;
      white-space: nowrap;
    }

    .gp-button:focus-visible {
      box-shadow: var(--gp-focus-ring);
    }

    .gp-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Sizes */
    .gp-button-sm {
      padding: 0.35rem 0.65rem;
      font-size: var(--gp-font-size-xs);
      gap: 0.35rem;
    }
    .gp-button-md {
      padding: 0.5rem 1rem;
      font-size: var(--gp-font-size-sm);
    }
    .gp-button-lg {
      padding: 0.75rem 1.5rem;
      font-size: var(--gp-font-size-base);
      gap: 0.65rem;
    }

    /* Variants & Severities */
    /* Filled */
    .gp-button-filled.gp-button-primary { background: var(--gp-primary); color: var(--gp-primary-text); }
    .gp-button-filled.gp-button-primary:hover:not(:disabled) { background: var(--gp-primary-hover); }
    .gp-button-filled.gp-button-secondary { background: var(--gp-secondary); color: var(--gp-secondary-text); }
    .gp-button-filled.gp-button-secondary:hover:not(:disabled) { background: var(--gp-secondary-hover); }
    .gp-button-filled.gp-button-success { background: var(--gp-success); color: var(--gp-success-text); }
    .gp-button-filled.gp-button-success:hover:not(:disabled) { background: var(--gp-success-hover); }
    .gp-button-filled.gp-button-info { background: var(--gp-info); color: var(--gp-info-text); }
    .gp-button-filled.gp-button-info:hover:not(:disabled) { background: var(--gp-info-hover); }
    .gp-button-filled.gp-button-warning { background: var(--gp-warning); color: var(--gp-warning-text); }
    .gp-button-filled.gp-button-warning:hover:not(:disabled) { background: var(--gp-warning-hover); }
    .gp-button-filled.gp-button-danger { background: var(--gp-danger); color: var(--gp-danger-text); }
    .gp-button-filled.gp-button-danger:hover:not(:disabled) { background: var(--gp-danger-hover); }
    .gp-button-filled.gp-button-contrast { background: var(--gp-contrast); color: var(--gp-contrast-text); }
    .gp-button-filled.gp-button-contrast:hover:not(:disabled) { background: var(--gp-contrast-hover); }

    /* Outlined */
    .gp-button-outlined {
      background: transparent;
    }
    .gp-button-outlined.gp-button-primary { border-color: var(--gp-primary); color: var(--gp-primary); }
    .gp-button-outlined.gp-button-primary:hover:not(:disabled) { background: var(--gp-primary-light); }
    .gp-button-outlined.gp-button-secondary { border-color: var(--gp-secondary); color: var(--gp-secondary); }
    .gp-button-outlined.gp-button-secondary:hover:not(:disabled) { background: var(--gp-secondary-light); }
    .gp-button-outlined.gp-button-success { border-color: var(--gp-success); color: var(--gp-success); }
    .gp-button-outlined.gp-button-success:hover:not(:disabled) { background: var(--gp-success-light); }
    .gp-button-outlined.gp-button-danger { border-color: var(--gp-danger); color: var(--gp-danger); }
    .gp-button-outlined.gp-button-danger:hover:not(:disabled) { background: var(--gp-danger-light); }

    /* Text */
    .gp-button-text {
      background: transparent;
    }
    .gp-button-text.gp-button-primary { color: var(--gp-primary); }
    .gp-button-text.gp-button-primary:hover:not(:disabled) { background: var(--gp-primary-light); }
    .gp-button-text.gp-button-secondary { color: var(--gp-secondary); }
    .gp-button-text.gp-button-secondary:hover:not(:disabled) { background: var(--gp-secondary-light); }
    .gp-button-text.gp-button-danger { color: var(--gp-danger); }
    .gp-button-text.gp-button-danger:hover:not(:disabled) { background: var(--gp-danger-light); }

    /* Tonal */
    .gp-button-tonal.gp-button-primary { background: var(--gp-primary-light); color: var(--gp-primary); }
    .gp-button-tonal.gp-button-primary:hover:not(:disabled) { background: var(--gp-primary-200); }

    /* Rounded & Icons */
    .gp-button-rounded {
      border-radius: var(--gp-border-radius-full);
    }
    .gp-button-icon-only {
      width: var(--gp-button-height);
      height: var(--gp-button-height);
      padding: 0;
      border-radius: var(--gp-border-radius);
    }
    .gp-button-icon-only.gp-button-rounded {
      border-radius: 50%;
    }
    .gp-button-icon-only.gp-button-sm {
      width: 2rem;
      height: 2rem;
    }
    .gp-button-icon-only.gp-button-lg {
      width: 3rem;
      height: 3rem;
    }

    .gp-button-badge {
      background: rgba(255, 255, 255, 0.3);
      color: inherit;
      font-size: 0.7rem;
      padding: 0.15rem 0.4rem;
      border-radius: var(--gp-border-radius-full);
      font-weight: 700;
    }
    .gp-button-badge-danger {
      background: var(--gp-danger);
      color: #fff;
    }
  `]
})
export class GpButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() iconPos: GpIconPosition = 'left';
  @Input() variant: GpButtonVariant = 'filled';
  @Input() severity: GpButtonSeverity = 'primary';
  @Input() size: GpButtonSize = 'md';
  @Input() rounded = false;
  @Input() iconOnly = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingIcon = 'spinner';
  @Input() badge = '';
  @Input() badgeSeverity: GpButtonSeverity = 'danger';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() styleClass = '';
  @Input() ariaLabel = '';

  @Output() onClickEvent = new EventEmitter<MouseEvent>();

  protected buttonClass = computed(() => {
    return [
      'gp-button',
      `gp-button-${this.variant}`,
      `gp-button-${this.severity}`,
      `gp-button-${this.size}`,
      this.rounded ? 'gp-button-rounded' : '',
      this.iconOnly || (!this.label && this.icon) ? 'gp-button-icon-only' : '',
      this.loading ? 'gp-button-loading' : '',
      this.styleClass
    ].filter(Boolean).join(' ');
  });

  protected onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClickEvent.emit(event);
    }
  }
}
