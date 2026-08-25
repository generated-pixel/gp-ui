import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GpIconComponent } from '../../icons/icon.component';
import { GpConfirmationService } from '../../services/confirmation.service';
import { GpConfirmation } from '../../services/confirmation.interface';
import { GpDialogComponent } from './dialog.component';
import { GpButtonComponent } from '../button/button.component';

@Component({
  selector: 'gp-confirm-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpDialogComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <gp-dialog
      [header]="confirmation()?.header || header"
      [visibleProp]="visible()"
      [width]="width"
      (visibleChange)="onVisibleChange($event)"
    >
      <div class="gp-confirm-dialog-body">
        @if (confirmation()?.icon || icon) {
          <gp-icon
            [name]="confirmation()?.icon || icon"
            size="2em"
            class="gp-confirm-dialog-icon"
          />
        }
        <span class="gp-confirm-dialog-message">{{ confirmation()?.message || message }}</span>
      </div>

      <div footer class="gp-confirm-dialog-footer">
        @if (confirmation()?.rejectVisible !== false) {
          <gp-button
            [label]="confirmation()?.rejectLabel || rejectLabel"
            [icon]="confirmation()?.rejectIcon || 'times'"
            variant="outlined"
            severity="secondary"
            (onClickEvent)="reject()"
          />
        }
        @if (confirmation()?.acceptVisible !== false) {
          <gp-button
            [label]="confirmation()?.acceptLabel || acceptLabel"
            [icon]="confirmation()?.acceptIcon || 'check'"
            severity="primary"
            (onClickEvent)="accept()"
          />
        }
      </div>
    </gp-dialog>
  `,
  styles: [`
    .gp-confirm-dialog-body {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .gp-confirm-dialog-icon {
      color: var(--gp-primary);
      flex-shrink: 0;
    }
    .gp-confirm-dialog-message {
      font-size: var(--gp-font-size-base);
      color: var(--gp-text-color);
    }
    .gp-confirm-dialog-footer {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `]
})
export class GpConfirmDialogComponent implements OnInit, OnDestroy {
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
    this.sub = this.confirmationService.requireConfirmation$.subscribe(conf => {
      this.confirmation.set(conf);
      this.visible.set(true);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public accept(): void {
    const conf = this.confirmation();
    if (conf?.accept) conf.accept();
    this.confirmationService.onAccept();
    this.visible.set(false);
  }

  public reject(): void {
    const conf = this.confirmation();
    if (conf?.reject) conf.reject();
    this.confirmationService.onReject();
    this.visible.set(false);
  }

  public onVisibleChange(val: boolean): void {
    this.visible.set(val);
  }
}
