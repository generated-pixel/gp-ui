import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpBadgeSeverity } from '../badge/badge.component';

@Component({
  selector: 'gp-tag',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class GpTagComponent extends GpBaseComponent {
  @Input() value = '';
  @Input() severity: GpBadgeSeverity = 'primary';
  @Input() icon = '';
  @Input() rounded = false;
}
