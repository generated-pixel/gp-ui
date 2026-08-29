import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpIconComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpStatsSchema, GpStatCardItem } from '../schema.types';

@Component({
  selector: 'gp-dynamic-stats',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpIconComponent, GpProgressBarComponent],
  templateUrl: './dynamic-stats.component.html',
  styleUrl: './dynamic-stats.component.scss'
})
export class GpDynamicStatsComponent {
  @Input() schema?: GpStatsSchema;
}
