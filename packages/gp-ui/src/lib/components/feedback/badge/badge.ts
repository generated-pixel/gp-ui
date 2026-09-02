import { GpBase } from '../../../base/gp-base';
import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export type GpBadgeSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
export type GpBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'gp-badge',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './badge.html',
  styleUrl: './badge.scss'
})
export class GpBadge extends GpBase {
  public value = input<string | number | undefined>(undefined);
  public severity = input<GpBadgeSeverity>('primary');
  public size = input<GpBadgeSize>('md');
  public tooltip = input<string | undefined>(undefined);

  public displayTitle = computed(() => {
    if (this.tooltip() !== undefined) {
      return this.tooltip() || null;
    }
    const val = this.value();
    return val !== undefined && val !== null ? String(val) : null;
  });
}
