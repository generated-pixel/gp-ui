import { Component, Input, computed, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GpIconRegistry } from './icon-registry.service';

@Component({
  selector: 'gp-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [style.width]="resolvedSize()"
      [style.height]="resolvedSize()"
      [style.color]="color || null"
      [style.transform]="resolvedTransform()"
      [class.gp-icon-spin]="spin"
      [attr.aria-hidden]="ariaHidden !== false"
      [attr.aria-label]="ariaLabel || null"
      class="gp-icon"
      [innerHTML]="safeSvg()"
    ></svg>
  `,
  styles: [
    `
      .gp-icon {
        display: inline-flex;
        align-self: center;
        vertical-align: middle;
        flex-shrink: 0;
        transition: transform 0.2s ease;
      }
      .gp-icon-spin {
        animation: gp-icon-spin 1s infinite linear;
      }
      @keyframes gp-icon-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `
  ]
})
export class GpIconComponent {
  private registry = inject(GpIconRegistry);
  private sanitizer = inject(DomSanitizer);

  @Input() name = '';
  @Input() size: string | number = '1em';
  @Input() color = '';
  @Input() spin = false;
  @Input() rotate = 0;
  @Input() ariaHidden: boolean | string = true;
  @Input() ariaLabel = '';

  protected resolvedSize = computed(() => {
    if (typeof this.size === 'number') {
      return `${this.size}px`;
    }
    return this.size;
  });

  protected resolvedTransform = computed(() => {
    return this.rotate ? `rotate(${this.rotate}deg)` : null;
  });

  protected safeSvg = computed<SafeHtml>(() => {
    const raw = this.registry.getIcon(this.name) || '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });
}
