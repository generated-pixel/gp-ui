import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-data-display-stats-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-display-stats-counter.component.html',
  styleUrl: './data-display-stats-counter.component.scss'
})
export class GpDataDisplayStatsCounterComponent {
  counters = [
    { number: '99.99%', label: 'Guaranteed SLA Uptime', desc: 'Continuous multi-region high availability deployments.' },
    { number: '10M+', label: 'Daily API Transactions', desc: 'Sub-millisecond latency processed through global edge CDN.' },
    { number: '4,500+', label: 'Enterprise Customers', desc: 'Trusted by world-leading tech and healthcare companies.' }
  ];
}
