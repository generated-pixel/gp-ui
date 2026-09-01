import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpIconComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpStatsSchema } from '../schema.types';

@Component({
  selector: 'gp-dynamic-stats',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpIconComponent, GpProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-stats.component.html',
  styleUrl: './dynamic-stats.component.scss'
})
export class GpDynamicStatsComponent {
  public schema = input<GpStatsSchema | undefined>(undefined);
}
