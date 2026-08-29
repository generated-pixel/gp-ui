import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-data-display-description-list',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './data-display-description-list.component.html',
  styleUrl: './data-display-description-list.component.scss'
})
export class GpDataDisplayDescriptionListComponent {
  @Input() title = 'Cluster Instance Details';
  @Input() subtitle = 'Technical specifications and provisioning configuration.';

  items: Array<{ label: string; value: string; badge?: boolean; badgeSeverity?: any }> = [
    { label: 'Cluster Engine', value: 'Kubernetes v1.31.2' },
    { label: 'Health Status', value: 'Healthy & Balanced', badge: true, badgeSeverity: 'success' },
    { label: 'Node Pool Architecture', value: 'AMD64 EPYC (24 vCPUs / 96GB RAM)' },
    { label: 'Auto-Scaling Limit', value: 'Min 4 / Max 32 Nodes' },
    { label: 'VPC Subnet CIDR', value: '10.0.0.0/16 (Private Dedicated)' },
    { label: 'TLS Certificate Expiry', value: 'Nov 24, 2027 (Auto-Renewing)' }
  ];
}
