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
  template: `
    @if (visible()) {
      <div
        class="gp-dialog-mask"
        [class.gp-dialog-mask-modal]="modal"
        [style.z-index]="zIndex()"
        (click)="onMaskClick($event)"
      >
        <div
          class="gp-dialog"
          [class.gp-dialog-maximized]="maximized()"
          [style.width]="width"
          [style.max-width]="maxWidth"
          role="dialog"
          [attr.aria-modal]="modal"
          [attr.aria-labelledby]="headerId"
          gpFocusTrap
          (click)="$event.stopPropagation()"
        >
          <div class="gp-dialog-header">
            <span [id]="headerId" class="gp-dialog-title">{{ header }}</span>
            <div class="gp-dialog-header-icons">
              @if (maximizable) {
                <button
                  type="button"
                  class="gp-dialog-header-icon"
                  (click)="toggleMaximize()"
                  [attr.aria-label]="maximized() ? 'Restore dialog' : 'Maximize dialog'"
                >
                  <gp-icon [name]="maximized() ? 'compress' : 'expand'" size="0.85em" />
                </button>
              }
              @if (closable) {
                <button
                  type="button"
                  class="gp-dialog-header-icon"
                  (click)="close()"
                  aria-label="Close dialog"
                >
                  <gp-icon name="times" size="0.85em" />
                </button>
              }
            </div>
          </div>

          <div class="gp-dialog-content">
            <ng-content />
          </div>

          @if (showFooter) {
            <div class="gp-dialog-footer">
              <ng-content select="[footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .gp-dialog-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gp-mask-bg);
      animation: gp-fade-in 0.15s ease-out;
    }
    .gp-dialog {
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-md);
      box-shadow: var(--gp-shadow-xl);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      animation: gp-scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
    }
    .gp-dialog-maximized {
      width: 100vw !important;
      height: 100vh !important;
      max-height: 100vh !important;
      max-width: 100vw !important;
      border-radius: 0;
    }
    .gp-dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-dialog-title {
      font-weight: 700;
      font-size: var(--gp-font-size-lg);
      color: var(--gp-text-color);
    }
    .gp-dialog-header-icons {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-dialog-header-icon {
      background: none;
      border: none;
      color: var(--gp-text-color-secondary);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background var(--gp-transition-duration);
    }
    .gp-dialog-header-icon:hover {
      background: var(--gp-surface-hover);
      color: var(--gp-text-color);
    }
    .gp-dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
      color: var(--gp-text-color);
      line-height: 1.6;
    }
    .gp-dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--gp-surface-divider);
    }
  `]
})
export class GpDialogComponent {
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
