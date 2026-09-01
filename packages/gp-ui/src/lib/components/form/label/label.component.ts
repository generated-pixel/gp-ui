import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpLabelSize, GpLabelSeverity } from './label.interface';

@Component({
  selector: 'gp-label, [gpLabel]',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss'
})
export class GpLabelComponent {
  public htmlFor = input<string | undefined>(undefined, { alias: 'for' });
  public text = input<string | undefined>(undefined);
  public icon = input<string | undefined>(undefined);
  public required = input<boolean>(false);
  public optional = input<boolean>(false);
  public optionalText = input<string>('(optional)');
  public size = input<GpLabelSize>('md');
  public severity = input<GpLabelSeverity>('default');
  public disabled = input<boolean>(false);
  public helpText = input<string | undefined>(undefined);
}
