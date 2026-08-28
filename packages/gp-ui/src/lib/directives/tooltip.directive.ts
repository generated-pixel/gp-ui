import { Directive, ElementRef, HostListener, input, OnDestroy, inject } from '@angular/core';
import { ZIndexService } from '../overlay/z-index.service';

export type GpTooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[gpTooltip]',
  standalone: true
})
export class GpTooltipDirective implements OnDestroy {
  private el = inject(ElementRef);
  private zIndexService = inject(ZIndexService);

  public gpTooltip = input<string>('');
  public tooltipPosition = input<GpTooltipPosition>('top');
  public tooltipDisabled = input<boolean>(false);
  public showDelay = input<number>(150);
  public hideDelay = input<number>(100);

  private tooltipEl: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.tooltipDisabled() || !this.gpTooltip()) {
      return;
    }
    clearTimeout(this.hideTimeout);
    this.showTimeout = setTimeout(() => this.show(), this.showDelay());
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(() => this.hide(), this.hideDelay());
  }

  @HostListener('focus')
  onFocus(): void {
    this.onMouseEnter();
  }

  @HostListener('blur')
  onBlur(): void {
    this.onMouseLeave();
  }

  private show(): void {
    if (this.tooltipEl || !this.gpTooltip()) {
      return;
    }

    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = `gp-tooltip gp-tooltip-${this.tooltipPosition()}`;
    this.tooltipEl.textContent = this.gpTooltip();
    this.tooltipEl.setAttribute('role', 'tooltip');
    this.tooltipEl.style.zIndex = `${this.zIndexService.get('tooltip')}`;
    this.tooltipEl.style.position = 'absolute';
    this.tooltipEl.style.pointerEvents = 'none';

    document.body.appendChild(this.tooltipEl);
    this.align();
  }

  private align(): void {
    if (!this.tooltipEl) {
      return;
    }
    const host = this.el.nativeElement as HTMLElement;
    const hostRect = host.getBoundingClientRect();
    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition()) {
      case 'top':
        top = hostRect.top + scrollY - tooltipRect.height - 6;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = hostRect.bottom + scrollY + 6;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - 6;
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX + 6;
        break;
    }

    this.tooltipEl.style.top = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;
  }

  private hide(): void {
    if (this.tooltipEl && this.tooltipEl.parentNode) {
      this.tooltipEl.parentNode.removeChild(this.tooltipEl);
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
    this.hide();
  }
}
