import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpBadgeComponent,
  GpButtonComponent,
  GpIconComponent,
  GpProgressBarComponent
} from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

export interface GpSaasKpi {
  id?: string;
  label: string;
  value: string;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  trendText: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export interface GpSaasMonthlyRevenue {
  month: string;
  amt: string;
  pct: number;
}

export interface GpSaasQuotaItem {
  label: string;
  valText: string;
  pct: number;
}

export interface GpSaasSignupRow {
  id?: string;
  name: string;
  domain: string;
  plan: string;
  cycle: string;
  mrr: string;
  status: string;
}

@Component({
  selector: 'gp-dashboard-saas-overview',
  standalone: true,
  imports: [
    CommonModule,
    GpAvatarComponent,
    GpBadgeComponent,
    GpButtonComponent,
    GpIconComponent,
    GpProgressBarComponent,
    GpGridComponent
  ],
  templateUrl: './dashboard-saas-overview.component.html',
  styleUrl: './dashboard-saas-overview.component.scss'
})
export class GpDashboardSaasOverviewComponent {
  public kpis = input<GpSaasKpi[]>([]);
  public chartTitle = input<string>('Monthly Recurring Revenue (MRR)');
  public chartBadge = input<string>('');
  public monthlyData = input<GpSaasMonthlyRevenue[]>([]);
  public goalsTitle = input<string>('Target Conversion Quotas');
  public goalsTarget = input<string>('');
  public quotas = input<GpSaasQuotaItem[]>([]);
  public tableTitle = input<string>('Recent Organization Subscriptions');
  public exportBtnLabel = input<string>('Export CSV');
  public recentSignups = input<GpSaasSignupRow[]>([]);

  // Grid Integration Properties
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'kpis',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Key Performance Indicators',
      icon: 'star'
    },
    {
      id: 'revenue-chart',
      x: 0,
      y: 2,
      w: 8,
      h: 4,
      minW: 4,
      minH: 3,
      title: 'Monthly Recurring Revenue (MRR)',
      icon: 'layer-group'
    },
    {
      id: 'conversion-quotas',
      x: 8,
      y: 2,
      w: 4,
      h: 4,
      minW: 3,
      minH: 3,
      title: 'Target Conversion Quotas',
      icon: 'sliders'
    },
    {
      id: 'recent-signups',
      x: 0,
      y: 6,
      w: 12,
      h: 4,
      minW: 6,
      minH: 3,
      title: 'Recent Organization Subscriptions',
      icon: 'users'
    }
  ]);

  public kpiClick = output<GpSaasKpi>();
  public customerClick = output<GpSaasSignupRow>();
  public exportClick = output<void>();
  public layoutChange = output<GpGridItem[]>();

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('kpis') public contentKpis?: TemplateRef<any>;
  @ContentChild('chart') public contentChart?: TemplateRef<any>;
  @ContentChild('quotas') public contentQuotas?: TemplateRef<any>;
  @ContentChild('table') public contentTable?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
