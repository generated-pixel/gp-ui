import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

export type GpMessageSeverity = 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'contrast';

@Component({
  selector: 'gp-message',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class GpMessageComponent extends GpBaseComponent {
  public severity = input<GpMessageSeverity>('info');
  public text = input<string>('');
  public icon = input<string>('');
  public closable = input<boolean>(false);

  public onClose = output<void>();

  protected visible = signal<boolean>(true);

  protected defaultIcon = computed(() => {
    switch (this.severity()) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'error':
        return 'times-circle';
      default:
        return 'info-circle';
    }
  });

  public close(): void {
    this.visible.set(false);
    this.onClose.emit();
  }
}
