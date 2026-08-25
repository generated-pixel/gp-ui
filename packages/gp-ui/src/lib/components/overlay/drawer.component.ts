import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { ZIndexService } from '../../overlay/z-index.service';

export type GpDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-drawer',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div
        class="gp-drawer-mask"
        [class.gp-drawer-mask-modal]="modal"
        [style.z-index]="zIndex()"
        (click)="onMaskClick()"
      >
        <div
          class="gp-drawer"
          [class]="'gp-drawer-' + position"
          (click)="$event.stopPropagation()"
          role="dialog"
          [attr.aria-modal]="modal"
        >
          <div class="gp-drawer-header">
            <span class="gp-drawer-title">{{ header }}</span>
            <button
              type="button"
              class="gp-dialog-header-icon"
              (click)="close()"
              aria-label="Close drawer"
            >
              <gp-icon name="times" size="0.85em" />
            </button>
          </div>

          <div class="gp-drawer-content">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .gp-drawer-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--gp-mask-bg);
      animation: gp-fade-in 0.15s ease-out;
    }
    .gp-drawer {
      position: absolute;
      background: var(--gp-surface-overlay);
      box-shadow: var(--gp-shadow-xl);
      display: flex;
      flex-direction: column;
      outline: none;
    }
    .gp-drawer-left {
      top: 0;
      left: 0;
      height: 100%;
      width: 22rem;
      max-width: 90vw;
    }
    .gp-drawer-right {
      top: 0;
      right: 0;
      height: 100%;
      width: 22rem;
      max-width: 90vw;
    }
    .gp-drawer-top {
      top: 0;
      left: 0;
      width: 100%;
      height: 15rem;
    }
    .gp-drawer-bottom {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 15rem;
    }
    .gp-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-drawer-title {
      font-weight: 700;
      font-size: var(--gp-font-size-base);
    }
    .gp-drawer-content {
      padding: 1.25rem;
      overflow-y: auto;
      flex: 1;
    }
  `]
})
export class GpDrawerComponent {
  private zIndexService = inject(ZIndexService);

  @Input() header = '';
  @Input() position: GpDrawerPosition = 'left';
  @Input() modal = true;
  @Input() dismissable = true;

  @Output() visibleChange = new EventEmitter<boolean>();

  protected visible = signal<boolean>(false);
  protected zIndex = signal<number>(1100);

  @Input() set visibleProp(val: boolean) {
    if (val !== this.visible()) {
      if (val) this.show();
      else this.close();
    }
  }

  public show(): void {
    this.zIndex.set(this.zIndexService.get('modal'));
    this.visible.set(true);
    this.visibleChange.emit(true);
  }

  public close(): void {
    this.visible.set(false);
    this.visibleChange.emit(false);
  }

  public onMaskClick(): void {
    if (this.dismissable) {
      this.close();
    }
  }
}
