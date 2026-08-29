import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpSprintMetric {
  title: string;
  value: string;
  subText?: string;
  progress?: number;
}

export interface GpKanbanTask {
  tag: string;
  tagType?: 'feat' | 'bug' | 'chore' | string;
  title: string;
  assigneeLabel: string;
  points: string;
}

export interface GpKanbanColumn {
  title: string;
  count: number | string;
  badgeSeverity?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  tasks: GpKanbanTask[];
}

@Component({
  selector: 'gp-dashboard-project-management',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent],
  templateUrl: './dashboard-project-management.component.html',
  styleUrl: './dashboard-project-management.component.scss'
})
export class GpDashboardProjectManagementComponent {
  public metrics = input<GpSprintMetric[]>([]);
  public columns = input<GpKanbanColumn[]>([]);

  public taskClick = output<GpKanbanTask>();
  public metricClick = output<GpSprintMetric>();
}
