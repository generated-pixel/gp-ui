import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { GpIcon } from '../../../icons/icon';
import { GpConfirmationService } from '../../../services/confirmation.service';
import { GpConfirmation } from '../../../services/confirmation.interface';
import { GpDialog } from '../dialog/dialog';
import { GpButton } from '../../button/button/button';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-confirm-dialog',
  standalone: true,
  imports: [GpIcon, GpDialog, GpButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class GpConfirmDialog extends GpBase {
  private confirmationService = inject(GpConfirmationService);

  public appendTo = input<GpAppendToTarget>('body');
  public header = input<string>('Confirmation');
  public message = input<string>('Are you sure you want to proceed?');
  public icon = input<string>('info-circle');
  public acceptLabel = input<string>('Yes');
  public rejectLabel = input<string>('No');
  public width = input<string>('26rem');

  protected visible = signal<boolean>(false);
  protected confirmation = signal<GpConfirmation | null>(null);

  private sub?: Subscription;

  override onInit(): void {
    this.sub = this.confirmationService.requireConfirmation$.subscribe((conf) => {
      this.confirmation.set(conf);
      this.visible.set(true);
    });
  }

  override onDestroy(): void {
    this.sub?.unsubscribe();
  }

  public accept(): void {
    const conf = this.confirmation();
    if (conf?.accept) {
      conf.accept();
    }
    this.confirmationService.onAccept();
    this.visible.set(false);
  }

  public reject(): void {
    const conf = this.confirmation();
    if (conf?.reject) {
      conf.reject();
    }
    this.confirmationService.onReject();
    this.visible.set(false);
  }

  public onVisibleChange(val: boolean): void {
    this.visible.set(val);
  }
}
