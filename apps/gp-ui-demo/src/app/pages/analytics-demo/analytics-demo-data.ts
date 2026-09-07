import { DataType } from 'gp-analytics';
import {
  createDatasetField,
  createDefaultDashboardConfig,
  createReportConfig,
  DatasetField,
  Field,
  Grouping,
  GpDashboardConfig,
  GpReportConfig
} from 'gp-analytics';

/** Shared sample order records used across every gp-analytics demo page. */
export const ANALYTICS_SAMPLE_RECORDS: Record<string, any>[] = [
  { customer_name: 'Northwind Trading', region: 'EMEA', status: 'Completed', currency: 'GBP', total: 18450, quantity: 14, date: '2026-02-14' },
  { customer_name: 'Northwind Trading', region: 'EMEA', status: 'Processing', currency: 'EUR', total: 6200, quantity: 4, date: '2026-02-18' },
  { customer_name: 'Acme Industrial Corp', region: 'AMER', status: 'Completed', currency: 'USD', total: 34500, quantity: 28, date: '2026-02-15' },
  { customer_name: 'Acme Industrial Corp', region: 'AMER', status: 'Delivered', currency: 'USD', total: 12100, quantity: 9, date: '2026-02-22' },
  { customer_name: 'Starlight Solutions', region: 'APAC', status: 'Completed', currency: 'JPY', total: 2280000, quantity: 18, date: '2026-02-19' },
  { customer_name: 'Starlight Solutions', region: 'APAC', status: 'Pending', currency: 'JPY', total: 840000, quantity: 6, date: '2026-02-24' },
  { customer_name: 'Helios Technologies', region: 'EMEA', status: 'Delivered', currency: 'EUR', total: 15900, quantity: 12, date: '2026-02-20' },
  { customer_name: 'Apex Logistics', region: 'AMER', status: 'Completed', currency: 'USD', total: 27300, quantity: 21, date: '2026-02-23' }
];

/** Fields describing the "orders" table used by schema/dataset oriented demos. */
export const ANALYTICS_SAMPLE_FIELDS: Field[] = [
  {
    fieldId: 'customer_name',
    tableId: 'orders',
    fieldGroupingId: 'group-core',
    fieldName: 'customer_name',
    fieldDisplayName: { value: 'customer_name', displayValue: { en: 'Customer Name' } },
    dataType: DataType.String,
    visible: true,
    isPrimaryKey: false,
    isIndex: true,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  },
  {
    fieldId: 'region',
    tableId: 'orders',
    fieldGroupingId: 'group-core',
    fieldName: 'region',
    fieldDisplayName: { value: 'region', displayValue: { en: 'Sales Region' } },
    dataType: DataType.String,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  },
  {
    fieldId: 'status',
    tableId: 'orders',
    fieldGroupingId: 'group-core',
    fieldName: 'status',
    fieldDisplayName: { value: 'status', displayValue: { en: 'Order Status' } },
    dataType: DataType.String,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  },
  {
    fieldId: 'total',
    tableId: 'orders',
    fieldGroupingId: 'group-measures',
    fieldName: 'total',
    fieldDisplayName: { value: 'total', displayValue: { en: 'Total Revenue' } },
    dataType: DataType.Currency,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: false,
    aggregationType: 'sum',
    currencyField: 'currency'
  },
  {
    fieldId: 'quantity',
    tableId: 'orders',
    fieldGroupingId: 'group-measures',
    fieldName: 'quantity',
    fieldDisplayName: { value: 'quantity', displayValue: { en: 'Order Units (Qty)' } },
    dataType: DataType.Integer,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: false,
    aggregationType: 'sum'
  },
  {
    fieldId: 'date',
    tableId: 'orders',
    fieldGroupingId: 'group-core',
    fieldName: 'date',
    fieldDisplayName: { value: 'date', displayValue: { en: 'Order Date' } },
    dataType: DataType.Date,
    visible: true,
    isPrimaryKey: false,
    isIndex: false,
    isJoinField: false,
    usableInReports: true,
    filterable: true,
    sortable: true,
    groupable: true
  }
];

/** Metadata schema (single "Orders" table) used by schema-catalogue and dataset-builder demos. */
export const ANALYTICS_SAMPLE_GROUPINGS: Grouping[] = [
  {
    groupingId: 'group-commerce',
    groupingName: 'Commerce & Sales',
    tables: [
      {
        tableId: 'orders',
        tableName: 'orders',
        groupingId: 'group-commerce',
        tableDisplayName: { value: 'orders', displayValue: { en: 'Orders' } },
        fields: [
          {
            fieldGroupingId: 'group-core',
            tableId: 'orders',
            fieldGroupingName: 'Core Attributes',
            fields: ANALYTICS_SAMPLE_FIELDS.filter((f) => f.fieldGroupingId === 'group-core')
          },
          {
            fieldGroupingId: 'group-measures',
            tableId: 'orders',
            fieldGroupingName: 'Measures',
            fields: ANALYTICS_SAMPLE_FIELDS.filter((f) => f.fieldGroupingId === 'group-measures')
          }
        ]
      }
    ],
    relationships: []
  }
];

/** Ready-to-use DatasetField list (one per sample field) for field-selector / preview demos. */
export const ANALYTICS_SAMPLE_DATASET_FIELDS: DatasetField[] = ANALYTICS_SAMPLE_FIELDS.map((f) =>
  createDatasetField(f, `df_${f.fieldId}`)
);

/** Field picker options reused by filter-bar and dashboard-designer demos. */
export const ANALYTICS_AVAILABLE_FIELDS = [
  { fieldId: 'customer_name', label: 'Customer Name', type: 'string' },
  { fieldId: 'region', label: 'Sales Region', type: 'string' },
  { fieldId: 'currency', label: 'Currency', type: 'string' },
  { fieldId: 'status', label: 'Order Status', type: 'string' },
  { fieldId: 'total', label: 'Total Revenue', type: 'currency' },
  { fieldId: 'quantity', label: 'Order Units (Qty)', type: 'number' },
  { fieldId: 'date', label: 'Order Date', type: 'date' }
];

export function createSampleDashboardConfig(): GpDashboardConfig {
  return createDefaultDashboardConfig();
}

export function createSampleReports(): GpReportConfig[] {
  return [
    createReportConfig('tabular', 'Enterprise Revenue Rollup with Subtotals', {
      title: 'Enterprise Revenue Rollup with Subtotals',
      subtitle: 'Hierarchically aggregated by Region, Customer, and Status',
      dimensions: ['region', 'customer_name', 'status'],
      measures: [
        { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
        { fieldId: 'quantity', aggregation: 'sum', alias: 'total_units' },
        { fieldId: 'total', aggregation: 'count', alias: 'order_count' }
      ],
      showSubtotals: true,
      showGrandTotal: true
    }),
    createReportConfig('pivot', 'Cross-Tabulation Matrix: Customer by Region', {
      title: 'Cross-Tabulation Matrix: Customer by Region',
      rowDimension: 'customer_name',
      colDimension: 'region',
      measure: { fieldId: 'total', aggregation: 'sum' }
    }),
    createReportConfig('chart', 'Revenue by Customer', {
      title: 'Revenue by Customer',
      subtitle: 'Top contributing enterprise accounts',
      chartType: 'bar',
      dimension: 'customer_name',
      measure: { fieldId: 'total', aggregation: 'sum' }
    })
  ];
}
