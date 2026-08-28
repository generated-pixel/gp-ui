import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  public value = input<string | number | undefined>(undefined);
  public severity = input<GpBadgeSeverity>('primary');
  public size = input<GpBadgeSize>('md');
}
