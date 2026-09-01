export type GpStatTrendDirection = 'up' | 'down' | 'neutral';

export interface GpStatCardData {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: string | number;
    direction: GpStatTrendDirection;
    label?: string;
    isPositive?: boolean;
  };
  badge?: string;
  badgeSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';
  progress?: number;
  progressSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
}
