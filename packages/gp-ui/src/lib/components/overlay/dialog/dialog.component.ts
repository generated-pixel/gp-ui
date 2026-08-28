import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { ZIndexService } from '../../../overlay/z-index.service';
import { GpFocusTrapDirective } from '../../../overlay/focus-trap.directive';

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

  public header = input<string>('');
  public width = input<string>('30rem');
  public maxWidth = input<string>('90vw');
  public modal = input<boolean>(true);
  public closable = input<boolean>(true);
  public maximizable = input<boolean>(false);
  public closeOnEscape = input<boolean>(true);
  public dismissableMask = input<boolean>(false);
  public showFooter = input<boolean>(true);
  public visibleInput = input<boolean | undefined>(undefined, { alias: 'visibleProp' });
  public visibleBinding = input<boolean | undefined>(undefined, { alias: 'visible' });

  public visibleChange = output<boolean>();
  public onShow = output<void>();
  public onHide = output<void>();

  protected visible = signal<boolean>(false);
  protected maximized = signal<boolean>(false);
  protected zIndex = signal<number>(1100);
  protected headerId = `gp_dialog_header_${Math.random().toString(36).substring(2, 7)}`;

  constructor() {
    super();
    effect(() => {
      const v = this.visibleInput() ?? this.visibleBinding();
      if (v !== undefined && v !== this.visible()) {
        if (v) {
          this.show();
        } else {
          this.close();
        }
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible() && this.closeOnEscape() && this.closable()) {
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
    this.maximized.update((v) => !v);
  }

  public onMaskClick(event: MouseEvent): void {
    if (this.dismissableMask() && this.closable()) {
      this.close();
    }
  }
}
