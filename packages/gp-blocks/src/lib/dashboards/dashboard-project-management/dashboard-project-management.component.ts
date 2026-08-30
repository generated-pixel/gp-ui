import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

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
  imports: [CommonModule, GpBadgeComponent, GpAvatarComponent, GpProgressBarComponent, GpGridComponent],
  templateUrl: './dashboard-project-management.component.html',
  styleUrl: './dashboard-project-management.component.scss'
})
export class GpDashboardProjectManagementComponent {
  public metrics = input<GpSprintMetric[]>([]);
  public columns = input<GpKanbanColumn[]>([]);

  // Grid Integration
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'metrics',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Sprint Velocity Metrics',
      icon: 'star'
    },
    {
      id: 'kanban',
      x: 0,
      y: 2,
      w: 12,
      h: 6,
      minW: 6,
      minH: 4,
      title: 'Active Sprint Board',
      icon: 'layer-group'
    }
  ]);

  public taskClick = output<GpKanbanTask>();
  public metricClick = output<GpSprintMetric>();
  public layoutChange = output<GpGridItem[]>();

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('metrics') public contentMetrics?: TemplateRef<any>;
  @ContentChild('kanban') public contentKanban?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
