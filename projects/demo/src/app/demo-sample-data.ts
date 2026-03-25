import { DashboardWidget, DesignedItem, Folder } from 'gp-analytics';

const SALES_OVERVIEW_FIELDS = [
  {
    field: {
      name: 'order_date',
      label: 'Order Date',
      dataType: 'date' as const,
      filterable: true,
      sortable: true,
      groupable: true,
      description: 'Calendar date when the order closed.',
    },
    aggregation: 'none' as const,
    groupBy: true,
    columnFormat: 'date-short' as const,
  },
  {
    field: {
      name: 'region',
      label: 'Region',
      dataType: 'string' as const,
      filterable: true,
      sortable: true,
      groupable: true,
      description: 'Sales territory responsible for the order.',
    },
    aggregation: 'none' as const,
    groupBy: true,
  },
  {
    field: {
      name: 'net_revenue',
      label: 'Net Revenue',
      dataType: 'number' as const,
      filterable: true,
      sortable: true,
      description: 'Revenue after discounts and credits.',
    },
    aggregation: 'sum' as const,
    groupBy: false,
    columnFormat: 'currency' as const,
    kpiRole: 'value' as const,
  },
  {
    field: {
      name: 'gross_margin_pct',
      label: 'Gross Margin %',
      dataType: 'number' as const,
      filterable: true,
      sortable: true,
      description: 'Margin percent for the order.',
    },
    aggregation: 'avg' as const,
    groupBy: false,
    columnFormat: 'percent' as const,
    kpiRole: 'compare' as const,
  },
];

export const DEMO_REVENUE_ITEM: DesignedItem = {
  metadata: {
    id: 'demo-revenue-kpi',
    name: 'Revenue KPI',
    artifactType: 'kpi',
    fields: SALES_OVERVIEW_FIELDS,
    generatedAt: '2026-03-24T12:00:00.000Z',
  },
  style: {
    tone: 'accent',
    highlighted: true,
  },
  data: {
    summary:
      'Revenue is pacing 12% ahead of target with margin expansion across EMEA and mid-market renewals.',
    points: [
      {
        key: 'revenue',
        label: 'Revenue',
        value: 128400,
        valueType: 'currency',
        currencyCode: 'USD',
      },
      {
        key: 'growth',
        label: 'Growth',
        value: 0.12,
        valueType: 'percent',
      },
      {
        key: 'margin',
        label: 'Gross Margin',
        value: 0.41,
        valueType: 'percent',
      },
    ],
  },
};

