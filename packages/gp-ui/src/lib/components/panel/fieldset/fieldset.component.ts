import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpPanelBaseComponent } from '../../../base/gp-panel-base.component';

@Component({
  selector: 'gp-fieldset',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.component.scss'
})
export class GpFieldsetComponent extends GpPanelBaseComponent {
  public legend = input<string>('', { alias: 'legend' });
}
