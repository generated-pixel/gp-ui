import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpConfirmationService } from '../../../services/confirmation.service';
import { GpConfirmation } from '../../../services/confirmation.interface';
import { GpDialogComponent } from '../dialog/dialog.component';
import { GpButtonComponent } from '../../button/button/button.component';

@Component({
  selector: 'gp-confirm-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpDialogComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class GpConfirmDialogComponent extends GpBaseComponent implements OnInit, OnDestroy {
  private confirmationService = inject(GpConfirmationService);

  @Input() header = 'Confirmation';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() icon = 'info-circle';
  @Input() acceptLabel = 'Yes';
  @Input() rejectLabel = 'No';
  @Input() width = '26rem';

  protected visible = signal<boolean>(false);
  protected confirmation = signal<GpConfirmation | null>(null);

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.confirmationService.requireConfirmation$.subscribe((conf) => {
      this.confirmation.set(conf);
      this.visible.set(true);
    });
  }

  ngOnDestroy(): void {
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
