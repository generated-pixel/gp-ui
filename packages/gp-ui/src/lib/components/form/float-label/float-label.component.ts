import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpFloatLabelVariant } from './float-label.interface';

@Component({
  selector: 'gp-float-label, gp-floatlabel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './float-label.component.html',
  styleUrl: './float-label.component.scss'
})
export class GpFloatLabelComponent {
  public variant = input<GpFloatLabelVariant>('on');
  public always = input<boolean>(false);
}
