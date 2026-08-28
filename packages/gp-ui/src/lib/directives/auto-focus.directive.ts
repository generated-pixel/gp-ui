import { Directive, ElementRef, input, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[gpAutoFocus]',
  standalone: true
})
export class GpAutoFocusDirective implements OnInit {
  private el = inject(ElementRef);

  public gpAutoFocus = input<boolean>(true);

  ngOnInit(): void {
    if (this.gpAutoFocus()) {
      setTimeout(() => {
        const host = this.el.nativeElement;
        if (typeof host.focus === 'function') {
          host.focus();
        } else {
          const focusable = host.querySelector('input, select, textarea, button');
          if (focusable && typeof focusable.focus === 'function') {
            focusable.focus();
          }
        }
      }, 50);
    }
  }
}
