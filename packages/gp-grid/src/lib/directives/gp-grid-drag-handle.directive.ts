import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Directive applied to any element inside a gp-grid-widget to act as the primary drag handle.
 */
@Directive({
  selector: '[gpGridDragHandle]',
  standalone: true,
  host: {
    class: 'gp-grid-drag-handle',
    '[style.touch-action]': '"none"',
    '[style.cursor]': '"grab"'
  }
})
export class GpGridDragHandleDirective {
  public readonly elementRef = inject(ElementRef);
}
