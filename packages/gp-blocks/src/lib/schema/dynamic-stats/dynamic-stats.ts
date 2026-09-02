import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpBadge, GpIcon, GpProgressBar } from '@generatedpixel/gp-ui';
import { GpStatsSchema } from '../schema.types';

@Component({
  selector: 'gp-dynamic-stats',
  standalone: true,
  imports: [GpBadge, GpIcon, GpProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-stats.html',
  styleUrl: './dynamic-stats.scss'
})
export class GpDynamicStats {
  public schema = input<GpStatsSchema | undefined>(undefined);
}
