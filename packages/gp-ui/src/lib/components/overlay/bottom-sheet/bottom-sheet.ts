import {
  Component,
  ElementRef,
  viewChild,
  signal,
  computed,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { GpOverlayBase } from '../../../base/gp-overlay-base';
import { GpIcon } from '../../../icons/icon';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';

@Component({
  selector: 'gp-bottom-sheet',
  standalone: true,
  imports: [GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.scss'
})
export class GpBottomSheet extends GpOverlayBase {
  public title = input<string | undefined>(undefined);
  public showDragHandle = input<boolean>(true);
  public dismissable = input<boolean>(true);
  public maxHeight = input<string>('80vh');

  public onDismiss = output<void>();

  public sheetContainer = viewChild<ElementRef<HTMLElement>>('sheetContainer');

  public isDragging = signal<boolean>(false);
  public dragOffsetY = signal<number>(0);
  private startY = 0;

  public containerTransform = computed(() => {
    const offset = this.dragOffsetY();
    return offset > 0 ? `translateY(${offset}px)` : 'translateY(0)';
  });

  public override close(): void {
    super.close();
    this.dragOffsetY.set(0);
    this.onDismiss.emit();
  }

  public onBackdropClick(event?: MouseEvent): void {
    if (this.dismissable()) {
      this.close();
    }
  }

  public onTouchStart(event: TouchEvent): void {
    this.isDragging.set(true);
    this.startY = event.touches[0].clientY;
  }

  public onTouchMove(event: TouchEvent): void {
    if (!this.isDragging()) {
      return;
    }
    const currentY = event.touches[0].clientY;
    const delta = currentY - this.startY;
    if (delta > 0) {
      this.dragOffsetY.set(delta);
    }
  }

  public onTouchEnd(): void {
    this.isDragging.set(false);
    if (this.dragOffsetY() > 120) {
      this.close();
    } else {
      this.dragOffsetY.set(0);
    }
  }
}
