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
      trend: 'up',
      caption: 'vs last month',
      icon: 'dollar-sign'
    };

    const item: GpGridItem = {
      id: 'mrr-widget',
      col: 0,
      row: 0,
      cols: 3,
      rows: 2,
      widgetType: 'kpi',
      widgetData: kpiData
    };

    expect(item.widgetType).toBe('kpi');
    expect((item.widgetData as GpKpiWidgetData).value).toBe('$124,500');
  });

  it('should create valid Chart widget item definition', () => {
    const chartData: GpChartWidgetData = {
      monthly: [
        { month: 'Jan', revenue: 45000, target: 40000 },
        { month: 'Feb', revenue: 52000, target: 45000 }
      ]
    };

    const item: GpGridItem = {
      id: 'chart-widget',
      col: 3,
      row: 0,
      cols: 6,
      rows: 4,
      widgetType: 'chart',
      widgetData: chartData
    };

    expect(item.widgetType).toBe('chart');
    expect((item.widgetData as GpChartWidgetData).monthly?.length).toBe(2);
  });

  it('should create valid Table widget item definition', () => {
    const tableData: GpTableWidgetData = {
      columns: [
        { field: 'id', header: 'ID' },
        { field: 'customer', header: 'Customer', type: 'avatar' },
        { field: 'amount', header: 'Amount', type: 'currency' }
      ],
      rows: [
        { id: 'INV-1001', customer: 'Acme Corp', amount: '$4,200', status: 'Paid' }
      ]
    };

    const item: GpGridItem = {
      id: 'table-widget',
      col: 0,
      row: 2,
      cols: 6,
      rows: 4,
      widgetType: 'table',
      widgetData: tableData
    };

    expect(item.widgetType).toBe('table');
    expect((item.widgetData as GpTableWidgetData).rows.length).toBe(1);
  });

  it('should create valid List and Progress widget item definitions', () => {
    const listData: GpListWidgetData = {
      items: [
        { id: '1', title: 'New deployment', subtitle: 'v2.4.0', time: '5m ago' }
      ]
    };

    const progressData: GpProgressWidgetData = {
      items: [
        { label: 'Storage', value: 74, formattedValue: '74 GB / 100 GB', color: 'primary' }
      ]
    };

    const listItem: GpGridItem = {
      id: 'list-w',
      col: 0,
      row: 6,
      cols: 4,
      rows: 3,
      widgetType: 'list',
      widgetData: listData
    };

    const progressItem: GpGridItem = {
      id: 'prog-w',
      col: 4,
      row: 6,
      cols: 4,
      rows: 3,
      widgetType: 'progress',
      widgetData: progressData
    };

    expect(listItem.widgetType).toBe('list');
    expect(progressItem.widgetType).toBe('progress');
  });

  it('should layout typed widget items without collision with GpGridEngine', () => {
    const items: GpGridItem[] = [
      { id: 'kpi-1', col: 0, row: 0, cols: 3, rows: 2, widgetType: 'kpi' },
      { id: 'kpi-2', col: 3, row: 0, cols: 3, rows: 2, widgetType: 'kpi' },
      { id: 'chart-1', col: 6, row: 0, cols: 6, rows: 4, widgetType: 'chart' }
    ];

    const engine = new GpGridEngine(12, 'vertical');
    const compacted = engine.compact(items);

    expect(compacted.length).toBe(3);
    expect(compacted.find(i => i.id === 'kpi-1')?.row).toBe(0);
    expect(compacted.find(i => i.id === 'kpi-2')?.row).toBe(0);
    expect(compacted.find(i => i.id === 'chart-1')?.row).toBe(0);
  });
});
