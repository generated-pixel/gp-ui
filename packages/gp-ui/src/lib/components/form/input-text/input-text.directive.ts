import { Directive, input, computed, HostBinding } from '@angular/core';

export type GpInputTextSize = 'sm' | 'md' | 'lg' | 'small' | 'large';

@Directive({
  selector: '[gpInputText], input[gpInput], textarea[gpInput]',
  standalone: true,
  host: {
    'class': 'gp-inputtext',
    '[class.gp-inputtext-sm]': "size() === 'sm' || size() === 'small'",
    '[class.gp-inputtext-lg]': "size() === 'lg' || size() === 'large'",
    '[class.gp-input-invalid]': 'invalid()',
    '[class.gp-input-disabled]': 'disabled()'
  }
})
export class GpInputTextDirective {
  public size = input<GpInputTextSize>('md');
  public invalid = input<boolean>(false);
  public disabled = input<boolean>(false);
}
