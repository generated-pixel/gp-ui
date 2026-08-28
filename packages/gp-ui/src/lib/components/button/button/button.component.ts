import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed
} from '@angular/core';
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
  public label = input<string>('');
  public icon = input<string>('');
  public iconPos = input<GpIconPosition>('left');
  public variant = input<GpButtonVariant>('filled');
  public severity = input<GpButtonSeverity>('primary');
  public size = input<GpButtonSize>('md');
  public rounded = input<boolean>(false);
  public iconOnly = input<boolean>(false);
  public loading = input<boolean>(false);
  public loadingIcon = input<string>('spinner');
  public badge = input<string>('');
  public badgeSeverity = input<GpButtonSeverity>('danger');
  public type = input<'button' | 'submit' | 'reset'>('button');

  public onClickEvent = output<MouseEvent>();

  protected buttonClass = computed(() => {
    return [
      'gp-button',
      `gp-button-${this.variant()}`,
      `gp-button-${this.severity()}`,
      `gp-button-${this.size()}`,
      this.rounded() ? 'gp-button-rounded' : '',
      this.iconOnly() || (!this.label() && this.icon()) ? 'gp-button-icon-only' : '',
      this.loading() ? 'gp-button-loading' : '',
      this.styleClass()
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected onClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.onClickEvent.emit(event);
    }
  }
}
