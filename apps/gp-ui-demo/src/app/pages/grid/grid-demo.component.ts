import {
  Component,
  signal,
  computed,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpGridComponent,
  GpGridWidgetComponent,
  GpGridItem,
  GpGridChangeEvent,
  GpGridCompactType
} from 'gp-grid';
import {
  GpButtonComponent,
  GpBadgeComponent,
  GpSwitchComponent,
  GpTagComponent,
  GpProgressBarComponent
} from 'gp-ui';
import { GpIconComponent } from 'gp-ui-icons';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

export interface WidgetPayload {
  type: 'kpi-revenue' | 'kpi-server' | 'chart-analytics' | 'table-nodes' | 'list-activity' | 'locked-banner' | 'media' | 'notes';
  data?: any;
}

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpGridComponent,
    GpGridWidgetComponent,
    GpSwitchComponent,
    GpIconComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  templateUrl: './grid-demo.component.html',
  styleUrl: './grid-demo.component.scss'
})
export class GridDemoComponent {
  @ViewChild(GpGridComponent) public gridComponent?: GpGridComponent;

  // --- GRID CONTROLS SIGNALS ---
  public columns = signal<number>(12);
  public rowHeight = signal<number>(85);
  public gap = signal<number>(16);
  public compactMode = signal<GpGridCompactType>('vertical');
  public showGridLines = signal<boolean>(true);
  public animateTransitions = signal<boolean>(true);
  public isReadonly = signal<boolean>(false);
  public activeTab = signal<'demo' | 'api'>('demo');
  public showInspector = signal<boolean>(false);
  public lastEventLog = signal<string>('Grid initialized with signals. Drag widgets to test realignment.');

  // --- WIDGETS MODEL SIGNAL ---
  public widgets = signal<GpGridItem<WidgetPayload>[]>([]);

  // --- LOG OF LAST EVENTS ---
  public eventHistory = signal<string[]>([]);

  constructor() {
    this.loadDefaultPreset();
  }

  public loadDefaultPreset(): void {
    const defaultWidgets: GpGridItem<WidgetPayload>[] = [
      {
        id: 'w-kpi-rev',
        title: 'Monthly Recurring Revenue',
        badge: '+18.4%',
        badgeSeverity: 'success',
        icon: 'star',
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        minW: 3,
        minH: 2,
        draggable: true,
        resizable: true,
        closeable: true,
        fixed: false,
        locked: false,
        customData: { type: 'kpi-revenue' }
      },
      {
        id: 'w-kpi-srv',
        title: 'System Cluster Health',
        badge: '99.98% SLA',
        badgeSeverity: 'info',
        icon: 'sliders',
        x: 4,
        y: 0,
        w: 4,
        h: 2,
        minW: 3,
        minH: 2,
        draggable: true,
        resizable: true,
        closeable: true,
        fixed: false,
        locked: false,
        customData: { type: 'kpi-server' }
      },
      {
        id: 'w-locked-alert',
        title: '🔒 Core Infrastructure Anchor',
        badge: 'LOCKED',
        badgeSeverity: 'warning',
        icon: 'lock',
        x: 8,
        y: 0,
        w: 4,
        h: 2,
        minW: 3,
        minH: 2,
        draggable: false,
        resizable: false,
        closeable: false,
        fixed: true,
        locked: true, // LOCKED IN PLACE: will never move, and widgets cannot be dropped over it
        customData: { type: 'locked-banner' }
      },
      {
        id: 'w-chart',
        title: 'Traffic & Request Telemetry',
        badge: 'Live',
        badgeSeverity: 'primary',
        icon: 'sparkles',
        x: 0,
        y: 2,
        w: 8,
        h: 3,
        minW: 4,
        minH: 2,
        draggable: true,
        resizable: true,
        closeable: true,
        fixed: false,
        locked: false,
        customData: { type: 'chart-analytics' }
      },
      {
        id: 'w-activity',
        title: 'Audit & Deployment Stream',
        badge: 'Real-time',
        badgeSeverity: 'primary',
        icon: 'list',
        x: 8,
        y: 2,
        w: 4,
        h: 3,
        minW: 3,
        minH: 2,
        draggable: true,
        resizable: true,
        closeable: true,
        fixed: false,
        locked: false,
        customData: { type: 'list-activity' }
      }
    ];

    this.widgets.set(defaultWidgets);
    this.logEvent('Preset loaded with 5 sample widgets (including a locked anchor widget).');
  }

  public clearAllWidgets(): void {
    this.widgets.set([]);
    this.logEvent('All widgets cleared. Grid is now empty.');
  }

