import { GpGridItem } from './models/grid-item.model';
import {
  GpGridWidgetType,
  GpKpiWidgetData,
  GpChartWidgetData,
  GpTableWidgetData,
  GpListWidgetData,
  GpProgressWidgetData
} from './models/grid-widget.model';
import { GpGridEngine } from './engine/grid-engine';

describe('GpGrid Widgets & Typed Models', () => {
  it('should create valid KPI widget item definition', () => {
    const kpiData: GpKpiWidgetData = {
      label: 'Monthly Recurring Revenue',
      value: '$124,500',
      change: '+14.2%',
      trend: 'positive',
      meta: 'vs last month',
      icon: 'dollar-sign'
    };

    const item: GpGridItem = {
      id: 'mrr-widget',
      x: 0,
      y: 0,
      w: 3,
      h: 2,
      widgetType: 'kpi',
      widgetData: kpiData
    };

    expect(item.widgetType).toBe('kpi');
    expect((item.widgetData as GpKpiWidgetData).value).toBe('$124,500');
  });

  it('should create valid Chart widget item definition', () => {
    const chartData: GpChartWidgetData = {
      series: [{ name: 'Revenue', data: [45000, 52000] }]
    };

    const item: GpGridItem = {
      id: 'chart-widget',
      x: 3,
      y: 0,
      w: 6,
      h: 4,
      widgetType: 'chart',
      widgetData: chartData
    };

    expect(item.widgetType).toBe('chart');
    expect((item.widgetData as GpChartWidgetData).series?.length).toBe(1);
  });

  it('should create valid Table widget item definition', () => {
    const tableData: GpTableWidgetData = {
      columns: [
        { field: 'id', header: 'ID' },
        { field: 'customer', header: 'Customer', type: 'avatar' },
        { field: 'amount', header: 'Amount', type: 'currency' }
      ],
      rows: [{ id: 'INV-1001', customer: 'Acme Corp', amount: '$4,200', status: 'Paid' }]
    };

    const item: GpGridItem = {
      id: 'table-widget',
      x: 0,
      y: 2,
      w: 6,
      h: 4,
      widgetType: 'table',
      widgetData: tableData
    };

    expect(item.widgetType).toBe('table');
    expect((item.widgetData as GpTableWidgetData).rows?.length).toBe(1);
  });

  it('should create valid List and Progress widget item definitions', () => {
    const listData: GpListWidgetData = {
      items: [{ id: '1', title: 'New deployment', subtitle: 'v2.4.0', time: '5m ago' }]
    };

    const progressData: GpProgressWidgetData = {
      items: [{ label: 'Storage', percentage: 74, valueText: '74 GB / 100 GB' }]
    };

    const listItem: GpGridItem = {
      id: 'list-w',
      x: 0,
      y: 6,
      w: 4,
      h: 3,
      widgetType: 'list',
      widgetData: listData
    };

    const progressItem: GpGridItem = {
      id: 'prog-w',
      x: 4,
      y: 6,
      w: 4,
      h: 3,
      widgetType: 'progress',
      widgetData: progressData
    };

    expect(listItem.widgetType).toBe('list');
    expect(progressItem.widgetType).toBe('progress');
  });

  it('should layout typed widget items without collision with GpGridEngine', () => {
    const items: GpGridItem[] = [
      { id: 'kpi-1', x: 0, y: 0, w: 3, h: 2, widgetType: 'kpi' },
      { id: 'kpi-2', x: 3, y: 0, w: 3, h: 2, widgetType: 'kpi' },
      { id: 'chart-1', x: 6, y: 0, w: 6, h: 4, widgetType: 'chart' }
    ];

    const compacted = GpGridEngine.compactGrid(items, undefined, 12);

    expect(compacted.length).toBe(3);
    expect(compacted.find((i: GpGridItem) => i.id === 'kpi-1')?.y).toBe(0);
    expect(compacted.find((i: GpGridItem) => i.id === 'kpi-2')?.y).toBe(0);
    expect(compacted.find((i: GpGridItem) => i.id === 'chart-1')?.y).toBe(0);
  });
});
