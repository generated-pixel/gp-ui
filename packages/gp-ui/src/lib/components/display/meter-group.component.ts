import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

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
export class GpMeterGroupComponent extends GpEditableBaseComponent {
  @Input() override value: GpMeterItem[] = [];
  @Input() max = 100;
}
