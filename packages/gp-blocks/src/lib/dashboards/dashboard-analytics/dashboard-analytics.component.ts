import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpAnalyticsStat {
  title: string;
  value: string;
  change: string;
  trend?: 'pos' | 'neg' | 'neu';
}

export interface GpChannelStat {
  name: string;
  pct: number;
  users: string;
}

export interface GpRegionStat {
  country: string;
  sessions: string;
  pct: number;
}

@Component({
  selector: 'gp-dashboard-analytics',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpProgressBarComponent],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss'
})
export class GpDashboardAnalyticsComponent {
  public stats = input<GpAnalyticsStat[]>([]);
  public channelsTitle = input<string>('');
  public channels = input<GpChannelStat[]>([]);
  public regionsTitle = input<string>('');
  public regions = input<GpRegionStat[]>([]);

  public statClick = output<GpAnalyticsStat>();
  public channelClick = output<GpChannelStat>();
  public regionClick = output<GpRegionStat>();
}
