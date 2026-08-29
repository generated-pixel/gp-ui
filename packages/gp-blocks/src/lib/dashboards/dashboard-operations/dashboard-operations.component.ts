import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-operations',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent, GpProgressBarComponent],
  templateUrl: './dashboard-operations.component.html',
  styleUrl: './dashboard-operations.component.scss'
})
export class GpDashboardOperationsComponent {
  nodes = [
    { name: 'us-east-cluster-01 (N. Virginia)', status: 'Healthy', cpu: 42, ram: 58, latency: 18, rps: '4.8K' },
    { name: 'eu-west-cluster-01 (Frankfurt)', status: 'Healthy', cpu: 38, ram: 49, latency: 24, rps: '3.2K' },
    { name: 'ap-southeast-cluster-01 (Tokyo)', status: 'Healthy', cpu: 64, ram: 72, latency: 35, rps: '5.1K' }
  ];
}
