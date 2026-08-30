import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

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
  imports: [CommonModule, GpProgressBarComponent, GpGridComponent],
  templateUrl: './dashboard-analytics.component.html',
  styleUrl: './dashboard-analytics.component.scss'
})
export class GpDashboardAnalyticsComponent {
  public stats = input<GpAnalyticsStat[]>([]);
  public channelsTitle = input<string>('Traffic Acquisition Channels');
  public channels = input<GpChannelStat[]>([]);
  public regionsTitle = input<string>('Geographic User Distribution');
  public regions = input<GpRegionStat[]>([]);

  // Grid Integration
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'stats',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Traffic Overview Stats',
      icon: 'star'
    },
    {
      id: 'channels',
      x: 0,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Traffic Acquisition Channels',
      icon: 'layer-group'
    },
    {
      id: 'regions',
      x: 6,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Geographic User Distribution',
      icon: 'globe'
    }
  ]);

  public statClick = output<GpAnalyticsStat>();
  public channelClick = output<GpChannelStat>();
  public regionClick = output<GpRegionStat>();
  public layoutChange = output<GpGridItem[]>();

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('stats') public contentStats?: TemplateRef<any>;
  @ContentChild('channels') public contentChannels?: TemplateRef<any>;
  @ContentChild('regions') public contentRegions?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
