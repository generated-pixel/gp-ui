import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GpBadgeSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
export type GpBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'gp-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class GpBadgeComponent extends GpBaseComponent {
  @Input() value?: string | number;
  @Input() severity: GpBadgeSeverity = 'primary';
  @Input() size: GpBadgeSize = 'md';
}
