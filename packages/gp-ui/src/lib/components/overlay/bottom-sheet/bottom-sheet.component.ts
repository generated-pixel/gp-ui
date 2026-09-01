import {
  Component,
  HostListener,
  ElementRef,
  viewChild,
  signal,
  computed,
  input,
  model,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-bottom-sheet',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss'
})
export class GpBottomSheetComponent {
  public visible = model<boolean>(false);
  public title = input<string | undefined>(undefined);
  public showDragHandle = input<boolean>(true);
  public dismissable = input<boolean>(true);
  public closeOnEscape = input<boolean>(true);
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

  @HostListener('window:keydown.escape')
  public handleEscape(): void {
    if (this.visible() && this.closeOnEscape()) {
      this.close();
    }
  }

  public close(): void {
    this.visible.set(false);
    this.dragOffsetY.set(0);
    this.onDismiss.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
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