export const DEMO_DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'widget-total-users',
    title: 'Total Users',
    layout: { x: 0, y: 0, w: 4, h: 3 },
    item: {
      metadata: {
        id: 'total-users',
        name: 'Total Users',
        artifactType: 'kpi',
        fields: [
          {
            field: {
              name: 'active_users',
              label: 'Active Users',
              dataType: 'integer',
              filterable: true,
              sortable: true,
              description: 'Distinct active users over the selected period.',
            },
            aggregation: 'countDistinct',
            groupBy: false,
            kpiRole: 'value',
            columnFormat: 'compact',
          },
          {
            field: {
              name: 'active_users_delta',
              label: 'Delta vs Previous Period',
              dataType: 'number',
              sortable: true,
              description: 'Relative change versus the prior month.',
            },
            aggregation: 'avg',
            groupBy: false,
            kpiRole: 'compare',
            columnFormat: 'percent',
          },
        ],
      },
      style: {
        tone: 'success',
      },
      data: {
        summary: 'Activation remains strong after the Q1 onboarding refresh.',
        points: [
          { key: 'users', label: 'Users', value: 42891, valueType: 'number' },
          { key: 'delta', label: 'MoM Change', value: 0.084, valueType: 'percent' },
        ],
      },
    },
  },
  {
    id: 'widget-revenue',
    layout: { x: 4, y: 0, w: 4, h: 4 },
    item: DEMO_REVENUE_ITEM,
  },
  {
    id: 'widget-conversion',
    title: 'Conversion Rate',
    locked: true,
    layout: { x: 8, y: 0, w: 4, h: 3, locked: true },
    item: {
      metadata: {
        id: 'conversion-rate',
        name: 'Conversion Rate',
        artifactType: 'kpi',
        fields: [
          {
            field: {
              name: 'conversion_rate',
              label: 'Conversion Rate',
              dataType: 'number',
              sortable: true,
              description: 'Lead-to-opportunity conversion rate.',
            },
            aggregation: 'avg',
            groupBy: false,
            kpiRole: 'value',
            columnFormat: 'percent',
          },
        ],
      },
      style: {
        tone: 'warning',
      },
      data: {
        summary: 'Paid social recovered after creative rotation went live mid-month.',
        points: [
          { key: 'conversion', label: 'Conversion', value: 0.037, valueType: 'percent' },
          { key: 'pipeline', label: 'SQLs', value: 386, valueType: 'number' },
        ],
      },
    },
  },
  {
    id: 'widget-pipeline-by-channel',
    title: 'Pipeline by Channel',
    layout: { x: 0, y: 4, w: 6, h: 4 },
    item: {
      metadata: {
        id: 'pipeline-by-channel',
        name: 'Pipeline by Channel',
        artifactType: 'graph',
        graphType: 'stacked-column',
        fields: [
          {
            field: {
              name: 'channel',
              label: 'Channel',
              dataType: 'string',
              filterable: true,
              sortable: true,
              groupable: true,
              description: 'Attributed acquisition channel.',
            },
            aggregation: 'none',
            groupBy: true,
            graphRole: 'x-axis',
          },
          {
            field: {
              name: 'pipeline_amount',
              label: 'Pipeline Amount',
              dataType: 'number',
              sortable: true,
              description: 'Open pipeline amount attributed to the channel.',
            },
            aggregation: 'sum',
            groupBy: false,
            graphRole: 'y-axis',
          },
          {
            field: {
              name: 'segment',
              label: 'Segment',
              dataType: 'string',
              groupable: true,
              description: 'Customer segment dimension.',
            },
            aggregation: 'none',
            groupBy: true,
            graphRole: 'series',
          },
        ],
        generatedAt: '2026-03-23T16:15:00.000Z',
      },
      style: {
        tone: 'muted',
        compact: true,
      },
      data: {
        summary:
          'Partner-sourced opportunities are closing the gap on paid search in enterprise pipeline.',
        points: [
          {
            key: 'paid-search',
            label: 'Paid Search',
            value: 482000,
            valueType: 'currency',
            currencyCode: 'USD',
          },
          {
            key: 'partner',
            label: 'Partner',
            value: 436500,
            valueType: 'currency',
            currencyCode: 'USD',
          },
          {
            key: 'organic',
            label: 'Organic',
            value: 281200,
            valueType: 'currency',
            currencyCode: 'USD',
          },
        ],
      },
    },
  },
  {
    id: 'widget-renewal-risk',
    title: 'Renewal Risk Watchlist',
    fixed: true,
    layout: { x: 6, y: 4, w: 6, h: 3, fixed: true },
    item: {
      metadata: {
        id: 'renewal-risk',
        name: 'Renewal Risk Watchlist',
        artifactType: 'tabular',
        fields: [
          {
            field: {
              name: 'account_name',
              label: 'Account',
              dataType: 'string',
              filterable: true,
              sortable: true,
              groupable: true,
              description: 'Customer account name.',
            },
            aggregation: 'none',
            groupBy: false,
            columnFormat: 'default',
          },
          {
            field: {
              name: 'renewal_date',
              label: 'Renewal Date',
              dataType: 'date',
              sortable: true,
              description: 'Upcoming contract renewal date.',
            },
            aggregation: 'none',
            groupBy: false,
            columnFormat: 'date-short',
          },
          {
            field: {
              name: 'health_score',
              label: 'Health Score',
              dataType: 'number',
              sortable: true,
              description: 'Modeled account health score from 0 to 100.',
            },
            aggregation: 'avg',
            groupBy: false,
            columnFormat: 'number-0',
          },
        ],
        generatedAt: '2026-03-25T08:10:00.000Z',
      },
      style: {
        tone: 'danger',
      },
      data: {
        summary: 'Three enterprise renewals need executive attention before month end.',
        points: [
          { key: 'northern-star', label: 'Northern Star', value: 'Apr 4', valueType: 'text' },
          { key: 'westbridge', label: 'Westbridge', value: 'Apr 11', valueType: 'text' },
          { key: 'cloudcrest', label: 'Cloudcrest', value: 'Apr 18', valueType: 'text' },
        ],
      },
    },
  },
];

