export interface GpBaseWidgetConfig {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  cardElevation?: 'flat' | 'raised' | 'outlined';
}
