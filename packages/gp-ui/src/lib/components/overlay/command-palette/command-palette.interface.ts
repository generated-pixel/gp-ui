export interface GpCommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
  keywords?: string[];
  shortcut?: string;
  disabled?: boolean;
  action?: () => void;
  children?: GpCommandItem[];
  badge?: string;
  badgeSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
}

export interface GpCommandGroup {
  name: string;
  items: GpCommandItem[];
}
