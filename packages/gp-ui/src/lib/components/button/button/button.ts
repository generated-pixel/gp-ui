import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';
import { GpRippleDirective } from '../../../directives/ripple.directive';
import {
  GpButtonBase,
  GpButtonVariant,
  GpButtonSeverity,
  GpButtonSize,
  GpIconPosition
} from '../../../base/gp-button-base';

export { GpButtonVariant, GpButtonSeverity, GpButtonSize, GpIconPosition };

@Component({
  selector: 'gp-button',
  standalone: true,
  imports: [GpIcon, GpRippleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class GpButton extends GpButtonBase {}
