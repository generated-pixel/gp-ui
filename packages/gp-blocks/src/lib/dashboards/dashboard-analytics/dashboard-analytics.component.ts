import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-analytics',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent, GpProgressBarComponent],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss'
})
export class GpDashboardAnalyticsComponent {
  channels = [
    { name: 'Organic Search (Google, Bing)', pct: 48, users: '231.8K' },
    { name: 'Direct Traffic', pct: 28, users: '135.2K' },
    { name: 'Referral & Backlinks', pct: 14, users: '67.6K' },
    { name: 'Social & Campaigns', pct: 10, users: '48.3K' }
  ];

  regions = [
    { country: 'United States', sessions: '198,400', pct: 41 },
    { country: 'Germany', sessions: '68,200', pct: 14 },
    { country: 'United Kingdom', sessions: '54,100', pct: 11 },
    { country: 'Japan', sessions: '38,900', pct: 8 },
    { country: 'Canada', sessions: '32,500', pct: 7 }
  ];
}
