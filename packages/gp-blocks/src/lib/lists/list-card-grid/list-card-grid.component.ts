import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-card-grid',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './list-card-grid.component.html',
  styleUrl: './list-card-grid.component.scss'
})
export class GpListCardGridComponent {
  @Input() title = 'Workspace Repositories';
  @Input() subtitle = 'Active microservice codebases and deployment packages.';

  cards = [
    { title: 'Core Gateway API', desc: 'Central OAuth2 authentication reverse proxy and rate limiter service.', status: 'Active', meta: 'Updated 2h ago', icon: 'box' },
    { title: 'Payment Processing Service', desc: 'PCI-compliant Stripe & PayPal webhook processing pipeline.', status: 'Active', meta: 'Updated 1d ago', icon: 'folder' },
    { title: 'Analytics Telemetry Ingest', desc: 'High-throughput Kafka streaming worker cluster.', status: 'Beta', meta: 'Updated 3d ago', icon: 'layer-group' }
  ];
}
