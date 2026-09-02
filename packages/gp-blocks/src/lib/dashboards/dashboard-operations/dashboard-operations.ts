import {
  Component,
  input,
  output,
  model,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadge, GpProgressBar } from '@generatedpixel/gp-ui';
import { GpGrid, GpGridItem } from '@generatedpixel/gp-grid';

export interface GpOperationsNode {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Offline' | string;
  cpu: number;
  ram: number;
  latency: number;
  rps: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-dashboard-operations',
  standalone: true,
  imports: [CommonModule, GpBadge, GpProgressBar, GpGrid],
  templateUrl: './dashboard-operations.html',
  styleUrl: './dashboard-operations.scss'
})
export class GpDashboardOperations {
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

  public widgetTemplate = input<TemplateRef<{ $implicit: GpGridItem }> | undefined>(undefined);
  public headerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentWidgetTemplate = contentChild<TemplateRef<{ $implicit: GpGridItem }>>('widgetTemplate');
  public contentStatus = contentChild<TemplateRef<any>>('status');
  public contentNodes = contentChild<TemplateRef<any>>('nodes');
  public contentHeaderActions = contentChild<TemplateRef<any>>('headerActions');

  public effectiveWidgetTemplate = computed(() => this.widgetTemplate() || this.contentWidgetTemplate());

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
