import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpOperationsNode {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Offline' | string;
  cpu: number;
  ram: number;
  latency: number;
  rps: string;
}

@Component({
  selector: 'gp-dashboard-operations',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpProgressBarComponent],
  templateUrl: './dashboard-operations.component.html',
  styleUrl: './dashboard-operations.component.scss'
})
export class GpDashboardOperationsComponent {
  public bannerText = input<string>('');
  public uptimeBadge = input<string>('');
  public nodes = input<GpOperationsNode[]>([]);

  public nodeClick = output<GpOperationsNode>();
}
