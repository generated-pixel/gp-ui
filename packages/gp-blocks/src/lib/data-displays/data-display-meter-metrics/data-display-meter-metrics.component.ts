import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpProgressBarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-data-display-meter-metrics',
  standalone: true,
  imports: [CommonModule, GpProgressBarComponent],
  templateUrl: './data-display-meter-metrics.component.html',
  styleUrl: './data-display-meter-metrics.component.scss'
})
export class GpDataDisplayMeterMetricsComponent {
  @Input() title = 'Resource Quotas & Limits';
  @Input() subtitle = 'Monthly allocated infrastructure capacity consumption.';

  meters = [
    { label: 'Compute Engine (vCPUs)', current: '42', max: '64 vCPUs', pct: 65 },
    { label: 'High-Performance SSD Storage', current: '780 GB', max: '1,000 GB', pct: 78 },
    { label: 'Outbound CDN Bandwidth', current: '3.4 TB', max: '10 TB', pct: 34 },
    { label: 'Encrypted Database Replicas', current: '3', max: '4 Replicas', pct: 75 }
  ];
}
