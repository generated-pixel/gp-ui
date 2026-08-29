import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpIconComponent,
  GpBadgeComponent,
  GpProgressBarComponent,
  GpTableComponent,
  GpColumnComponent,
  GpAvatarComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-saas-overview',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpIconComponent,
    GpBadgeComponent,
    GpProgressBarComponent,
    GpTableComponent,
    GpColumnComponent,
    GpAvatarComponent
  ],
  templateUrl: './dashboard-saas-overview.component.html',
  styleUrl: './dashboard-saas-overview.component.scss'
})
export class GpDashboardSaasOverviewComponent {
  monthlyData = [
    { month: 'Apr', pct: 60, amt: '$160K' },
    { month: 'May', pct: 72, amt: '$182K' },
    { month: 'Jun', pct: 68, amt: '$175K' },
    { month: 'Jul', pct: 85, amt: '$198K' },
    { month: 'Aug', pct: 92, amt: '$208K' },
    { month: 'Sep', pct: 100, amt: '$218K' }
  ];

  recentSignups = [
    { name: 'Apex Global Logistics', domain: 'apexlogistics.com', plan: 'Enterprise Unlimited', cycle: 'Annual ($48,000)', mrr: '$4,000/mo', status: 'Active' },
    { name: 'CloudScale Data Corp', domain: 'cloudscale.ai', plan: 'Enterprise Scale', cycle: 'Annual ($32,000)', mrr: '$2,667/mo', status: 'Active' },
    { name: 'Vanguard Security Labs', domain: 'vanguardsec.io', plan: 'Pro Plus', cycle: 'Monthly ($1,200)', mrr: '$1,200/mo', status: 'Active' },
    { name: 'Synapse AI Systems', domain: 'synapse-ai.dev', plan: 'Custom Pilot', cycle: 'Quarterly ($6,000)', mrr: '$2,000/mo', status: 'In Review' }
  ];
}