  public addWidget(type: WidgetPayload['type']): void {
    const id = `w-${type}-${Date.now().toString().slice(-4)}`;

    let itemConfig: Partial<GpGridItem<WidgetPayload>> = {
      id,
      customData: { type }
    };

    switch (type) {
      case 'kpi-revenue':
        itemConfig = {
          ...itemConfig,
          title: 'Quarterly Sales Forecast',
          badge: '+24.1%',
          badgeSeverity: 'success',
          w: 4,
          h: 2,
          minW: 3,
          minH: 2
        };
        break;
      case 'kpi-server':
        itemConfig = {
          ...itemConfig,
          title: 'Memory & Cache Load',
          badge: 'Optimal',
          badgeSeverity: 'info',
          w: 4,
          h: 2,
          minW: 3,
          minH: 2
        };
        break;
      case 'chart-analytics':
        itemConfig = {
          ...itemConfig,
          title: 'Regional Bandwidth Usage',
          badge: 'Live',
          badgeSeverity: 'primary',
          w: 6,
          h: 3,
          minW: 4,
          minH: 2
        };
        break;
      case 'table-nodes':
        itemConfig = {
          ...itemConfig,
          title: 'Cluster Nodes Matrix',
          badge: '4 Active',
          badgeSeverity: 'success',
          w: 6,
          h: 3,
          minW: 4,
          minH: 2
        };
        break;
      case 'list-activity':
        itemConfig = {
          ...itemConfig,
          title: 'Recent Security Events',
          badge: 'Events',
          badgeSeverity: 'warning',
          w: 4,
          h: 3,
          minW: 3,
          minH: 2
        };
        break;
      case 'locked-banner':
        itemConfig = {
          ...itemConfig,
          title: '🔒 Primary Database Node (Locked)',
          badge: 'LOCKED',
          badgeSeverity: 'warning',
          w: 4,
          h: 2,
          minW: 3,
          minH: 2,
          locked: true,
          fixed: true,
          draggable: false,
          resizable: false
        };
        break;
      case 'media':
        itemConfig = {
          ...itemConfig,
          title: 'Architecture Blueprint',
          badge: 'Asset',
          badgeSeverity: 'primary',
          w: 4,
          h: 3,
          minW: 3,
          minH: 2
        };
        break;
      case 'notes':
        itemConfig = {
          ...itemConfig,
          title: 'Release Notes & Checklist',
          badge: 'Draft',
          badgeSeverity: 'info',
          w: 4,
          h: 2,
          minW: 3,
          minH: 2
        };
        break;
    }

    if (this.gridComponent) {
      const added = this.gridComponent.addWidget(itemConfig as any, itemConfig.w || 4, itemConfig.h || 2);
      this.logEvent(`Added widget "${added.title}" at position (${added.x}, ${added.y}) [${added.w}x${added.h}].`);
    }
  }

  public toggleItemLock(item: GpGridItem): void {
    const nextLocked = !item.locked;
    const updated = this.widgets().map((it) =>
      it.id === item.id ? { ...it, locked: nextLocked } : it
    );
    this.widgets.set(updated);
    this.logEvent(`Widget "${item.title || item.id}" locked state changed to ${nextLocked}.`);
  }

  public onItemMoved(e: GpGridChangeEvent): void {
    this.logEvent(
      `Widget "${e.item.title || e.item.id}" moved from (${e.oldX}, ${e.oldY}) to (${e.newX}, ${e.newY}).`
    );
  }

  public onItemResized(e: GpGridChangeEvent): void {
    this.logEvent(
      `Widget "${e.item.title || e.item.id}" resized from ${e.oldW}x${e.oldH} to ${e.newW}x${e.newH}.`
    );
  }

  public onItemRemoved(item: GpGridItem): void {
    this.logEvent(`Widget "${item.title || item.id}" was closed and removed.`);
  }

  public onOptionsClicked(e: { event: MouseEvent; item: GpGridItem }): void {
    this.logEvent(`Options button clicked for widget "${e.item.title || e.item.id}".`);
  }

  public compactGrid(): void {
    this.gridComponent?.compact();
    this.logEvent('Grid compacted vertically.');
  }

  public formattedJson = computed(() => {
    return JSON.stringify(
      this.widgets().map((w) => ({
        id: w.id,
        title: w.title,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        locked: !!w.locked,
        fixed: !!w.fixed,
        draggable: w.draggable !== false,
        resizable: w.resizable !== false,
        closeable: w.closeable !== false
      })),
      null,
      2
    );
  });

