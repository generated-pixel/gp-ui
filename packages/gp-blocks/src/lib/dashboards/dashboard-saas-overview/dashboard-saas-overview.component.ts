import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpBadgeComponent,
  GpButtonComponent,
  GpIconComponent,
  GpProgressBarComponent
} from '@generatedpixel/gp-ui';

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
    GpProgressBarComponent
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

  public kpiClick = output<GpSaasKpi>();
  public customerClick = output<GpSaasSignupRow>();
  public exportClick = output<void>();
}
