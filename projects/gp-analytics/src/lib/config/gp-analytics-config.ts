export interface GpAnalyticsTranslations {
  dashboardAriaLabel: string;
  dashboardEyebrow: string;
  dashboardDefaultTitle: string;
  designerAriaLabel: string;
  designerOutputOrderAriaLabel: string;
  designerEyebrow: string;
  designerDefaultTitle: string;
  designerDescription: string;
  designerCreateLabel: string;
  designerArtifactTypeTabular: string;
  designerArtifactTypeGraph: string;
  designerArtifactTypeKpi: string;
  designerGraphTypeLabel: string;
  designerGraphTypePie: string;
  designerGraphTypeBar: string;
  designerGraphTypeStackedBar: string;
  designerGraphTypeColumn: string;
  designerGraphTypeStackedColumn: string;
  designerGraphTypeRadial: string;
  designerHintTabular: string;
  designerHintGraph: string;
  designerHintKpi: string;
  designerPanelAvailableFields: string;
  designerPanelPreview: string;
  designerPanelSelectedFields: string;
  designerOutputOrderLabel: string;
  designerPreviewRefreshButton: string;
  designerPreviewRefreshAriaLabel: string;
  designerPreviewEmpty: string;
  designerPreviewStatusNotRefreshed: string;
  designerPreviewStatusOutdated: string;
  designerPreviewStatusUpToDate: string;
  designerPreviewLastRefreshedLabel: string;
  designerPreviewInvalidConfig: string;
  designerPreviewSummaryTabular: string;
  designerPreviewSummaryGraph: string;
  designerPreviewSummaryKpi: string;
  fieldPickerEmptyMessage: string;
  fieldListEmptyAriaLabel: string;
  fieldListEmptyMessage: string;
  fieldListDragHandleAriaLabel: string;
  fieldListAliasLabel: string;
  fieldListAggregationLabel: string;
  fieldListRoleLabel: string;
  fieldListFormatLabel: string;
  fieldListGroupByLabel: string;
  fieldListSortAriaPrefix: string;
  fieldListSortNoneLabel: string;
  fieldListRemoveAriaLabel: string;
  fieldListKpiRoleValueLabel: string;
  fieldListKpiRoleCompareLabel: string;
  fieldTypeLabelString: string;
  fieldTypeLabelNumber: string;
  fieldTypeLabelInteger: string;
  fieldTypeLabelBoolean: string;
  fieldTypeLabelDate: string;
  fieldTypeLabelDateTime: string;
  fieldTypeLabelTime: string;
  aggregationNoneLabel: string;
  aggregationSumLabel: string;
  aggregationAvgLabel: string;
  aggregationMinLabel: string;
  aggregationMaxLabel: string;
  aggregationCountLabel: string;
  aggregationCountDistinctLabel: string;
  graphRoleXAxisLabel: string;
  graphRoleYAxisLabel: string;
  graphRoleSeriesLabel: string;
  graphRoleTooltipLabel: string;
  columnFormatDefaultLabel: string;
  columnFormatNumber0Label: string;
  columnFormatNumber2Label: string;
  columnFormatCurrencyLabel: string;
  columnFormatPercentLabel: string;
  columnFormatCompactLabel: string;
  columnFormatDateShortLabel: string;
  columnFormatDateLongLabel: string;
  widgetDefaultTitle: string;
  widgetAriaLabel: string;
  widgetItemTypeLabel: string;
  widgetItemGeneratedAtLabel: string;
  widgetItemNoDataLabel: string;
  widgetItemNoValueLabel: string;
  widgetItemBooleanTrueLabel: string;
  widgetItemBooleanFalseLabel: string;
  widgetArtifactTypeTabular: string;
  widgetArtifactTypeGraph: string;
  widgetArtifactTypeKpi: string;
  widgetGraphTypeLabel: string;
  widgetGraphTypePie: string;
  widgetGraphTypeBar: string;
  widgetGraphTypeStackedBar: string;
  widgetGraphTypeColumn: string;
  widgetGraphTypeStackedColumn: string;
  widgetGraphTypeRadial: string;
  designerErrorAtLeastOneField: string;
  designerErrorGraphNeedsXAxis: string;
  designerErrorGraphNeedsYAxis: string;
  designerErrorKpiNeedsValueField: string;
  designerErrorKpiValueMustBeNumeric: string;
  designerErrorKpiTooManyFields: string;
}

export interface GpAnalyticsFormattingConfig {
  locale: string;
  currency: string;
  timeZone?: string;
  dateShort: Intl.DateTimeFormatOptions;
  dateLong: Intl.DateTimeFormatOptions;
}

export interface GpAnalyticsThemeConfig {
  surface: string;
  surfaceMuted: string;
  surfaceSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  accentBackground: string;
  accentBorder: string;
  accentText: string;
  focusRing: string;
  successBackground: string;
  successBorder: string;
  successText: string;
  warningBackground: string;
  warningBorder: string;
  warningText: string;
  dangerBackground: string;
  dangerBorder: string;
  dangerText: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
  shadowSm: string;
  shadowMd: string;
}

