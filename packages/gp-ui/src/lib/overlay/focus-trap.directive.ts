import { Directive, ElementRef, HostListener, Input, inject, booleanAttribute } from '@angular/core';
import { DomHandler } from '../utils/dom-handler';

@Directive({
  selector: '[gpFocusTrap]',
  standalone: true
})
export class GpFocusTrapDirective {
  private el = inject(ElementRef);

  @Input({ transform: booleanAttribute }) gpFocusTrap: boolean = true;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.gpFocusTrap || event.key !== 'Tab') {
      return;
    }

    const focusables = DomHandler.getFocusableElements(this.el.nativeElement);
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first || !this.el.nativeElement.contains(document.activeElement)) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === last || !this.el.nativeElement.contains(document.activeElement)) {
        first.focus();
        event.preventDefault();
      }
    }
  }
}
