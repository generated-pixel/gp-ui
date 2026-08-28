import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpRippleDirective } from '../../../directives/ripple.directive';

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
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class GpButtonComponent extends GpBaseComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() iconPos: GpIconPosition = 'left';
  @Input() variant: GpButtonVariant = 'filled';
  @Input() severity: GpButtonSeverity = 'primary';
  @Input() size: GpButtonSize = 'md';
  @Input() rounded = false;
  @Input() iconOnly = false;
  @Input() override disabled = false;
  @Input() loading = false;
  @Input() loadingIcon = 'spinner';
  @Input() badge = '';
  @Input() badgeSeverity: GpButtonSeverity = 'danger';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() override styleClass = '';
  @Input() override ariaLabel = '';

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
