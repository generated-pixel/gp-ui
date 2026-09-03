import {
  Directive,
  ElementRef,
  input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  DOCUMENT,
  effect
} from '@angular/core';
import { GpAppendToTarget, GpOverlayPlacement } from './append-to.interface';

@Directive({
  selector: '[gpAppendTo]',
  standalone: true
})
export class GpAppendToDirective implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  /** Target container where this overlay should be appended */
  public gpAppendTo = input<GpAppendToTarget>('body');

  /** Reference to the trigger/connected anchor element for calculating positioning */
  public gpConnectedTo = input<ElementRef | HTMLElement | undefined>(undefined);

  /** Optional override z-index */
  public gpOverlayZIndex = input<number | undefined>(undefined);

  /** Placement direction relative to trigger */
  public gpOverlayPlacement = input<GpOverlayPlacement>('bottom');

  /** Whether the overlay width should match the trigger width */
  public gpOverlayMatchWidth = input<boolean>(false);

  /** Offset distance from trigger in pixels */
  public gpOverlayOffset = input<number>(4);

  private targetContainer: HTMLElement | null = null;
  private isAppended = false;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private rafId: number | null = null;

  constructor() {
    effect(() => {
      const z = this.gpOverlayZIndex();
      if (z !== undefined && this.el.nativeElement) {
        this.el.nativeElement.style.zIndex = String(z);
      }
    });
  }

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    this.mountOverlay();
  }

  public ngOnDestroy(): void {
    this.unmountOverlay();
  }

  private resolveTarget(): HTMLElement | null {
    const target = this.gpAppendTo();
    if (target === 'self') {
      return null;
    }
    if (target === 'body' || !target) {
      return this.document.body;
    }
    if (typeof target === 'string') {
      return (this.document.querySelector(target) as HTMLElement | null) || this.document.body;
    }
    if (target instanceof ElementRef) {
      return target.nativeElement as HTMLElement;
    }
    if (target instanceof HTMLElement) {
      return target;
    }
    return this.document.body;
  }

  private mountOverlay(): void {
    const target = this.resolveTarget();
    const elem = this.el.nativeElement as HTMLElement;

    if (!elem) {
      return;
    }

    if (target) {
      this.targetContainer = target;
      target.appendChild(elem);
      this.isAppended = true;
      elem.style.position = 'absolute';
      elem.style.margin = '0';
      elem.style.boxSizing = 'border-box';

      this.reposition();
      this.rafId = requestAnimationFrame(() => {
        this.reposition();
      });

      // Bind window listeners for positioning sync
      this.scrollListener = () => this.reposition();
      this.resizeListener = () => this.reposition();

      window.addEventListener('scroll', this.scrollListener, true);
      window.addEventListener('resize', this.resizeListener);
    }
  }

  public reposition(): void {
    if (!this.isAppended || !this.el.nativeElement) {
      return;
    }

    const overlay = this.el.nativeElement as HTMLElement;
    const triggerRaw = this.gpConnectedTo();
    if (!triggerRaw) {
      return;
    }

    const trigger = triggerRaw instanceof ElementRef ? triggerRaw.nativeElement : triggerRaw;
    if (!trigger || !(trigger instanceof HTMLElement)) {
      return;
    }

    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const docEl = this.document.documentElement;

    const triggerRect = trigger.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const scrollY = win.pageYOffset || docEl.scrollTop;
    const scrollX = win.pageXOffset || docEl.scrollLeft;

    let targetOffsetX = 0;
    let targetOffsetY = 0;

    if (this.targetContainer && this.targetContainer !== this.document.body) {
      const targetRect = this.targetContainer.getBoundingClientRect();
      targetOffsetX = targetRect.left + (win.pageXOffset || docEl.scrollLeft);
      targetOffsetY = targetRect.top + (win.pageYOffset || docEl.scrollTop);
    }

    const offset = this.gpOverlayOffset();
    const placement = this.gpOverlayPlacement();
    const viewportWidth = win.innerWidth || docEl.clientWidth;
    const viewportHeight = win.innerHeight || docEl.clientHeight;

    if (this.gpOverlayMatchWidth()) {
      overlay.style.width = `${Math.round(triggerRect.width)}px`;
      overlay.style.minWidth = `${Math.round(triggerRect.width)}px`;
    } else {
      overlay.style.width = 'max-content';
      overlay.style.maxWidth = 'min(calc(100vw - 24px), 36rem)';
    }

    const overlayWidth = overlayRect.width || (this.gpOverlayMatchWidth() ? triggerRect.width : 200);
    const overlayHeight = overlayRect.height || 100;

    const spaceBelow = viewportHeight - triggerRect.bottom - offset - 16;
    const spaceAbove = triggerRect.top - offset - 16;

    let isFlipped = false;
    let top = 0;
    let left = 0;

    if (placement === 'bottom' || placement === 'auto') {
      // Flip up if bottom overflows and top has more room
      if (overlayHeight > spaceBelow && spaceAbove > spaceBelow) {
        isFlipped = true;
        top = triggerRect.top + scrollY - overlayHeight - offset - targetOffsetY;
      } else {
        top = triggerRect.bottom + scrollY + offset - targetOffsetY;
      }
      left = triggerRect.left + scrollX - targetOffsetX;
    } else if (placement === 'top') {
      if (overlayHeight > spaceAbove && spaceBelow > spaceAbove) {
        top = triggerRect.bottom + scrollY + offset - targetOffsetY;
      } else {
        isFlipped = true;
        top = triggerRect.top + scrollY - overlayHeight - offset - targetOffsetY;
      }
      left = triggerRect.left + scrollX - targetOffsetX;
    } else if (placement === 'left') {
      top = triggerRect.top + scrollY - targetOffsetY;
      left = triggerRect.left + scrollX - overlayWidth - offset - targetOffsetX;
      if (left < scrollX + 12 && viewportWidth - triggerRect.right - offset > triggerRect.left - offset) {
        left = triggerRect.right + scrollX + offset - targetOffsetX;
      }
    } else if (placement === 'right') {
      top = triggerRect.top + scrollY - targetOffsetY;
      left = triggerRect.right + scrollX + offset - targetOffsetX;
      if (
        left + overlayWidth > scrollX + viewportWidth - 12 &&
        triggerRect.left - offset > viewportWidth - triggerRect.right - offset
      ) {
        left = triggerRect.left + scrollX - overlayWidth - offset - targetOffsetX;
      }
    }

    // Dynamic vertical constraint: ensure dropdowns are always visible on screen
    const availableHeight = Math.max(120, isFlipped ? spaceAbove : spaceBelow);
    if (overlayHeight > availableHeight || overlayRect.bottom > viewportHeight - 12) {
      overlay.style.maxHeight = `${Math.floor(availableHeight)}px`;
      overlay.style.overflowY = 'auto';
      if (isFlipped) {
        const constrainedHeight = Math.min(overlayHeight, availableHeight);
        top = triggerRect.top + scrollY - constrainedHeight - offset - targetOffsetY;
      }
    }

    // Dynamic horizontal boundary containment
    const maxAllowedWidth = Math.max(160, viewportWidth - 24);
    overlay.style.maxWidth = `min(${Math.floor(maxAllowedWidth)}px, 95vw)`;

    if (left + overlayWidth > scrollX + viewportWidth - 12) {
      left = Math.max(scrollX + 12, scrollX + viewportWidth - overlayWidth - 12);
    }
    if (left < scrollX + 12) {
      left = scrollX + 12;
    }

    overlay.style.top = `${Math.round(top)}px`;
    overlay.style.left = `${Math.round(left)}px`;
  }

  private unmountOverlay(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }

    if (this.isAppended && this.el.nativeElement && this.el.nativeElement.parentNode) {
      this.el.nativeElement.parentNode.removeChild(this.el.nativeElement);
      this.isAppended = false;
    }
  }
}
