import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-empty-state',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class GpEmptyStateComponent extends GpBaseComponent {
  @Input() title = 'No records found';
  @Input() message = 'There is currently no data to display.';
  @Input() icon = 'search';
}
