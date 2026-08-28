export type GpToastSeverity = 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'contrast';
export type GpToastPosition =
  'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface GpToastMessage {
  id?: string;
  severity?: GpToastSeverity;
  summary?: string;
  detail?: string;
  life?: number;
  sticky?: boolean;
  closable?: boolean;
  data?: any;
}
