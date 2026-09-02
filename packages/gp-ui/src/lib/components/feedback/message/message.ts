import { GpBase } from '../../../base/gp-base';
import { Component, input, output, computed, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';

import { GpIcon } from '../../../icons/icon';

export type GpMessageSeverity = 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'contrast';

@Component({
  selector: 'gp-message',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message.html',
  styleUrl: './message.scss'
})
export class GpMessage extends GpBase {
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
