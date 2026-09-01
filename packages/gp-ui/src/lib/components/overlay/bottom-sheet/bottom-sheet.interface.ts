export type GpBottomSheetSnapPoint = 'collapsed' | 'half' | 'full';

export interface GpBottomSheetConfig {
  title?: string;
  dismissable?: boolean;
  showDragHandle?: boolean;
  maxHeight?: string;
  closeOnEscape?: boolean;
  ariaLabel?: string;
}
