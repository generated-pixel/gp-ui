import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-project-management',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent],
  templateUrl: './dashboard-project-management.component.html',
  styleUrl: './dashboard-project-management.component.scss'
})
export class GpDashboardProjectManagementComponent {}