export const DEFAULT_GP_ANALYTICS_TRANSLATIONS: GpAnalyticsTranslations = {
  dashboardAriaLabel: 'Dashboard',
  dashboardEyebrow: 'Dashboard',
  dashboardDefaultTitle: 'Dashboard',
  designerAriaLabel: 'Designer',
  designerOutputOrderAriaLabel: 'Field display order',
  designerEyebrow: 'Designer',
  designerDefaultTitle: 'Designer',
  designerDescription: 'Design and configure your analytics components.',
  designerCreateLabel: 'You are creating',
  designerArtifactTypeTabular: 'Tabular data',
  designerArtifactTypeGraph: 'Graph',
  designerArtifactTypeKpi: 'KPI',
  designerGraphTypeLabel: 'Graph type',
  designerGraphTypePie: 'Pie',
  designerGraphTypeBar: 'Bar',
  designerGraphTypeStackedBar: 'Stacked bar',
  designerGraphTypeColumn: 'Column',
  designerGraphTypeStackedColumn: 'Stacked column',
  designerGraphTypeRadial: 'Radial',
  designerHintTabular: 'Tabular mode: supports multiple sort columns and per-column formatting.',
  designerHintGraph:
    'Graph mode: assign each selected field a role such as x-axis, y-axis, series, or tooltip.',
  designerHintKpi:
    'KPI mode: one required numeric value field plus one optional numeric compare field.',
  designerPanelAvailableFields: 'Available Fields',
  designerPanelPreview: 'Preview',
  designerPanelSelectedFields: 'Selected Fields (order matters)',
  designerOutputOrderLabel: 'Output order:',
  designerPreviewRefreshButton: 'Refresh preview',
  designerPreviewRefreshAriaLabel: 'Refresh preview data',
  designerPreviewEmpty: 'Preview has not been generated yet.',
  designerPreviewStatusNotRefreshed: 'Not refreshed yet.',
  designerPreviewStatusOutdated: 'Changes are pending. Refresh to update preview.',
  designerPreviewStatusUpToDate: 'Preview is up to date.',
  designerPreviewLastRefreshedLabel: 'Last refreshed',
  designerPreviewInvalidConfig: 'Fix configuration errors before refreshing preview.',
  designerPreviewSummaryTabular: 'Preview of tabular output generated from current selection.',
  designerPreviewSummaryGraph: 'Preview of graph output generated from current selection.',
  designerPreviewSummaryKpi: 'Preview of KPI output generated from current selection.',
  fieldPickerEmptyMessage: 'No datasets available.',
  fieldListEmptyAriaLabel: 'Drop zone',
  fieldListEmptyMessage: 'Drag fields here',
  fieldListDragHandleAriaLabel: 'Drag to reorder',
  fieldListAliasLabel: 'Alias',
  fieldListAggregationLabel: 'Aggregation',
  fieldListRoleLabel: 'Role',
  fieldListFormatLabel: 'Format',
  fieldListGroupByLabel: 'Group by',
  fieldListSortAriaPrefix: 'Sort',
  fieldListSortNoneLabel: 'none',
  fieldListRemoveAriaLabel: 'Remove field',
  fieldListKpiRoleValueLabel: 'value',
  fieldListKpiRoleCompareLabel: 'compare',
  fieldTypeLabelString: 'ABC',
  fieldTypeLabelNumber: '#',
  fieldTypeLabelInteger: 'INT',
  fieldTypeLabelBoolean: 'T/F',
  fieldTypeLabelDate: 'DAT',
  fieldTypeLabelDateTime: 'DT',
  fieldTypeLabelTime: 'TIM',
  aggregationNoneLabel: 'None',
  aggregationSumLabel: 'Sum',
  aggregationAvgLabel: 'Average',
  aggregationMinLabel: 'Minimum',
  aggregationMaxLabel: 'Maximum',
  aggregationCountLabel: 'Count',
  aggregationCountDistinctLabel: 'Count Distinct',
  graphRoleXAxisLabel: 'X-axis',
  graphRoleYAxisLabel: 'Y-axis',
  graphRoleSeriesLabel: 'Series',
  graphRoleTooltipLabel: 'Tooltip',
  columnFormatDefaultLabel: 'Default',
  columnFormatNumber0Label: 'Number (0 decimals)',
  columnFormatNumber2Label: 'Number (2 decimals)',
  columnFormatCurrencyLabel: 'Currency',
  columnFormatPercentLabel: 'Percent',
  columnFormatCompactLabel: 'Compact',
  columnFormatDateShortLabel: 'Date (short)',
  columnFormatDateLongLabel: 'Date (long)',
  widgetDefaultTitle: 'Widget',
  widgetAriaLabel: 'Widget',
  widgetItemTypeLabel: 'Type',
  widgetItemGeneratedAtLabel: 'Generated',
  widgetItemNoDataLabel: 'No item data available.',
  widgetItemNoValueLabel: 'No value',
  widgetItemBooleanTrueLabel: 'True',
  widgetItemBooleanFalseLabel: 'False',
  widgetArtifactTypeTabular: 'Tabular data',
  widgetArtifactTypeGraph: 'Graph',
  widgetArtifactTypeKpi: 'KPI',
  widgetGraphTypeLabel: 'Graph type',
  widgetGraphTypePie: 'Pie',
  widgetGraphTypeBar: 'Bar',
  widgetGraphTypeStackedBar: 'Stacked bar',
  widgetGraphTypeColumn: 'Column',
  widgetGraphTypeStackedColumn: 'Stacked column',
  widgetGraphTypeRadial: 'Radial',
  designerErrorAtLeastOneField: 'Select at least one field.',
  designerErrorGraphNeedsXAxis: 'Graph requires at least one field assigned to x-axis.',
  designerErrorGraphNeedsYAxis: 'Graph requires at least one field assigned to y-axis.',
  designerErrorKpiNeedsValueField: 'KPI requires a numeric value field.',
  designerErrorKpiValueMustBeNumeric: 'KPI value field must be numeric.',
  designerErrorKpiTooManyFields: 'KPI supports a value field and one optional compare field only.',
};

