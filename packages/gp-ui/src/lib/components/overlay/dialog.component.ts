import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { ZIndexService } from '../../overlay/z-index.service';
import { GpFocusTrapDirective } from '../../overlay/focus-trap.directive';

@Component({
  selector: 'gp-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpFocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class GpDialogComponent extends GpBaseComponent {
  private zIndexService = inject(ZIndexService);

  @Input() header = '';
  @Input() width = '30rem';
  @Input() maxWidth = '90vw';
  @Input() modal = true;
  @Input() closable = true;
  @Input() maximizable = false;
  @Input() closeOnEscape = true;
  @Input() dismissableMask = false;
  @Input() showFooter = true;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  protected visible = signal<boolean>(false);
  protected maximized = signal<boolean>(false);
  protected zIndex = signal<number>(1100);
  protected headerId = `gp_dialog_header_${Math.random().toString(36).substring(2, 7)}`;

  @Input() set visibleProp(val: boolean) {
    if (val !== this.visible()) {
      if (val) this.show();
      else this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible() && this.closeOnEscape && this.closable) {
      this.close();
    }
  }

  public show(): void {
    this.zIndex.set(this.zIndexService.get('modal'));
    this.visible.set(true);
    this.visibleChange.emit(true);
    this.onShow.emit();
  }

  public close(): void {
    this.visible.set(false);
    this.maximized.set(false);
    this.visibleChange.emit(false);
    this.onHide.emit();
  }

  public toggleMaximize(): void {
    this.maximized.update(v => !v);
  }

  public onMaskClick(event: MouseEvent): void {
    if (this.dismissableMask && this.closable) {
      this.close();
    }
  }
}
