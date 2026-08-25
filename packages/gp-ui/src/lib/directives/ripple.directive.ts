import { Directive, ElementRef, HostListener, Input, inject, booleanAttribute } from '@angular/core';
import { GpConfig } from '../config/gp-config.service';

@Directive({
  selector: '[gpRipple]',
  standalone: true
})
export class GpRippleDirective {
  private el = inject(ElementRef);
  private config = inject(GpConfig);

  @Input({ transform: booleanAttribute }) gpRipple: boolean = true;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.config.ripple() || !this.gpRipple) return;

    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ink = document.createElement('span');
    ink.className = 'gp-ink gp-ink-active';
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    ink.style.top = `${y}px`;
    ink.style.left = `${x}px`;

    const pos = window.getComputedStyle(host).position;
    if (pos !== 'relative' && pos !== 'absolute' && pos !== 'fixed') {
      host.style.position = 'relative';
    }
    host.style.overflow = 'hidden';

    host.appendChild(ink);

    setTimeout(() => {
      if (ink.parentNode === host) {
        host.removeChild(ink);
      }
    }, 600);
  }
}