export const DEMO_DESIGNER_FOLDERS: Folder[] = [
  {
    id: 'folder-revenue-ops',
    name: 'Revenue Ops',
    datasets: [
      {
        id: 'dataset-sales-overview',
        folderId: 'folder-revenue-ops',
        name: 'Sales Overview',
        fields: [
          {
            name: 'order_date',
            label: 'Order Date',
            dataType: 'date',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Date the order was booked.',
          },
          {
            name: 'region',
            label: 'Region',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Territory that owns the account.',
          },
          {
            name: 'segment',
            label: 'Segment',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Commercial or enterprise segment.',
          },
          {
            name: 'net_revenue',
            label: 'Net Revenue',
            dataType: 'number',
            filterable: true,
            sortable: true,
            description: 'Booked revenue after discounts.',
          },
          {
            name: 'gross_margin_pct',
            label: 'Gross Margin %',
            dataType: 'number',
            filterable: true,
            sortable: true,
            description: 'Gross margin percentage on the order.',
          },
          {
            name: 'is_renewal',
            label: 'Renewal',
            dataType: 'boolean',
            filterable: true,
            sortable: true,
            description: 'Flags whether the order is a renewal.',
          },
        ],
      },
      {
        id: 'dataset-subscription-health',
        folderId: 'folder-revenue-ops',
        name: 'Subscription Health',
        fields: [
          {
            name: 'account_name',
            label: 'Account Name',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Customer account display name.',
          },
          {
            name: 'renewal_date',
            label: 'Renewal Date',
            dataType: 'date',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Contract renewal date.',
          },
          {
            name: 'health_score',
            label: 'Health Score',
            dataType: 'number',
            sortable: true,
            description: 'Current customer health score.',
          },
          {
            name: 'open_support_tickets',
            label: 'Open Tickets',
            dataType: 'integer',
            sortable: true,
            description: 'Open support case count.',
          },
          {
            name: 'csm_at_risk',
            label: 'CSM Flagged At Risk',
            dataType: 'boolean',
            filterable: true,
            sortable: true,
            description: 'Customer success risk flag.',
          },
        ],
      },
    ],
  },
  {
    id: 'folder-growth-marketing',
    name: 'Growth Marketing',
    datasets: [
      {
        id: 'dataset-campaign-performance',
        folderId: 'folder-growth-marketing',
        name: 'Campaign Performance',
        fields: [
          {
            name: 'campaign_name',
            label: 'Campaign',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Marketing campaign name.',
          },
          {
            name: 'channel',
            label: 'Channel',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Paid search, partner, organic, or event.',
          },
          {
            name: 'spend',
            label: 'Spend',
            dataType: 'number',
            sortable: true,
            description: 'Media and program spend.',
          },
          {
            name: 'pipeline_amount',
            label: 'Pipeline Amount',
            dataType: 'number',
            sortable: true,
            description: 'Attributed pipeline amount.',
          },
          {
            name: 'conversion_rate',
            label: 'Conversion Rate',
            dataType: 'number',
            sortable: true,
            description: 'Lead to SQL conversion rate.',
          },
          {
            name: 'launch_at',
            label: 'Launch Time',
            dataType: 'datetime',
            sortable: true,
            description: 'Date and time the campaign launched.',
          },
        ],
      },
    ],
  },
  {
    id: 'folder-product-usage',
    name: 'Product Usage',
    datasets: [
      {
        id: 'dataset-adoption-funnel',
        folderId: 'folder-product-usage',
        name: 'Adoption Funnel',
        fields: [
          {
            name: 'workspace_name',
            label: 'Workspace',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Customer workspace name.',
          },
          {
            name: 'active_users',
            label: 'Active Users',
            dataType: 'integer',
            sortable: true,
            description: 'Distinct active users in the period.',
          },
          {
            name: 'feature_adoption_pct',
            label: 'Feature Adoption %',
            dataType: 'number',
            sortable: true,
            description: 'Share of active users using the flagship feature.',
          },
          {
            name: 'nps_bucket',
            label: 'NPS Bucket',
            dataType: 'string',
            filterable: true,
            sortable: true,
            groupable: true,
            description: 'Promoter, passive, or detractor bucket.',
          },
          {
            name: 'latest_login_at',
            label: 'Latest Login',
            dataType: 'datetime',
            sortable: true,
            description: 'Most recent login timestamp.',
          },
        ],
      },
    ],
  },
];
