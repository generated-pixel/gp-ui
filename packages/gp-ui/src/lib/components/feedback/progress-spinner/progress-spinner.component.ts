import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-progress-spinner',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.scss'
})
export class GpProgressSpinnerComponent extends GpBaseComponent {
  public strokeWidth = input<string>('2.5rem');
  public value = input<number>(0);
}
