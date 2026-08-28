import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

export interface GpMeterItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'gp-meter-group',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './meter-group.component.html',
  styleUrl: './meter-group.component.scss'
})
export class GpMeterGroupComponent extends GpBaseComponent {
  public value = input<GpMeterItem[]>([]);
  public max = input<number>(100);
}
