import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-data-display-kpi-cards',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './data-display-kpi-cards.component.html',
  styleUrl: './data-display-kpi-cards.component.scss'
})
export class GpDataDisplayKpiCardsComponent {
  kpis = [
    { label: 'Total Revenue', value: '$842,900', icon: 'star', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3b82f6', change: '+18.2%', isUp: true, caption: 'vs last quarter' },
    { label: 'Total Subscriptions', value: '4,280', icon: 'users', iconBg: 'rgba(16,185,129,0.1)', iconColor: '#10b981', change: '+6.4%', isUp: true, caption: 'new accounts' },
    { label: 'Avg Order Value', value: '$198.50', icon: 'folder', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#8b5cf6', change: '+2.1%', isUp: true, caption: 'growth per sale' },
    { label: 'Support Tickets', value: '18 Open', icon: 'clock', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#f59e0b', change: '-12.5%', isUp: true, caption: 'resolved in <1h' }
  ];
}
