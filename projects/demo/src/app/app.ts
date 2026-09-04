import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButton,
  GpIcon,
  GpTag,
  GpBadge,
} from '@generatedpixel/gp-ui';
import {
  GpGrid,
  GpGridItem,
} from '@generatedpixel/gp-grid';
import {
  GpAnalyticsDesigner,
  GpReportViewer,
  ReportGeneratorService,
  GeneratedReport,
  DatasetFolder,
  LocalizationService,
} from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButton,
    GpIcon,
    GpTag,
    GpGrid,
    GpAnalyticsDesigner,
    GpReportViewer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly reportGenerator = inject(ReportGeneratorService);
  protected readonly localization = inject(LocalizationService);

  // Theme & Appearance
  protected readonly isDarkMode = signal<boolean>(true);
  protected readonly activeTheme = signal<string>('default');
  protected readonly availableThemes = [
    { id: 'default', name: 'Default Indigo' },
    { id: 'ocean', name: 'Ocean Cyan' },
    { id: 'emerald', name: 'Emerald Green' },
    { id: 'amethyst', name: 'Amethyst Purple' },
    { id: 'sunset', name: 'Sunset Orange' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon' },
    { id: 'nord', name: 'Nord Frost' },
  ];

  // Active View Tab: Dashboard, Report, Designer ONLY
  protected readonly activeTab = signal<'dashboard' | 'report' | 'designer'>('dashboard');

  // Selected Standalone Report for the 'Report' tab
  protected readonly selectedStandaloneReportId = signal<string>('executive_summary');

  // Grid Configuration (gp-grid)
  protected readonly showGridLines = signal<boolean>(false);
  protected readonly compactMode = signal<'vertical' | 'none'>('vertical');

  // Multi-Lingual Dataset Taxonomy for Analytics Designer
  protected readonly datasetFolders: DatasetFolder[] = [
    {
      id: 'financials',
      name: { en: 'Financials & Revenue', fr: 'Finances et Revenus', de: 'Finanzen und Umsatz', es: 'Finanzas e Ingresos' },
      description: { en: 'Monetary metrics, profit margins and sales volumes', fr: 'Indicateurs financiers et marges bénéficiaires' },
      fields: [
        {
          name: 'sales',
          label: { en: 'Gross Sales', fr: 'Ventes Brutes', de: 'Bruttoumsatz', es: 'Ventas Brutas' },
          dataType: 'number',
          folderId: 'financials',
          defaultAggregation: 'sum',
          defaultFormat: 'currency',
        },
        {
          name: 'profit',
          label: { en: 'Net Profit', fr: 'Bénéfice Net', de: 'Reingewinn', es: 'Beneficio Neto' },
          dataType: 'number',
          folderId: 'financials',
          defaultAggregation: 'sum',
          defaultFormat: 'currency',
        },
        {
          name: 'units',
          label: { en: 'Quantity Sold', fr: 'Unités Vendues', de: 'Verkaufte Einheiten', es: 'Unidades Vendidas' },
          dataType: 'number',
          folderId: 'financials',
          defaultAggregation: 'sum',
          defaultFormat: 'number-0',
        },
        {
          name: 'discount',
          label: { en: 'Discount Rate', fr: 'Taux de Remise', de: 'Rabattsatz', es: 'Tasa de Descuento' },
          dataType: 'number',
          folderId: 'financials',
          defaultAggregation: 'avg',
          defaultFormat: 'percent',
        },
      ],
    },
    {
      id: 'geography',
      name: { en: 'Customer & Geography', fr: 'Clientèle et Géographie', de: 'Kunden und Geografie', es: 'Clientes y Geografía' },
      description: { en: 'Geographic distribution and account segments', fr: 'Distribution géographique des clients' },
      fields: [
        {
          name: 'region',
          label: { en: 'Territory Region', fr: 'Région Commerciale', de: 'Vertriebsregion', es: 'Región Comercial' },
          dataType: 'string',
          folderId: 'geography',
          valueMapping: {
            NA: { en: 'North America', fr: 'Amérique du Nord', de: 'Nordamerika', es: 'Norteamérica' },
            EU: { en: 'Europe', fr: 'Europe', de: 'Europa', es: 'Europa' },
            APAC: { en: 'Asia Pacific', fr: 'Asie-Pacifique', de: 'Asien-Pazifik', es: 'Asia-Pacífico' },
            LATAM: { en: 'Latin America', fr: 'Amérique Latine', de: 'Lateinamerika', es: 'Latinoamérica' },
            EMEA: { en: 'Middle East', fr: 'Moyen-Orient', de: 'Naher Osten', es: 'Medio Oriente' },
          },
        },
        {
          name: 'country',
          label: { en: 'Billing Country', fr: 'Pays de Facturation', de: 'Rechnungsland', es: 'País de Facturación' },
          dataType: 'string',
          folderId: 'geography',
          valueMapping: {
            US: { en: 'United States', fr: 'États-Unis', de: 'Vereinigte Staaten', es: 'Estados Unidos' },
            CA: { en: 'Canada', fr: 'Canada', de: 'Kanada', es: 'Canadá' },
            DE: { en: 'Germany', fr: 'Allemagne', de: 'Deutschland', es: 'Alemania' },
            GB: { en: 'United Kingdom', fr: 'Royaume-Uni', de: 'Vereinigtes Königreich', es: 'Reino Unido' },
            FR: { en: 'France', fr: 'France', de: 'Frankreich', es: 'Francia' },
            JP: { en: 'Japan', fr: 'Japon', de: 'Japan', es: 'Japón' },
            AU: { en: 'Australia', fr: 'Australie', de: 'Australien', es: 'Australia' },
            SG: { en: 'Singapore', fr: 'Singapour', de: 'Singapur', es: 'Singapur' },
            BR: { en: 'Brazil', fr: 'Brésil', de: 'Brasilien', es: 'Brasil' },
            MX: { en: 'Mexico', fr: 'Mexique', de: 'Mexiko', es: 'México' },
            AE: { en: 'United Arab Emirates', fr: 'Émirats Arabes Unis', de: 'VAE', es: 'EAU' },
          },
        },
        {
          name: 'segment',
          label: { en: 'Account Segment', fr: 'Segment de Compte', de: 'Kontosegment', es: 'Segmento de Cuenta' },
          dataType: 'string',
          folderId: 'geography',
        },
      ],
    },
    {
      id: 'products',
      name: { en: 'Product Taxonomy', fr: 'Catalogue de Produits', de: 'Produktkatalog', es: 'Catálogo de Productos' },
      description: { en: 'Product lines and categories', fr: 'Lignes de produits et articles' },
      fields: [
        {
          name: 'category',
          label: { en: 'Category', fr: 'Catégorie', de: 'Kategorie', es: 'Categoría' },
          dataType: 'string',
          folderId: 'products',
        },
        {
          name: 'subCategory',
          label: { en: 'Sub-Category', fr: 'Sous-Catégorie', de: 'Unterkategorie', es: 'Subcategoría' },
          dataType: 'string',
          folderId: 'products',
        },
        {
          name: 'sku',
          label: { en: 'Product SKU', fr: 'Code Article', de: 'Artikelnummer', es: 'Código SKU' },
          dataType: 'string',
          folderId: 'products',
        },
      ],
    },
    {
      id: 'logistics',
      name: { en: 'Fulfillment & Logistics', fr: 'Statut et Logistique', de: 'Bestellstatus und Logistik', es: 'Estado y Logística' },
      description: { en: 'Order fulfillment status and dispatch modes', fr: 'Statut de livraison et expédition' },
      fields: [
        {
          name: 'status',
          label: { en: 'Fulfillment Status', fr: 'Statut de Livraison', de: 'Lieferstatus', es: 'Estado del Pedido' },
          dataType: 'string',
          folderId: 'logistics',
          valueMapping: {
            PENDING: { en: 'Pending Review', fr: 'En attente', de: 'Ausstehend', es: 'Pendiente' },
            IN_TRANSIT: { en: 'In Transit', fr: 'En transit', de: 'Auf dem Transportweg', es: 'En tránsito' },
            DELIVERED: { en: 'Delivered', fr: 'Livré', de: 'Zugestellt', es: 'Entregado' },
          },
        },
        {
          name: 'shipMode',
          label: { en: 'Ship Mode', fr: 'Mode d’expédition', de: 'Versandart', es: 'Método de Envío' },
          dataType: 'string',
          folderId: 'logistics',
        },
        {
          name: 'shippingDays',
          label: { en: 'Shipping Lead Time (Days)', fr: 'Délai de Livraison (Jours)', de: 'Lieferzeit (Tage)', es: 'Tiempo de Entrega (Días)' },
          dataType: 'number',
          folderId: 'logistics',
          defaultAggregation: 'avg',
          defaultFormat: 'number-0',
        },
      ],
    },
  ];

  protected readonly datasetRows: Record<string, unknown>[] = [
    { region: 'NA', country: 'US', status: 'DELIVERED', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-01', sales: 48500, profit: 16200, units: 32, discount: 0.08, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'NA', country: 'US', status: 'IN_TRANSIT', segment: 'Mid-Market', category: 'SaaS Software', subCategory: 'Analytics', sku: 'SKU-ANLYT-02', sales: 24200, profit: 11500, units: 48, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'NA', country: 'CA', status: 'DELIVERED', segment: 'Enterprise', category: 'Hardware Devices', subCategory: 'Edge Routers', sku: 'SKU-ROUT-11', sales: 31000, profit: 8900, units: 14, discount: 0.12, shipMode: 'Express Air', shippingDays: 2 },
    { region: 'EU', country: 'DE', status: 'DELIVERED', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Storage', sku: 'SKU-STOR-05', sales: 56000, profit: 19800, units: 60, discount: 0.06, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'EU', country: 'GB', status: 'IN_TRANSIT', segment: 'Strategic', category: 'SaaS Software', subCategory: 'Security', sku: 'SKU-SEC-09', sales: 41500, profit: 18400, units: 28, discount: 0.04, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'EU', country: 'FR', status: 'PENDING', segment: 'Mid-Market', category: 'Hardware Devices', subCategory: 'IoT Sensors', sku: 'SKU-IOT-44', sales: 18700, profit: 4200, units: 85, discount: 0.15, shipMode: 'Standard Freight', shippingDays: 4 },
    { region: 'APAC', country: 'JP', status: 'DELIVERED', segment: 'Enterprise', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-02', sales: 62000, profit: 24500, units: 45, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'APAC', country: 'AU', status: 'DELIVERED', segment: 'Strategic', category: 'SaaS Software', subCategory: 'Analytics', sku: 'SKU-ANLYT-03', sales: 34800, profit: 14700, units: 30, discount: 0.07, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'APAC', country: 'SG', status: 'IN_TRANSIT', segment: 'Enterprise', category: 'Hardware Devices', subCategory: 'Edge Routers', sku: 'SKU-ROUT-12', sales: 27900, profit: 7800, units: 18, discount: 0.10, shipMode: 'Express Air', shippingDays: 1 },
    { region: 'LATAM', country: 'BR', status: 'PENDING', segment: 'Mid-Market', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-08', sales: 19500, profit: 6400, units: 19, discount: 0.10, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'LATAM', country: 'MX', status: 'DELIVERED', segment: 'Mid-Market', category: 'SaaS Software', subCategory: 'Security', sku: 'SKU-SEC-15', sales: 16200, profit: 5900, units: 22, discount: 0.08, shipMode: 'Instant Digital', shippingDays: 0 },
    { region: 'EMEA', country: 'AE', status: 'DELIVERED', segment: 'Strategic', category: 'Cloud Infrastructure', subCategory: 'Compute', sku: 'SKU-COMP-09', sales: 38400, profit: 15200, units: 26, discount: 0.05, shipMode: 'Instant Digital', shippingDays: 0 },
  ];

  // Saved Designer Reports map
  protected readonly savedReports = signal<Map<string, GeneratedReport>>(new Map());

  // Notification for newly added report
  protected readonly lastAddedReportTitle = signal<string | null>(null);

  // Initial GpGrid Layout Items (Example Dashboard)
  protected readonly initialGridItems: GpGridItem[] = [
    {
      id: 'rep_sales_by_region',
      x: 0,
      y: 0,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: 'Global Revenue by Region',
      icon: 'bar-chart',
      badge: 'GRAPH',
      badgeSeverity: 'primary',
      widgetType: 'custom',
    },
    {
      id: 'rep_category_breakdown',
      x: 6,
      y: 0,
      w: 6,
      h: 3,
      minW: 4,
      minH: 2,
      title: 'Category Profitability Matrix',
      icon: 'table',
      badge: 'TABULAR',
      badgeSeverity: 'info',
      widgetType: 'custom',
    },
    {
      id: 'rep_total_revenue_kpi',
      x: 0,
      y: 3,
      w: 4,
      h: 2,
      minW: 3,
      minH: 2,
      title: 'Enterprise Gross Revenue',
      icon: 'activity',
      badge: 'KPI',
      badgeSeverity: 'success',
      widgetType: 'custom',
    },
    {
      id: 'rep_logistics_status',
      x: 4,
      y: 3,
      w: 4,
      h: 2,
      minW: 3,
      minH: 2,
      title: 'Fulfillment Order Distribution',
      icon: 'pie-chart',
      badge: 'GRAPH',
      badgeSeverity: 'warning',
      widgetType: 'custom',
    },
    {
      id: 'rep_country_breakdown',
      x: 8,
      y: 3,
      w: 4,
      h: 2,
      minW: 3,
      minH: 2,
      title: 'Top Country Volume',
      icon: 'globe',
      badge: 'TABULAR',
      badgeSeverity: 'contrast',
      widgetType: 'custom',
    },
  ];

  protected readonly gridItems = signal<GpGridItem[]>([...this.initialGridItems]);

  // Standalone Report Options
  protected readonly standaloneReportsList = [
    { id: 'executive_summary', label: 'Executive Commercial Performance (Tabular)' },
    { id: 'rep_sales_by_region', label: 'Continental Revenue Distribution (Graph)' },
    { id: 'rep_total_revenue_kpi', label: 'Global Gross Revenue Summary (KPI)' },
  ];

  // Active Standalone Report Computed
  protected readonly activeStandaloneReport = computed<GeneratedReport | undefined>(() => {
    return this.savedReports().get(this.selectedStandaloneReportId());
  });

  ngOnInit(): void {
    // Apply initial theme
    this.applyTheme(this.activeTheme(), this.isDarkMode());

    // Generate starter reports into the dashboard and standalone report viewer
    this.initStarterReports();
  }

  private initStarterReports(): void {
    const locale = this.localization.activeLocale();

    // 1. Regional Graph Report
    const regionalGraphReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Global Revenue by Region', fr: 'Revenus Mondiaux par Région', de: 'Weltweiter Umsatz nach Region' },
        description: { en: 'Aggregated gross sales across continental territories', fr: 'Ventes brutes agrégées par territoire' },
        artifactType: 'graph',
        graphType: 'bar',
        fields: [
          {
            field: this.findField('region')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('sales')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
        ],
      },
      this.datasetRows,
    );

    // 2. Category Tabular Matrix Report
    const categoryTableReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Category Profitability Matrix', fr: 'Matrice de Rentabilité par Catégorie', de: 'Rentabilitätsmatrix nach Kategorie' },
        description: { en: 'Total revenue, profits, and margin breakdown by catalog', fr: 'Chiffre d’affaires et marges par catégorie' },
        artifactType: 'tabular',
        fields: [
          {
            field: this.findField('category')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('sales')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: this.findField('profit')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: this.findField('units')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'number-0',
          },
        ],
      },
      this.datasetRows,
    );

    // 3. KPI Gross Revenue Report
    const revenueKpiReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Enterprise Gross Revenue', fr: 'Revenu Brut d’Entreprise', de: 'Gesamtbruttoumsatz' },
        description: { en: 'Total global revenue worldwide', fr: 'Chiffre d’affaires global cumulé' },
        artifactType: 'kpi',
        fields: [
          {
            field: this.findField('sales')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: this.findField('region')!,
            aggregation: 'none',
            groupBy: true,
          },
        ],
      },
      this.datasetRows,
    );

    // 4. Logistics Fulfillment Graph Report
    const logisticsReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Fulfillment Order Distribution', fr: 'Répartition des Commandes', de: 'Auftragsverteilung nach Status' },
        description: { en: 'Total volume by fulfillment status', fr: 'Volume par statut de commande' },
        artifactType: 'graph',
        graphType: 'column',
        fields: [
          {
            field: this.findField('status')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('units')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'number-0',
          },
        ],
      },
      this.datasetRows,
    );

    // 5. Country Volume Tabular Report
    const countryReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Top Country Volume', fr: 'Volume par Pays', de: 'Volumen nach Land' },
        artifactType: 'tabular',
        fields: [
          {
            field: this.findField('country')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('units')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'number-0',
          },
          {
            field: this.findField('sales')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
        ],
      },
      this.datasetRows,
    );

    // 6. Full Comprehensive Standalone Executive Report
    const executiveSummaryReport = this.reportGenerator.generateReport(
      {
        title: { en: 'Executive Commercial Performance Report', fr: 'Rapport Exécutif de Performance Commerciale', de: 'Geschäftsbericht Vertriebsleistung' },
        description: { en: 'Comprehensive multi-dimensional analysis with localized values', fr: 'Analyse multidimensionnelle complète avec valeurs traduites' },
        artifactType: 'tabular',
        fields: [
          {
            field: this.findField('region')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('category')!,
            aggregation: 'none',
            groupBy: true,
          },
          {
            field: this.findField('sales')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: this.findField('profit')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'currency',
          },
          {
            field: this.findField('units')!,
            aggregation: 'sum',
            groupBy: false,
            columnFormat: 'number-0',
          },
          {
            field: this.findField('discount')!,
            aggregation: 'avg',
            groupBy: false,
            columnFormat: 'percent',
          },
        ],
      },
      this.datasetRows,
    );

    const map = new Map<string, GeneratedReport>();
    map.set('rep_sales_by_region', regionalGraphReport);
    map.set('rep_category_breakdown', categoryTableReport);
    map.set('rep_total_revenue_kpi', revenueKpiReport);
    map.set('rep_logistics_status', logisticsReport);
    map.set('rep_country_breakdown', countryReport);
    map.set('executive_summary', executiveSummaryReport);
    this.savedReports.set(map);
  }

  private findField(name: string) {
    for (const folder of this.datasetFolders) {
      const found = folder.fields.find((f) => f.name === name);
      if (found) return found;
    }
    return undefined;
  }

  // Retrieve saved report for grid widget
  protected getSavedReport(widgetId: string): GeneratedReport | undefined {
    return this.savedReports().get(widgetId);
  }

  // Handle report generated from GpAnalyticsDesigner
  protected onReportSaved(report: GeneratedReport): void {
    const widgetId = `custom_rep_${Date.now()}`;
    this.savedReports.update((map) => {
      const next = new Map(map);
      next.set(widgetId, report);
      return next;
    });

    const isKpi = report.artifactType === 'kpi';
    const newGridItem: GpGridItem = {
      id: widgetId,
      x: 0,
      y: 0,
      w: isKpi ? 4 : 6,
      h: isKpi ? 2 : 3,
      minW: 3,
      minH: 2,
      title: report.title,
      icon: isKpi ? 'zap' : report.artifactType === 'graph' ? 'bar-chart' : 'table',
      badge: report.artifactType.toUpperCase(),
      badgeSeverity: isKpi ? 'success' : report.artifactType === 'graph' ? 'primary' : 'info',
      widgetType: 'custom',
    };

    this.gridItems.update((items) => [newGridItem, ...items]);
    this.lastAddedReportTitle.set(report.title);
    this.activeTab.set('dashboard');

    setTimeout(() => {
      if (this.lastAddedReportTitle() === report.title) {
        this.lastAddedReportTitle.set(null);
      }
    }, 4000);
  }

  // Grid Actions
  protected resetGridLayout(): void {
    this.gridItems.set(JSON.parse(JSON.stringify(this.initialGridItems)));
  }

  protected toggleGridLines(): void {
    this.showGridLines.update((v) => !v);
  }

  protected toggleCompactMode(): void {
    this.compactMode.update((mode) => (mode === 'vertical' ? 'none' : 'vertical'));
  }

  protected onLayoutChange(_items: GpGridItem[]): void {
    // Layout updated reactively by gp-grid
  }

  // Theme handlers
  protected selectTheme(themeId: string): void {
    this.activeTheme.set(themeId);
    this.applyTheme(themeId, this.isDarkMode());
  }

  protected toggleDarkMode(): void {
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    this.applyTheme(this.activeTheme(), nextMode);
  }

  private applyTheme(theme: string, isDark: boolean): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-gp-theme', theme);
    root.setAttribute('data-gp-mode', isDark ? 'dark' : 'light');

    const classesToRemove: string[] = ['gp-light', 'gp-dark'];
    root.classList.forEach((cls) => {
      if (cls.startsWith('gp-theme-')) {
        classesToRemove.push(cls);
      }
    });
    root.classList.remove(...classesToRemove);
    root.classList.add(`gp-theme-${theme}`);
    root.classList.add(isDark ? 'gp-dark' : 'gp-light');
  }
}