  private logEvent(msg: string): void {
    this.lastEventLog.set(msg);
    this.eventHistory.update((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 19)
    ]);
  }

  // --- API DOCUMENTATION DATA ---
  public importCode = `import { GpGridComponent, GpGridWidgetComponent, GpGridItem } from 'gp-grid';`;

  public usageCode = `@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GpGridComponent, GpGridWidgetComponent],
  template: \`
    <gp-grid
      [(items)]="widgets"
      [columns]="12"
      [rowHeight]="80"
      [gap]="16"
      compactType="vertical"
      (itemMoved)="onItemMoved($event)"
      (itemResized)="onItemResized($event)"
    >
      <ng-template #widgetTemplate let-item>
        <gp-grid-widget
          [item]="item"
          [title]="item.title"
          [locked]="item.locked"
          [fixed]="item.fixed"
        >
          <!-- Any custom widget content here (KPI, Table, Chart, List) -->
          <div class="my-kpi-body">
            <h3>\${{ item.customData?.value }}</h3>
          </div>
        </gp-grid-widget>
      </ng-template>
    </gp-grid>
  \`
})
export class DashboardComponent {
  // Angular Signal Model
  public widgets = signal<GpGridItem[]>([
    { id: '1', x: 0, y: 0, w: 4, h: 2, title: 'Revenue KPI' },
    { id: '2', x: 4, y: 0, w: 4, h: 2, title: 'Server Load' },
    { id: '3', x: 8, y: 0, w: 4, h: 2, title: 'Critical Alert', locked: true }
  ]);
}`;

  public gridProperties: DocApiProperty[] = [
    {
      name: 'items',
      type: 'model<GpGridItem[]>',
      default: '[]',
      description: 'Two-way bound signal holding all grid widget items.'
    },
    {
      name: 'columns',
      type: 'input<number>',
      default: '12',
      description: 'Number of columns in the grid canvas.'
    },
    {
      name: 'rowHeight',
      type: 'input<number>',
      default: '80',
      description: 'Height of each grid row unit in pixels.'
    },
    {
      name: 'gap',
      type: 'input<number>',
      default: '16',
      description: 'Spacing between widgets in pixels.'
    },
    {
      name: 'minRows',
      type: 'input<number>',
      default: '2',
      description: 'Minimum number of rows rendered in container.'
    },
    {
      name: 'compactType',
      type: "input<'vertical' | 'none'>",
      default: "'vertical'",
      description: 'Compaction mode: vertical pack upwards vs free placement.'
    },
    {
      name: 'animate',
      type: 'input<boolean>',
      default: 'true',
      description: 'Hardware-accelerated CSS transition animations on layout shifts.'
    },
    {
      name: 'readonly',
      type: 'input<boolean>',
      default: 'false',
      description: 'Disables all drag and resize interactions when set to true.'
    },
    {
      name: 'showGridLines',
      type: 'input<boolean>',
      default: 'false',
      description: 'Displays subtle column guide lines overlay.'
    }
  ];

  public gridEvents: DocApiProperty[] = [
    {
      name: 'itemMoved',
      type: 'output<GpGridChangeEvent>',
      default: '-',
      description: 'Emitted when a widget finishes being dragged to a new position.'
    },
    {
      name: 'itemResized',
      type: 'output<GpGridChangeEvent>',
      default: '-',
      description: 'Emitted when a widget finishes being resized.'
    },
    {
      name: 'itemRemoved',
      type: 'output<GpGridItem>',
      default: '-',
      description: 'Emitted when a widget is closed/removed from the grid.'
    },
    {
      name: 'itemOptionsClick',
      type: 'output<{ event: MouseEvent; item: GpGridItem }>',
      default: '-',
      description: 'Emitted when a widget options button is clicked.'
    },
    {
      name: 'layoutChanged',
      type: 'output<GpGridItem[]>',
      default: '-',
      description: 'Emitted whenever any item changes position or size.'
    }
  ];

  public widgetProperties: DocApiProperty[] = [
    {
      name: 'item',
      type: 'input<GpGridItem>',
      default: 'undefined',
      description: 'Backing grid item configuration object.'
    },
    {
      name: 'title',
      type: 'input<string>',
      default: "''",
      description: 'Title rendered in the widget header bar.'
    },
    {
      name: 'showHeader',
      type: 'input<boolean>',
      default: 'true',
      description: 'Whether the widget header bar is rendered.'
    },
    {
      name: 'draggable',
      type: 'input<boolean>',
      default: 'true',
      description: 'Whether the widget can be dragged by its header handle.'
    },
    {
      name: 'resizable',
      type: 'input<boolean>',
      default: 'true',
      description: 'Whether the bottom-right corner resize handle is enabled.'
    },
    {
      name: 'closeable',
      type: 'input<boolean>',
      default: 'true',
      description: 'Whether the close button is rendered in the header.'
    },
    {
      name: 'fixed',
      type: 'input<boolean>',
      default: 'false',
      description: 'Fixed in place: user cannot drag or resize the widget.'
    },
    {
      name: 'locked',
      type: 'input<boolean>',
      default: 'false',
      description: 'Locked in place: NEVER displaced by other moving widgets and cannot be dropped on.'
    }
  ];
}
