import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpButton, GpCard, GpSelect, GpTag } from '@generatedpixel/gp-ui';
import { DemoThemeMode, DemoThemeService, DEMO_THEMES } from './services/theme.service';
import {
  createDatasetField,
  Dataset,
  DatasetField,
  FieldType,
  GpDatasetBuilder,
  GpDatasetFieldSelector,
  GpDatasetPreview,
  GpSchemaCatalogue,
  GpTranslationService,
  GpKpiCard,
  GpTabularReport,
  GpPivotGrid,
  GpAnalyticalChart,
  GpFilterBar,
  GpAnalyticsDashboard,
  GpDashboardDesigner,
  GpDashboardConfig,
  createDefaultDashboardConfig,
  createOperationsDashboardConfig,
  GpPackageManager,
  GpReportConfig,
  createReportConfig,
  PackageImportEvent,
  Grouping,
  JoinType,
  LoadedSchemaResult,
  Relationship,
  RelationshipCardinality,
  SupportedLocale,
  SupportedCurrency,
  SupportedDateFormat,
  GpAnalyticsConfigService,
  GpSchemaDataLoaderService
} from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    FormsModule,
    GpButton,
    GpCard,
    GpSchemaCatalogue,
    GpDatasetFieldSelector,
    GpDatasetPreview,
    GpDatasetBuilder,
    GpKpiCard,
    GpTabularReport,
    GpPivotGrid,
    GpAnalyticalChart,
    GpAnalyticsDashboard,
    GpDashboardDesigner,
    GpPackageManager,
    GpSelect,
    GpTag
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly i18n = inject(GpTranslationService);
  protected readonly config = inject(GpAnalyticsConfigService);
  protected readonly themeService = inject(DemoThemeService);
  protected readonly schemaDataLoader = inject(GpSchemaDataLoaderService);

  // Schema Preset state
  protected readonly activePresetId = signal<string>('commerce');
  protected readonly schemaPresetOptions = computed(() =>
    this.schemaDataLoader.presets.map((p) => ({
      value: p.id,
      label: `${p.icon || '📦'} ${p.name}`
    }))
  );

  // Theme and Mode state backed by DemoThemeService
  protected readonly currentTheme = this.themeService.currentTheme;
  protected readonly currentMode = this.themeService.currentMode;
  protected readonly isDark = this.themeService.isDark;

  protected readonly themeOptions = DEMO_THEMES.map((t) => ({
    value: t.id,
    label: t.name,
    color: t.primaryColor
  }));

  protected selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
  }

  protected setMode(mode: DemoThemeMode): void {
    this.themeService.setMode(mode);
  }

  protected toggleMode(): void {
    this.themeService.toggleMode();
  }

  protected readonly activeTab = signal<'workbench' | 'dashboard' | 'designer' | 'reports' | 'standalone'>('workbench');

  protected readonly currentTitle = computed(() => {
    switch (this.activeTab()) {
      case 'workbench':
        return 'Interactive Dataset Builder';
      case 'dashboard':
        return 'Executive Analytics Dashboard';
      case 'designer':
        return 'Visual Dashboard Designer';
      case 'reports':
        return 'Tabular & Pivot Reports';
      case 'standalone':
        return 'Modular Standalone Components';
    }
  });

  protected readonly currentSubtitle = computed(() => {
    switch (this.activeTab()) {
      case 'workbench':
        return 'Compose high-performance analytical datasets from relational enterprise schemas with automatic join validation, dynamic aggregation labeling, and real-time tabular preview.';
      case 'dashboard':
        return 'Interactive executive dashboard powered by @generatedpixel/gp-grid with responsive widget layout, real-time KPI scorecards, and cross-metric charts.';
      case 'designer':
        return 'Interactively build, customize, and configure dashboards for users with live drag & drop layout, widget palette, property inspector, and JSON export/import.';
      case 'reports':
        return 'Advanced data reporting engine supporting multi-dimensional grouping, subtotal calculations, ad-hoc column aggregation, and 2D pivot matrices.';
      case 'standalone':
        return 'Modular, independently embeddable components with zero lock-in: Schema Catalogue, Field Selector, Preview Grid, KPI Cards, and Analytical Charts.';
    }
  });

  // Dedicated state for Dashboard Designer
  protected readonly designerDashboardConfig = signal<GpDashboardConfig>(createDefaultDashboardConfig());
  protected readonly designerAvailableFields = computed(() => [
    { fieldId: 'customer_name', label: 'Customer Name', type: 'string' },
    { fieldId: 'region', label: 'Sales Region', type: 'string' },
    { fieldId: 'currency', label: 'Currency', type: 'string' },
    { fieldId: 'status', label: 'Order Status', type: 'string' },
    { fieldId: 'total', label: 'Total Revenue', type: 'currency' },
    { fieldId: 'quantity', label: 'Order Units (Qty)', type: 'number' },
    { fieldId: 'date', label: 'Order Date', type: 'date' }
  ]);

  // Package Distribution Manager State
  protected readonly isPackageManagerOpen = signal<boolean>(false);
  protected readonly packageToast = signal<string | null>(null);

  protected readonly availableReports = computed<GpReportConfig[]>(() => [
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
    }),
    createReportConfig('chart', 'Geographic Revenue Share', {
      title: 'Geographic Revenue Share',
      subtitle: 'Global market distribution',
      chartType: 'donut',
      dimension: 'region',
      measure: { fieldId: 'total', aggregation: 'sum' }
    })
  ]);

  protected openPackageManager(): void {
    this.isPackageManagerOpen.set(true);
  }

  protected onPackageImported(event: PackageImportEvent): void {
    const pkg = event.package;
    if (pkg.datasets && pkg.datasets.length > 0) {
      this.activeDataset.set(pkg.datasets[0]);
    }
    if (pkg.dashboards && pkg.dashboards.length > 0) {
      this.designerDashboardConfig.set(pkg.dashboards[0]);
    }
    this.packageToast.set(
      `✓ Successfully imported ${pkg.metadata.name} (${pkg.metadata.itemCounts?.datasets || 0} datasets, ${pkg.metadata.itemCounts?.dashboards || 0} dashboards, ${pkg.metadata.itemCounts?.reports || 0} reports)`
    );
    setTimeout(() => {
      this.packageToast.set(null);
    }, 5000);
  }

  protected readonly demoAnalyticsData = [
    {
      customer_name: 'Northwind Trading',
      region: 'EMEA',
      status: 'Completed',
      currency: 'GBP',
      total: 18450,
      quantity: 14,
      date: '2026-02-14'
    },
    {
      customer_name: 'Northwind Trading',
      region: 'EMEA',
      status: 'Processing',
      currency: 'EUR',
      total: 6200,
      quantity: 4,
      date: '2026-02-18'
    },
    {
      customer_name: 'Acme Industrial Corp',
      region: 'AMER',
      status: 'Completed',
      currency: 'USD',
      total: 34500,
      quantity: 28,
      date: '2026-02-15'
    },
    {
      customer_name: 'Acme Industrial Corp',
      region: 'AMER',
      status: 'Delivered',
      currency: 'USD',
      total: 12100,
      quantity: 9,
      date: '2026-02-22'
    },
    {
      customer_name: 'Starlight Solutions',
      region: 'APAC',
      status: 'Completed',
      currency: 'JPY',
      total: 2280000,
      quantity: 18,
      date: '2026-02-19'
    },
    {
      customer_name: 'Starlight Solutions',
      region: 'APAC',
      status: 'Pending',
      currency: 'JPY',
      total: 840000,
      quantity: 6,
      date: '2026-02-24'
    },
    {
      customer_name: 'Helios Technologies',
      region: 'EMEA',
      status: 'Delivered',
      currency: 'EUR',
      total: 15900,
      quantity: 12,
      date: '2026-02-20'
    },
    {
      customer_name: 'Apex Logistics',
      region: 'AMER',
      status: 'Completed',
      currency: 'USD',
      total: 27300,
      quantity: 21,
      date: '2026-02-23'
    }
  ];

  protected readonly localeOptions = computed(() => [
    { value: 'en', label: `🇬🇧 ${this.i18n.translate('english')}` },
    { value: 'fr', label: `🇫🇷 ${this.i18n.translate('french')}` },
    { value: 'de', label: `🇩🇪 ${this.i18n.translate('german')}` },
    { value: 'es', label: `🇪🇸 ${this.i18n.translate('spanish')}` },
    { value: 'ja', label: `🇯🇵 ${this.i18n.translate('japanese')}` }
  ]);

  protected setLocale(locale: string): void {
    this.i18n.setLocale(locale as SupportedLocale);
  }

  protected readonly currencyOptions = [
    { value: 'USD', label: '$ USD (US Dollar)' },
    { value: 'EUR', label: '€ EUR (Euro)' },
    { value: 'GBP', label: '£ GBP (British Pound)' },
    { value: 'JPY', label: '¥ JPY (Japanese Yen)' },
    { value: 'CAD', label: 'CA$ CAD (Canadian Dollar)' },
    { value: 'AUD', label: 'A$ AUD (Australian Dollar)' },
    { value: 'CHF', label: 'CHF (Swiss Franc)' }
  ];

  protected setCurrency(curr: string): void {
    this.config.updateConfig({ currency: curr as SupportedCurrency });
  }

  protected readonly dateFormatOptions = [
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK/EU)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
    { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY (DE)' },
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD (JP)' }
  ];

  protected setDateFormat(df: string): void {
    this.config.updateConfig({ dateFormat: df as SupportedDateFormat });
  }

  protected readonly numberFormatOptions = [
    { value: 'comma-dot', label: '1,234.56 (US/UK)' },
    { value: 'dot-comma', label: '1.234,56 (EU/DE)' },
    { value: 'space-comma', label: '1 234,56 (ISO/FR)' }
  ];

  protected readonly selectedNumberFormat = computed<string>(() => {
    const nf = this.config.numberFormat();
    if (nf.thousandSeparator === '.' && nf.decimalSeparator === ',') {
      return 'dot-comma';
    }
    if (nf.thousandSeparator === ' ' && nf.decimalSeparator === ',') {
      return 'space-comma';
    }
    return 'comma-dot';
  });

  protected setNumberFormat(formatKey: string): void {
    if (formatKey === 'dot-comma') {
      this.config.updateConfig({
        numberFormat: { thousandSeparator: '.', decimalSeparator: ',', precision: 2 }
      });
    } else if (formatKey === 'space-comma') {
      this.config.updateConfig({
        numberFormat: { thousandSeparator: ' ', decimalSeparator: ',', precision: 2 }
      });
    } else {
      this.config.updateConfig({
        numberFormat: { thousandSeparator: ',', decimalSeparator: '.', precision: 2 }
      });
    }
  }

  // Multi-table, multi-group enterprise schema with relationships
  protected readonly groupings = signal<Grouping[]>([
    {
      groupingId: 'group-commerce',
      groupingName: 'Commerce & Sales',
      relationships: [
        {
          relationshipId: 'rel-customers-orders',
          name: 'Customer Orders',
          sourceTableId: 'table-customers',
          sourceFieldId: 'customer-id',
          targetTableId: 'table-orders',
          targetFieldId: 'order-customer-id',
          cardinality: RelationshipCardinality.OneToMany,
          joinType: JoinType.Inner
        },
        {
          relationshipId: 'rel-orders-items',
          name: 'Order Line Items',
          sourceTableId: 'table-orders',
          sourceFieldId: 'order-id',
          targetTableId: 'table-order-items',
          targetFieldId: 'item-order-id',
          cardinality: RelationshipCardinality.OneToMany,
          joinType: JoinType.Left
        }
      ],
      tables: [
        {
          tableId: 'table-customers',
          tableName: 'Customers',
          groupingId: 'group-commerce',
          fields: [
            {
              fieldGroupingId: 'cust-id-group',
              fieldGroupingName: 'Identity',
              tableId: 'table-customers',
              fields: [
                {
                  fieldId: 'customer-id',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'customer_id',
                  fieldDisplayName: {
                    value: 'Customer ID',
                    displayValue: { en: 'Customer ID', fr: 'Identifiant client' }
                  },
                  dataType: 'guid',
                  visible: false,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: false,
                  sortable: false,
                  groupable: false
                },
                {
                  fieldId: 'customer-code',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'customer_code',
                  fieldDisplayName: {
                    value: 'Customer code',
                    displayValue: { en: 'Customer code', fr: 'Code client' }
                  },
                  dataType: 'string',
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
                  fieldId: 'customer-name',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'name',
                  fieldDisplayName: {
                    value: 'Customer name',
                    displayValue: { en: 'Customer name', fr: 'Nom du client' }
                  },
                  dataType: 'string',
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
                  fieldId: 'customer-city',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'city',
                  fieldDisplayName: { value: 'City', displayValue: { en: 'City', fr: 'Ville' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true
                }
              ]
            }
          ]
        },
        {
          tableId: 'table-orders',
          tableName: 'Orders',
          groupingId: 'group-commerce',
          currencyCode: 'USD',
          currencyField: 'currency',
          fields: [
            {
              fieldGroupingId: 'order-main-group',
              fieldGroupingName: 'Order Details',
              tableId: 'table-orders',
              fields: [
                {
                  fieldId: 'order-id',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'order_id',
                  fieldDisplayName: { value: 'Order ID', displayValue: { en: 'Order ID', fr: 'N° commande' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false
                },
                {
                  fieldId: 'order-customer-id',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'customer_id',
                  fieldDisplayName: { value: 'Customer FK', displayValue: { en: 'Customer FK', fr: 'FK Client' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: true,
                  sortable: false,
                  groupable: false
                },
                {
                  fieldId: 'order-date',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'order_date',
                  fieldDisplayName: { value: 'Order date', displayValue: { en: 'Order date', fr: 'Date de commande' } },
                  dataType: 'date',
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
                  fieldId: 'order-status',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'status',
                  fieldDisplayName: { value: 'Status', displayValue: { en: 'Status', fr: 'Statut' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                  lookupValues: [
                    { value: 'completed', displayValue: { en: 'Completed', fr: 'Complété' } },
                    { value: 'processing', displayValue: { en: 'Processing', fr: 'En traitement' } },
                    { value: 'shipped', displayValue: { en: 'Shipped', fr: 'Expédié' } },
                    { value: 'cancelled', displayValue: { en: 'Cancelled', fr: 'Annulé' } }
                  ]
                },
                {
                  fieldId: 'order-currency',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'currency',
                  fieldDisplayName: {
                    value: 'Currency',
                    displayValue: {
                      en: 'Currency',
                      fr: 'Devise',
                      de: 'Währung',
                      es: 'Moneda',
                      ja: '通貨'
                    }
                  },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                  lookupValues: [
                    {
                      value: 'USD',
                      displayValue: { en: 'USD ($)', fr: 'USD ($)', de: 'USD ($)', es: 'USD ($)', ja: 'USD ($)' }
                    },
                    {
                      value: 'EUR',
                      displayValue: { en: 'EUR (€)', fr: 'EUR (€)', de: 'EUR (€)', es: 'EUR (€)', ja: 'EUR (€)' }
                    },
                    {
                      value: 'GBP',
                      displayValue: { en: 'GBP (£)', fr: 'GBP (£)', de: 'GBP (£)', es: 'GBP (£)', ja: 'GBP (£)' }
                    },
                    {
                      value: 'JPY',
                      displayValue: { en: 'JPY (¥)', fr: 'JPY (¥)', de: 'JPY (¥)', es: 'JPY (¥)', ja: 'JPY (¥)' }
                    }
                  ]
                },
                {
                  fieldId: 'order-total',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'total',
                  fieldDisplayName: {
                    value: 'Order total',
                    displayValue: { en: 'Order total', fr: 'Total de la commande' }
                  },
                  dataType: 'currency',
                  currencyField: 'currency',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                  aggregationType: 'sum'
                }
              ]
            }
          ]
        },
        {
          tableId: 'table-order-items',
          tableName: 'Order Items',
          groupingId: 'group-commerce',
          fields: [
            {
              fieldGroupingId: 'item-details-group',
              fieldGroupingName: 'Item Lines',
              tableId: 'table-order-items',
              fields: [
                {
                  fieldId: 'item-id',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'item_id',
                  fieldDisplayName: { value: 'Item ID', displayValue: { en: 'Item ID', fr: 'ID Article' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false
                },
                {
                  fieldId: 'item-order-id',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'order_id',
                  fieldDisplayName: { value: 'Order FK', displayValue: { en: 'Order FK', fr: 'FK Commande' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: true,
                  sortable: false,
                  groupable: false
                },
                {
                  fieldId: 'item-product-name',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'product_name',
                  fieldDisplayName: {
                    value: 'Product name',
                    displayValue: { en: 'Product name', fr: 'Nom du produit' }
                  },
                  dataType: 'string',
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
                  fieldId: 'item-quantity',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'quantity',
                  fieldDisplayName: { value: 'Quantity', displayValue: { en: 'Quantity', fr: 'Quantité' } },
                  dataType: 'number',
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
                  fieldId: 'item-unit-price',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'unit_price',
                  fieldDisplayName: { value: 'Unit price', displayValue: { en: 'Unit price', fr: 'Prix unitaire' } },
                  dataType: 'currency',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                  aggregationType: 'average'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      groupingId: 'group-hr',
      groupingName: 'Human Resources',
      relationships: [],
      tables: [
        {
          tableId: 'table-employees',
          tableName: 'Employees',
          groupingId: 'group-hr',
          fields: [
            {
              fieldGroupingId: 'emp-profile',
              fieldGroupingName: 'Staff Profiles',
              tableId: 'table-employees',
              fields: [
                {
                  fieldId: 'emp-id',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'employee_id',
                  fieldDisplayName: { value: 'Employee ID', displayValue: { en: 'Employee ID', fr: 'ID Employé' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false
                },
                {
                  fieldId: 'emp-name',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'employee_name',
                  fieldDisplayName: {
                    value: 'Employee name',
                    displayValue: { en: 'Employee name', fr: 'Nom employé' }
                  },
                  dataType: 'string',
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
                  fieldId: 'emp-department',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'department',
                  fieldDisplayName: { value: 'Department', displayValue: { en: 'Department', fr: 'Département' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  // Additional cross-group relationship (demonstrates modularity)
  protected readonly additionalRelationships = signal<Relationship[]>([]);

  // Active dataset state
  protected readonly activeDataset = signal<Dataset>({
    datasetId: 'dataset-sales-overview',
    name: 'Sales & Revenue Overview',
    description: 'Executive quarterly sales dataset across customer segments and order totals.',
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  protected readonly sampleValue = {
    value: 'customer-001',
    displayValue: { en: 'Northwind Trading', fr: 'Northwind Commerce' }
  };

  /**
   * Loads a rich pre-configured sample dataset.
   */
  protected loadSampleDataset(): void {
    const currentGroupings = this.groupings();
    if (!currentGroupings.length || !currentGroupings[0].tables.length) return;
    const custTable = currentGroupings[0].tables[0];
    const ordersTable = currentGroupings[0].tables[1] || custTable;
    const itemsTable = currentGroupings[0].tables[2] || ordersTable;

    const custName = custTable.fields[0]?.fields[2] || custTable.fields[0]?.fields[0];
    const orderCurrency = ordersTable.fields[0]?.fields.find((f) => f.fieldName === 'currency');
    const orderStatus = ordersTable.fields[0]?.fields.find((f) => f.fieldName === 'status');
    const orderDate = ordersTable.fields[0]?.fields.find((f) => f.fieldName === 'order_date');
    const orderTotal = ordersTable.fields[0]?.fields.find((f) => f.fieldName === 'total');
    const itemProduct = itemsTable.fields[0]?.fields.find((f) => f.fieldName === 'product_name');
    const itemQuantity = itemsTable.fields[0]?.fields.find((f) => f.fieldName === 'quantity');

    if (!custName) return;

    const fieldsToAdd = [custName, orderCurrency, orderStatus, orderDate, orderTotal, itemProduct, itemQuantity].filter(
      Boolean
    ) as any[];
    const datasetFields = fieldsToAdd.map((f, idx) => {
      const df = createDatasetField(f);
      if (idx === 0 && df.groupable) {
        df.isGrouped = true;
      } else if ((df.dataType === 'currency' || df.dataType === 'number') && idx >= 3) {
        df.aggregationType = 'sum';
      }
      return df;
    });

    const statusField = datasetFields.find((f) => f.fieldName === 'status');
    const sampleFilters = statusField
      ? [{ fieldId: statusField.datasetFieldId, operator: 'eq' as const, value: 'completed' }]
      : [];

    this.activeDataset.set({
      ...this.activeDataset(),
      fields: datasetFields,
      filters: sampleFilters,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Resets the dataset to empty.
   */
  protected resetDataset(): void {
    this.activeDataset.set({
      ...this.activeDataset(),
      fields: [],
      filters: [],
      updatedAt: new Date().toISOString()
    });
  }

  protected addStandaloneField(field: any): void {
    if (!field?.visible) {
      return;
    }
    const df = createDatasetField(field);
    this.activeDataset.set({
      ...this.activeDataset(),
      fields: [...this.activeDataset().fields, df],
      updatedAt: new Date().toISOString()
    });
  }

  protected updateStandaloneFields(fields: DatasetField[]): void {
    this.activeDataset.set({
      ...this.activeDataset(),
      fields,
      updatedAt: new Date().toISOString()
    });
  }

  protected updateStandaloneFilters(filters: any[]): void {
    this.activeDataset.set({
      ...this.activeDataset(),
      filters,
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Handles schema metadata loaded from external source or preset.
   */
  protected onSchemaLoaded(result: LoadedSchemaResult): void {
    this.groupings.set(result.groupings);
    if (result.relationships) {
      this.additionalRelationships.set(result.relationships);
    }
  }

  /**
   * Quick selector for domain schema presets.
   */
  protected async onSelectPreset(presetId: string): Promise<void> {
    this.activePresetId.set(presetId);
    const result = await this.schemaDataLoader.loadSchema({
      type: 'preset',
      presetId
    });
    this.onSchemaLoaded(result);
    this.populateInitialDatasetForPreset(result);
  }

  /**
   * Populates a functional starter dataset whenever a schema preset is selected.
   */
  protected populateInitialDatasetForPreset(result: LoadedSchemaResult): void {
    if (!result.groupings.length || !result.groupings[0].tables.length) {
      this.resetDataset();
      return;
    }

    const firstTable = result.groupings[0].tables[0];
    const rawFields = firstTable.fields[0]?.fields || [];
    if (!rawFields.length) {
      this.resetDataset();
      return;
    }

    const fieldsToSelect = rawFields.slice(0, Math.min(4, rawFields.length));
    const datasetFields = fieldsToSelect.map((f, idx) => {
      const df = createDatasetField(f);
      if (idx === 0 && df.groupable) {
        df.isGrouped = true;
      } else if ((df.dataType === 'currency' || df.dataType === 'number') && idx === fieldsToSelect.length - 1) {
        df.aggregationType = 'sum';
      }
      return df;
    });

    this.activeDataset.set({
      datasetId: `dataset-${result.sourceType}-${Date.now()}`,
      name: `${result.sourceName} Dataset`,
      description: `Analytical dataset dynamically created from ${result.sourceName} schema.`,
      fields: datasetFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}
