import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { GpIcon } from '../../../icons/icon';
import { GpFocusTrapDirective } from '../../../overlay/focus-trap.directive';
import { GpOverlayBase } from '../../../base/gp-overlay-base';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

@Component({
  selector: 'gp-dialog',
  standalone: true,
  imports: [GpIcon, GpFocusTrapDirective, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class GpDialog extends GpOverlayBase {
  public width = input<string>('30rem');
  public maxWidth = input<string>('90vw');
  public maximizable = input<boolean>(false);
  public showFooter = input<boolean>(true);

  public maximized = signal<boolean>(false);
  public headerId = `gp_dialog_header_${Math.random().toString(36).substring(2, 7)}`;

  public override close(): void {
    super.close();
    this.maximized.set(false);
  }

  public toggleMaximize(): void {
    this.maximized.update((v) => !v);
  }
}
