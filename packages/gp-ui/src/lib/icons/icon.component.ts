import { Component, input, computed, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GpIconRegistry } from './icon-registry.service';

@Component({
  selector: 'gp-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="gp-icon"
      [class.gp-icon-spin]="spin()"
      [style.width]="size()"
      [style.height]="size()"
      [style.color]="color() || null"
      [style.transform]="rotate() ? 'rotate(' + rotate() + 'deg)' : null"
      [attr.aria-hidden]="ariaHidden()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.role]="ariaLabel() ? 'img' : 'presentation'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="gp-icon-svg"
        [innerHTML]="safeSvg()"
      ></svg>
    </span>
  `,
  styles: [
    `
      .gp-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        vertical-align: -0.125em;
        flex-shrink: 0;
      }
      .gp-icon-svg {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
      .gp-icon-spin {
        animation: gp-icon-spin 1.5s infinite linear;
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

  public name = input<string>('');
  public size = input<string>('1em');
  public color = input<string>('');
  public spin = input<boolean>(false);
  public rotate = input<number>(0);
  public ariaHidden = input<boolean>(true);
  public ariaLabel = input<string>('');

  protected safeSvg = computed<SafeHtml>(() => {
    const raw = this.registry.get(this.name()) || '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });
}
