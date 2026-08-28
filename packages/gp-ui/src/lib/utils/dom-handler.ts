export class DomHandler {
  public static addClass(element: HTMLElement, className: string): void {
    if (element && className) {
      className.split(' ').forEach((cls) => {
        if (cls) {
          element.classList.add(cls);
        }
      });
    }
  }

  public static removeClass(element: HTMLElement, className: string): void {
    if (element && className) {
      className.split(' ').forEach((cls) => {
        if (cls) {
          element.classList.remove(cls);
        }
      });
    }
  }

  public static getOffset(el: HTMLElement): { top: number; left: number } {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
      left: rect.left + (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0)
    };
  }

  public static getViewport(): { width: number; height: number } {
    const win = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const w = win.innerWidth || e.clientWidth || g.clientWidth;
    const h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  public static alignOverlay(
    overlay: HTMLElement,
    target: HTMLElement,
    appendTo = 'body',
    position: 'bottom' | 'top' | 'left' | 'right' = 'bottom'
  ): void {
    if (!overlay || !target) {
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const viewport = DomHandler.getViewport();

    let top = 0;
    let left = 0;

    if (position === 'bottom') {
      top = targetRect.bottom + 4;
      left = targetRect.left;

      // Flip to top if overflowing viewport bottom
      if (top + overlayRect.height > viewport.height && targetRect.top > overlayRect.height) {
        top = targetRect.top - overlayRect.height - 4;
      }
    } else if (position === 'top') {
      top = targetRect.top - overlayRect.height - 4;
      left = targetRect.left;

      // Flip to bottom if overflowing viewport top
      if (top < 0 && targetRect.bottom + overlayRect.height <= viewport.height) {
        top = targetRect.bottom + 4;
      }
    } else if (position === 'right') {
      top = targetRect.top;
      left = targetRect.right + 4;
    } else if (position === 'left') {
      top = targetRect.top;
      left = targetRect.left - overlayRect.width - 4;
    }

    // Horizontal containment
    if (left + overlayRect.width > viewport.width) {
      left = Math.max(8, viewport.width - overlayRect.width - 8);
    }
    if (left < 0) {
      left = 8;
    }

    if (appendTo === 'body') {
      top += window.pageYOffset || document.documentElement.scrollTop;
      left += window.pageXOffset || document.documentElement.scrollLeft;
    }

    overlay.style.position = 'absolute';
    overlay.style.top = `${top}px`;
    overlay.style.left = `${left}px`;
    overlay.style.minWidth = `${targetRect.width}px`;
  }

  public static getFocusableElements(element: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
      (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
    );
  }
}
