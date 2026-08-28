import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpFocusTrapDirective } from '../../../overlay/focus-trap.directive';
import { GpOverlayBaseComponent } from '../../../base/gp-overlay-base.component';

@Component({
  selector: 'gp-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpFocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class GpDialogComponent extends GpOverlayBaseComponent {
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
