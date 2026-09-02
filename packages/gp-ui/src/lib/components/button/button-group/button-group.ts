import { GpBase } from '../../../base/gp-base';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, input } from '@angular/core';

@Component({
  selector: 'gp-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button-group.html',
  styleUrl: './button-group.scss'
})
export class GpButtonGroup extends GpBase {
  public vertical = input<boolean>(false);
}