export const DEFAULT_GP_ANALYTICS_FORMATTING: GpAnalyticsFormattingConfig = {
  locale: 'en-US',
  currency: 'USD',
  dateShort: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  dateLong: {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
};

export const DEFAULT_GP_ANALYTICS_THEME: GpAnalyticsThemeConfig = {
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  surfaceSoft: '#fcfdff',
  textPrimary: '#13212b',
  textSecondary: '#334155',
  textMuted: '#64748b',
  border: '#d4dde7',
  borderSubtle: '#e2e8f0',
  borderStrong: '#cbd5e1',
  accentBackground: '#eff6ff',
  accentBorder: '#bfdbfe',
  accentText: '#1d4ed8',
  focusRing: '#93c5fd',
  successBackground: '#ecfdf5',
  successBorder: '#86efac',
  successText: '#0f766e',
  warningBackground: '#fffbeb',
  warningBorder: '#fcd34d',
  warningText: '#92400e',
  dangerBackground: '#fef2f2',
  dangerBorder: '#fecaca',
  dangerText: '#b91c1c',
  radiusSm: '0.25rem',
  radiusMd: '0.5rem',
  radiusLg: '0.75rem',
  radiusFull: '999px',
  shadowSm: '0 1px 2px rgb(0 0 0 / 0.04)',
  shadowMd: '0 4px 12px rgb(19 33 43 / 0.08)',
};

export function gpAnalyticsThemeCssVariables(
  theme?: Partial<GpAnalyticsThemeConfig>,
): Record<string, string> {
  const resolved = {
    ...DEFAULT_GP_ANALYTICS_THEME,
    ...theme,
  };

  return {
    '--gp-color-surface': resolved.surface,
    '--gp-color-surface-muted': resolved.surfaceMuted,
    '--gp-color-surface-soft': resolved.surfaceSoft,
    '--gp-color-text-primary': resolved.textPrimary,
    '--gp-color-text-secondary': resolved.textSecondary,
    '--gp-color-text-muted': resolved.textMuted,
    '--gp-color-border': resolved.border,
    '--gp-color-border-subtle': resolved.borderSubtle,
    '--gp-color-border-strong': resolved.borderStrong,
    '--gp-color-accent-bg': resolved.accentBackground,
    '--gp-color-accent-border': resolved.accentBorder,
    '--gp-color-accent-text': resolved.accentText,
    '--gp-color-focus': resolved.focusRing,
    '--gp-color-success-bg': resolved.successBackground,
    '--gp-color-success-border': resolved.successBorder,
    '--gp-color-success-text': resolved.successText,
    '--gp-color-warning-bg': resolved.warningBackground,
    '--gp-color-warning-border': resolved.warningBorder,
    '--gp-color-warning-text': resolved.warningText,
    '--gp-color-danger-bg': resolved.dangerBackground,
    '--gp-color-danger-border': resolved.dangerBorder,
    '--gp-color-danger-text': resolved.dangerText,
    '--gp-radius-sm': resolved.radiusSm,
    '--gp-radius-md': resolved.radiusMd,
    '--gp-radius-lg': resolved.radiusLg,
    '--gp-radius-full': resolved.radiusFull,
    '--gp-shadow-sm': resolved.shadowSm,
    '--gp-shadow-md': resolved.shadowMd,
  };
}

export interface GpAnalyticsConfig {
  appName: string;
  endpoint: string;
  enabled?: boolean;
  formatting?: Partial<GpAnalyticsFormattingConfig>;
  theme?: Partial<GpAnalyticsThemeConfig>;
  translations?: Partial<GpAnalyticsTranslations>;
}

export interface GpAnalyticsEvent {
  name: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}
