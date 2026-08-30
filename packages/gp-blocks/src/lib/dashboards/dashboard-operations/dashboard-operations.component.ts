import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

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
  imports: [CommonModule, GpBadgeComponent, GpProgressBarComponent, GpGridComponent],
  templateUrl: './dashboard-operations.component.html',
  styleUrl: './dashboard-operations.component.scss'
})
export class GpDashboardOperationsComponent {
  public bannerText = input<string>('Global Fleet Infrastructure Status');
  public uptimeBadge = input<string>('99.99% Operational');
  public nodes = input<GpOperationsNode[]>([]);

  // Grid Integration
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'fleet-status',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Infrastructure Fleet Status',
      icon: 'star'
    },
    {
      id: 'nodes-list',
      x: 0,
      y: 2,
      w: 12,
      h: 5,
      minW: 6,
      minH: 3,
      title: 'Active Compute Clusters',
      icon: 'layer-group'
    }
  ]);

  public nodeClick = output<GpOperationsNode>();
  public layoutChange = output<GpGridItem[]>();

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('status') public contentStatus?: TemplateRef<any>;
  @ContentChild('nodes') public contentNodes?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
