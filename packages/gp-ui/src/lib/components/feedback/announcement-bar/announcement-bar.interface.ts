export type GpBannerSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';

export interface GpBannerAction {
  label: string;
  url?: string;
  icon?: string;
  action?: () => void;
}
