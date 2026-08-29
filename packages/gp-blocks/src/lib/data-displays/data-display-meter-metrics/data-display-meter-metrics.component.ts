import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpMeterMetricItem {
  id?: string;
  label: string;
  current: string | number;
  max: string | number;
  pct: number;
}

@Component({
  selector: 'gp-data-display-meter-metrics',
  standalone: true,
  imports: [CommonModule, GpProgressBarComponent],
  templateUrl: './data-display-meter-metrics.component.html',
  styleUrl: './data-display-meter-metrics.component.scss'
})
export class GpDataDisplayMeterMetricsComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public meters = input<GpMeterMetricItem[]>([]);

  public meterClick = output<GpMeterMetricItem>();
}
