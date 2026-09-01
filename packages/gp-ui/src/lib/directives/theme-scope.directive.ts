import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[gpThemeScope]',
  standalone: true
})
export class GpThemeScopeDirective {
  public themeName = input<string | undefined>(undefined, { alias: 'gpThemeScope' });
  public mode = input<'light' | 'dark' | undefined>(undefined);

  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const theme = this.themeName();
      const currentMode = this.mode();
      const nativeEl = this.el.nativeElement;

      if (theme) {
        this.renderer.setAttribute(nativeEl, 'data-gp-theme', theme);
      } else {
        this.renderer.removeAttribute(nativeEl, 'data-gp-theme');
      }

      if (currentMode) {
        this.renderer.setAttribute(nativeEl, 'data-gp-mode', currentMode);
        if (currentMode === 'dark') {
          this.renderer.addClass(nativeEl, 'gp-dark');
          this.renderer.removeClass(nativeEl, 'gp-light');
        } else {
          this.renderer.addClass(nativeEl, 'gp-light');
          this.renderer.removeClass(nativeEl, 'gp-dark');
        }
      } else {
        this.renderer.removeAttribute(nativeEl, 'data-gp-mode');
        this.renderer.removeClass(nativeEl, 'gp-dark');
        this.renderer.removeClass(nativeEl, 'gp-light');
      }
    });
  }
}
