import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent, GpBreadcrumbComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-page-with-actions',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent, GpBreadcrumbComponent],
  templateUrl: './header-page-with-actions.component.html',
  styleUrl: './header-page-with-actions.component.scss'
})
export class GpHeaderPageWithActionsComponent {
  @Input() title = 'us-east-cluster-01';
  @Input() badgeText = 'Healthy';
  @Input() description = 'Primary production Kubernetes cluster with 24 worker nodes and autoscaling enabled.';
}
