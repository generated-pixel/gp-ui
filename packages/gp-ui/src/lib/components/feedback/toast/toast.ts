import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { GpIcon } from '../../../icons/icon';
import { GpToastService } from '../../../services/toast.service';
import { GpToastMessage, GpToastPosition } from '../../../services/toast.interface';
import { ZIndexService } from '../../../overlay/z-index.service';

@Component({
  selector: 'gp-toast',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class GpToast extends GpBase {
  private toastService = inject(GpToastService);
  private zIndexService = inject(ZIndexService);

  public position = input<GpToastPosition>('top-right');

  protected messages = signal<GpToastMessage[]>([]);
  protected zIndex = signal<number>(1200);

  private msgSub?: Subscription;
  private clearSub?: Subscription;

  override onInit(): void {
    this.zIndex.set(this.zIndexService.get('toast'));
    this.msgSub = this.toastService.message$.subscribe((msg) => {
      this.addMessage(msg);
    });
    this.clearSub = this.toastService.clear$.subscribe(() => {
      this.messages.set([]);
    });
  }

  override onDestroy(): void {
    this.msgSub?.unsubscribe();
    this.clearSub?.unsubscribe();
  }

  public addMessage(msg: GpToastMessage): void {
    this.messages.update((prev) => [...prev, msg]);
    if (!msg.sticky) {
      setTimeout(() => {
        this.removeMessage(msg);
      }, msg.life || 3500);
    }
  }

  public removeMessage(msg: GpToastMessage): void {
    this.messages.update((prev) => prev.filter((m) => m.id !== msg.id));
  }

  public getSeverityIcon(severity?: string): string {
    switch (severity) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'error':
        return 'times-circle';
      default:
        return 'info-circle';
    }
  }
}
