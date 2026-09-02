/**
 * @file schema.types.ts
 * Type definitions and interfaces for gp-blocks Dynamic JSON Metadata Engine.
 */

export type GpFieldType =
  | 'text'
  | 'input'
  | 'textarea'
  | 'password'
  | 'number'
  | 'input-number'
  | 'mask'
  | 'input-mask'
  | 'select'
  | 'dropdown'
  | 'multi-select'
  | 'autocomplete'
  | 'cascade-select'
  | 'tree-select'
  | 'listbox'
  | 'checkbox'
  | 'radio'
  | 'radio-button'
  | 'switch'
  | 'toggle-button'
  | 'slider'
  | 'rating'
  | 'color'
  | 'color-picker'
  | 'date'
  | 'date-picker'
  | 'date-range'
  | 'date-range-picker'
  | 'time'
  | 'time-picker'
  | 'file-upload'
  | 'file'
  | 'form-field'
  | 'label'
  | 'float-label'
  | 'inset-label'
  | 'divider'
  | 'heading'
  | 'custom';

export interface GpFieldOption {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
  badge?: string;
}

export interface GpFieldValidation {
  required?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface GpFieldSchema {
  name: string;
  label?: string;
  type: GpFieldType;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  colSpan?: number; // 1 - 12 (default 12 for mobile, responsive grids)
  colSpanMd?: number;
  colSpanLg?: number;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  options?: GpFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number; // for textarea
  validation?: GpFieldValidation;
  hiddenWhen?: { field: string; equals: any };
  customClass?: string;

  // Specific component properties
  mask?: string;
  maskSlotChar?: string;
  suggestions?: string[] | GpFieldOption[];
  cascadeOptions?: any[];
  treeNodes?: any[];
  stars?: number;
  stepMinute?: number;
  minuteSteps?: number[];
  hourFormat?: '12' | '24';
  accept?: string;
  multiple?: boolean;
  floatLabelVariant?: 'on' | 'in' | 'over';
  insetLabelSize?: 'sm' | 'md' | 'lg';
  appearance?: 'outlined' | 'filled' | 'inset';
  helpText?: string;
  severity?: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
}

export interface GpFormAction {
  id: string;
  label: string;
  type?: 'submit' | 'reset' | 'button';
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
  variant?: 'filled' | 'outlined' | 'text';
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
}

export interface GpFormSchema {
  id?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  gridColumns?: number; // default 12
  fields: GpFieldSchema[];
  submitButton?: GpFormAction;
  resetButton?: GpFormAction;
  secondaryActions?: GpFormAction[];
  layout?: 'grid' | 'stacked' | 'horizontal';
  cardShell?: boolean;
  validationMode?: 'onBlur' | 'onChange' | 'onSubmit';
}

export interface GpBreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
  current?: boolean;
}

export interface GpHeaderBadge {
  text: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
}

export interface GpHeaderAvatar {
  image?: string;
  label?: string;
  icon?: string;
  shape?: 'circle' | 'square';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface GpHeaderStatItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export interface GpHeaderSchema {
  title: string;
  subtitle?: string;
  breadcrumbs?: GpBreadcrumbItem[];
  badge?: GpHeaderBadge;
  avatar?: GpHeaderAvatar;
  actions?: GpFormAction[];
  stats?: GpHeaderStatItem[];
  backButton?: boolean;
  borderBottom?: boolean;
  coverImage?: string;
}

export interface GpStatCardItem {
  id: string;
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  changeLabel?: string;
  icon?: string;
  iconColor?: string;
  iconBackground?: string;
  progress?: number;
  badge?: string;
  sparkline?: number[];
  color?: string;
}

export interface GpStatsSchema {
  title?: string;
  subtitle?: string;
  columns?: 1 | 2 | 3 | 4 | 6;
  items: GpStatCardItem[];
}

export interface GpDescriptionItem {
  label: string;
  value: any;
  type?: 'text' | 'badge' | 'tag' | 'link' | 'avatar' | 'date' | 'currency' | 'copy';
  badgeSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
  icon?: string;
  colSpan?: number;
}

export interface GpDescriptionSchema {
  title?: string;
  subtitle?: string;
  items: GpDescriptionItem[];
  columns?: 1 | 2 | 3 | 4;
  bordered?: boolean;
  striped?: boolean;
}

export interface GpTimelineItem {
  title: string;
  date: string;
  description?: string;
  icon?: string;
  color?: string;
  user?: { name: string; avatar?: string };
  badge?: string;
}

export interface GpTimelineSchema {
  title?: string;
  items: GpTimelineItem[];
}

export interface GpBlockMetadata {
  id: string;
  title: string;
  description?: string;
  category:
    | 'layouts'
    | 'dashboards'
    | 'settings-details'
    | 'headings'
    | 'data-displays'
    | 'lists'
    | 'forms'
    | 'feedbacks'
    | 'navigations-overlays'
    | 'pages';
  tags?: string[];
  header?: GpHeaderSchema;
  stats?: GpStatsSchema;
  form?: GpFormSchema;
  descriptions?: GpDescriptionSchema;
  timeline?: GpTimelineSchema;
  customData?: Record<string, any>;
  themeOverrides?: Record<string, string>;
  localizationTokens?: Record<string, Record<string, string>>;
}
