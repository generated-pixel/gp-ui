import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import {
  GpButtonBaseComponent,
  GpButtonVariant,
  GpButtonSeverity,
  GpButtonSize,
  GpIconPosition
} from '../../../base/gp-button-base.component';

export {
  GpButtonVariant,
  GpButtonSeverity,
  GpButtonSize,
  GpIconPosition
};

@Component({
  selector: 'gp-button',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class GpButtonComponent extends GpButtonBaseComponent {}
