import { CdkDragDrop, CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  Dashboard,
  DashboardWidget,
  DesignedItem,
  Designer,
  DesignerArtifactType,
  SelectedField,
  Widget,
} from 'gp-analytics';

const SAMPLE_REVENUE_ITEM: DesignedItem = {
  metadata: {
    id: 'demo-revenue-kpi',
    name: 'Revenue KPI',
    artifactType: 'kpi',
    fields: [],
    generatedAt: '2026-03-24T12:00:00.000Z',
  },
  style: {
    tone: 'accent',
    highlighted: true,
  },
  data: {
    summary: 'Generated from the designer configuration on the server.',
    points: [
      {
        key: 'revenue',
        label: 'Revenue',
        value: 128400,
        valueType: 'currency',
      },
      {
        key: 'growth',
        label: 'Growth',
        value: 0.12,
        valueType: 'percent',
      },
    ],
  },
};

interface WidgetTemplate {
  key: string;
  title: string;
  artifactType: DesignerArtifactType;
  summary: string;
  tone?: DesignedItem['style'] extends undefined
    ? never
    : NonNullable<DesignedItem['style']>['tone'];
  defaultW: number;
  defaultH: number;
}

interface WidgetDropPreview {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
}

@Component({
  selector: 'app-root',
  imports: [Dashboard, Designer, Widget, DragDropModule, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly revenueItem = SAMPLE_REVENUE_ITEM;
  protected readonly dashboardColumns = 12;
  protected readonly dashboardCellWidth = 64;
  protected readonly dashboardCellHeight = 64;
  protected readonly dashboardGap = 8;
  protected readonly widgetTemplates: WidgetTemplate[] = [
    {
      key: 'template-kpi',
      title: 'KPI Tile',
      artifactType: 'kpi',
      summary: 'A compact KPI card for headline metrics.',
      tone: 'accent',
      defaultW: 4,
      defaultH: 3,
    },
    {
      key: 'template-chart',
      title: 'Chart Tile',
      artifactType: 'graph',
      summary: 'A chart tile for trend and comparison visuals.',
      tone: 'muted',
      defaultW: 6,
      defaultH: 4,
    },
    {
      key: 'template-table',
      title: 'Table Tile',
      artifactType: 'tabular',
      summary: 'A tabular widget for detailed records.',
      tone: 'default',
      defaultW: 6,
      defaultH: 4,
    },
  ];
  protected readonly dashboardWidgets = signal<DashboardWidget[]>([
    {
      id: 'widget-total-users',
      title: 'Total Users',
      layout: { x: 0, y: 0, w: 4, h: 3 },
      item: {
        metadata: {
          id: 'total-users',
          name: 'Total Users',
          artifactType: 'kpi',
          fields: [],
        },
        data: {
          summary: '42,891 active users this month.',
        },
      },
    },
    {
      id: 'widget-revenue',
      layout: { x: 4, y: 0, w: 4, h: 4 },
      item: SAMPLE_REVENUE_ITEM,
    },
    {
      id: 'widget-conversion',
      title: 'Conversion Rate',
      locked: true,
      layout: { x: 8, y: 0, w: 4, h: 3 },
      item: {
        metadata: {
          id: 'conversion-rate',
          name: 'Conversion Rate',
          artifactType: 'kpi',
          fields: [],
        },
        data: {
          summary: '3.7% across all campaigns.',
        },
      },
    },
  ]);
  protected readonly selectedWidgetId = signal<string>('widget-total-users');
  protected readonly selectedWidget = computed(() =>
    this.dashboardWidgets().find((widget) => widget.id === this.selectedWidgetId()),
  );
  protected readonly activeTemplate = signal<WidgetTemplate | undefined>(undefined);
  protected readonly dropPreview = signal<WidgetDropPreview | undefined>(undefined);
  protected readonly dropPreviewHasCollision = computed(() => {
    const preview = this.dropPreview();
    if (!preview) {
      return false;
    }

    return this.dashboardWidgets().some((widget) => {
      const aLeft = preview.x;
      const aRight = preview.x + preview.w;
      const aTop = preview.y;
      const aBottom = preview.y + preview.h;

      const bLeft = widget.layout.x;
      const bRight = widget.layout.x + widget.layout.w;
      const bTop = widget.layout.y;
      const bBottom = widget.layout.y + widget.layout.h;

      return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
    });
  });
  protected readonly previewLeftPx = computed(() => {
    const preview = this.dropPreview();
    if (!preview) {
      return 0;
    }

    return preview.x * (this.dashboardCellWidth + this.dashboardGap);
  });
  protected readonly previewTopPx = computed(() => {
    const preview = this.dropPreview();
    if (!preview) {
      return 0;
    }

    return preview.y * (this.dashboardCellHeight + this.dashboardGap);
  });
  protected readonly previewWidthPx = computed(() => {
    const preview = this.dropPreview();
    if (!preview) {
      return 0;
    }

    return preview.w * this.dashboardCellWidth + (preview.w - 1) * this.dashboardGap;
  });
  protected readonly previewHeightPx = computed(() => {
    const preview = this.dropPreview();
    if (!preview) {
      return 0;
    }

    return preview.h * this.dashboardCellHeight + (preview.h - 1) * this.dashboardGap;
  });
  protected readonly artifactTypes: DesignerArtifactType[] = ['tabular', 'graph', 'kpi'];

  protected handleWidgetsChange(widgets: DashboardWidget[]): void {
    this.dashboardWidgets.set(widgets);
    const selected = this.selectedWidgetId();
    if (!widgets.some((widget) => widget.id === selected)) {
      this.selectedWidgetId.set(widgets[0]?.id ?? '');
    }
  }

  protected selectWidget(widgetId: string): void {
    this.selectedWidgetId.set(widgetId);
  }

  protected addWidget(): void {
    const current = this.dashboardWidgets();
    const nextIndex = current.length + 1;
    const maxY = current.reduce((highest, widget) => {
      const bottom = widget.layout.y + widget.layout.h;
      return bottom > highest ? bottom : highest;
    }, 0);
    const id = `widget-custom-${Date.now()}`;
    const newWidget: DashboardWidget = {
      id,
      title: `Custom Widget ${nextIndex}`,
      layout: { x: 0, y: maxY, w: 4, h: 3 },
      item: {
        metadata: {
          id,
          name: `Custom Widget ${nextIndex}`,
          artifactType: 'tabular',
          fields: [],
        },
        data: {
          summary: 'Define what this widget should use.',
        },
      },
    };

    this.dashboardWidgets.update((widgets) => [...widgets, newWidget]);
    this.selectedWidgetId.set(id);
  }

  protected onTemplateDropped(event: CdkDragDrop<DashboardWidget[], WidgetTemplate[]>): void {
    const preview = this.dropPreview();
    this.clearTemplatePreview();

    if (event.previousContainer.id === event.container.id) {
      return;
    }

    const template = event.item.data;
    if (!template) {
      return;
    }

    const placement =
      preview && preview.w === template.defaultW && preview.h === template.defaultH
        ? preview
        : this.resolveGridPlacement(event.dropPoint.x, event.dropPoint.y, template);

    if (!placement) {
      return;
    }

    const id = `widget-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newWidget: DashboardWidget = {
      id,
      title: template.title,
      fixed: false,
      layout: {
        x: placement.x,
        y: placement.y,
        w: template.defaultW,
        h: template.defaultH,
      },
      item: {
        metadata: {
          id,
          name: template.title,
          artifactType: template.artifactType,
          fields: [],
        },
        style: {
          tone: template.tone,
        },
        data: {
          summary: template.summary,
        },
      },
    };

    this.dashboardWidgets.update((widgets) => [...widgets, newWidget]);
    this.selectedWidgetId.set(id);
  }

  protected onTemplateDragStarted(template: WidgetTemplate): void {
    this.activeTemplate.set(template);
  }

  protected onTemplateDragMoved(event: CdkDragMove<WidgetTemplate>): void {
    const template = event.source.data;
    if (!template) {
      return;
    }

    this.activeTemplate.set(template);
    const placement = this.resolveGridPlacement(
      event.pointerPosition.x,
      event.pointerPosition.y,
      template,
    );
    this.dropPreview.set(placement);
  }

  protected onTemplateDragEnded(_event: CdkDragEnd<WidgetTemplate>): void {
    this.clearTemplatePreview();
  }

  protected removeSelectedWidget(): void {
    const selected = this.selectedWidgetId();
    if (!selected) {
      return;
    }

    this.dashboardWidgets.update((widgets) => widgets.filter((widget) => widget.id !== selected));
    const first = this.dashboardWidgets()[0];
    this.selectedWidgetId.set(first?.id ?? '');
  }

  protected updateSelectedTitle(title: string): void {
    this.updateSelectedWidget((widget) => ({
      ...widget,
      title,
      item: widget.item
        ? {
            ...widget.item,
            metadata: {
              ...widget.item.metadata,
              name: title,
            },
          }
        : widget.item,
    }));
  }

  protected updateSelectedLocked(locked: boolean): void {
    this.updateSelectedWidget((widget) => ({
      ...widget,
      locked,
      layout: {
        ...widget.layout,
        locked,
      },
    }));
  }

  protected updateSelectedFixed(fixed: boolean): void {
    this.updateSelectedWidget((widget) => ({
      ...widget,
      fixed,
      layout: {
        ...widget.layout,
        fixed,
      },
    }));
  }

  protected updateSelectedArtifactType(artifactType: DesignerArtifactType): void {
    this.updateSelectedWidget((widget) => ({
      ...widget,
      item: widget.item
        ? {
            ...widget.item,
            metadata: {
              ...widget.item.metadata,
              artifactType,
            },
          }
        : widget.item,
    }));
  }

  protected updateSelectedUsage(usage: string): void {
    this.updateSelectedWidget((widget) => ({
      ...widget,
      item: widget.item
        ? {
            ...widget.item,
            data: {
              ...widget.item.data,
              summary: usage,
            },
          }
        : widget.item,
    }));
  }

  protected updateSelectedUsedFields(value: string): void {
    const fields = value
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .map(
        (name): SelectedField => ({
          field: {
            name,
            label: name,
            dataType: 'string',
          },
          aggregation: 'none',
          groupBy: false,
        }),
      );

    this.updateSelectedWidget((widget) => ({
      ...widget,
      item: widget.item
        ? {
            ...widget.item,
            metadata: {
              ...widget.item.metadata,
              fields,
            },
          }
        : widget.item,
    }));
  }

  protected usedFieldsText(widget: DashboardWidget | undefined): string {
    return widget?.item?.metadata.fields.map((field) => field.field.name).join(', ') ?? '';
  }

  protected isWidgetFixed(widget: DashboardWidget | undefined): boolean {
    if (!widget) {
      return false;
    }

    return widget.fixed === true || widget.layout.fixed === true;
  }

  protected dropzoneGridStyle(): Record<string, string> {
    return {
      '--demo-cell-width': `${this.dashboardCellWidth}px`,
      '--demo-cell-height': `${this.dashboardCellHeight}px`,
      '--demo-grid-gap': `${this.dashboardGap}px`,
    };
  }

  private updateSelectedWidget(transform: (widget: DashboardWidget) => DashboardWidget): void {
    const selected = this.selectedWidgetId();
    if (!selected) {
      return;
    }

    this.dashboardWidgets.update((widgets) =>
      widgets.map((widget) => (widget.id === selected ? transform(widget) : widget)),
    );
  }

  private clearTemplatePreview(): void {
    this.activeTemplate.set(undefined);
    this.dropPreview.set(undefined);
  }

  private resolveGridPlacement(
    clientX: number,
    clientY: number,
    template: WidgetTemplate,
  ): WidgetDropPreview | undefined {
    const dropzone = document.getElementById('dashboardDropZone');
    if (!dropzone) {
      return undefined;
    }

    const rect = dropzone.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return undefined;
    }

    const stepX = this.dashboardCellWidth + this.dashboardGap;
    const stepY = this.dashboardCellHeight + this.dashboardGap;
    const maxX = Math.max(0, this.dashboardColumns - template.defaultW);
    const x = Math.min(maxX, Math.max(0, Math.floor((clientX - rect.left) / stepX)));
    const y = Math.max(0, Math.floor((clientY - rect.top) / stepY));

    return {
      x,
      y,
      w: template.defaultW,
      h: template.defaultH,
      title: template.title,
    };
  }
}
