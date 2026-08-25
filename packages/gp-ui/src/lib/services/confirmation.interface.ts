export interface GpConfirmation {
  message?: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptIcon?: string;
  rejectIcon?: string;
  acceptVisible?: boolean;
  rejectVisible?: boolean;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
  accept?: () => void;
  reject?: () => void;
  closeOnAccept?: boolean;
  defaultFocus?: 'accept' | 'reject' | 'none';
}
