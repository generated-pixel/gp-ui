import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpProgressBarMode = 'determinate' | 'indeterminate';

@Component({
  selector: 'gp-progress-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class GpProgressBarComponent extends GpEditableBaseComponent {
  @Input() override value = 0;
  @Input() mode: GpProgressBarMode = 'determinate';
  @Input() showValue = true;
  @Input() height = '0.75rem';
}
