import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'gp-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button-group.component.html',
  styleUrl: './button-group.component.scss'
})
export class GpButtonGroupComponent extends GpBaseComponent {
  public vertical = input<boolean>(false);
}
