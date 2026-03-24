import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { GpIconName } from '../../icons/gp-icon-names';
import { GpIconService } from '../../icons/gp-icon.service';

/**
 * Renders a named SVG icon from the gp-analytics icon set.
 *
 * ```html
 * <gp-icon name="artifact-tabular" />
 * <gp-icon name="graph-pie" [size]="20" label="Pie chart" />
 * ```
 *
 * - The icon inherits its colour from `color` / `currentColor`, so it works
 *   naturally alongside text and respects the CSS variable theme.
 * - `size` sets both `width` and `height` on the SVG element (default: 24).
 * - Supply `label` to expose a visible accessible name via `aria-label`.
 *   Without a label the SVG is marked `aria-hidden="true"` so screen readers
 *   skip it (the surrounding element should provide context instead).
 */
@Component({
  selector: 'gp-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      [attr.width]="size()"
      [attr.height]="size()"
      [attr.aria-label]="label() ?? null"
      [attr.aria-hidden]="label() ? null : 'true'"
      [attr.role]="label() ? 'img' : null"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="gp-icon"
      [innerHTML]="safeSvg()"
    ></svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
        flex-shrink: 0;
      }
      .gp-icon {
        display: block;
        overflow: visible;
      }
    `,
  ],
})
export class GpIcon {
  /** Name of the icon to display. Must be a value from {@link GpIconName}. */
  readonly name = input.required<GpIconName>();

  /**
   * Width and height of the rendered SVG in pixels (or any CSS length string).
   * Defaults to 24.
   */
  readonly size = input<number | string>(24);

  /**
   * Accessible label for the icon.  When provided the SVG receives
   * `role="img"` and `aria-label`.  When omitted the SVG is hidden from
   * assistive technology (`aria-hidden="true"`).
   */
  readonly label = input<string | undefined>(undefined);

  private readonly iconService = inject(GpIconService);

  protected readonly safeSvg = computed<SafeHtml>(() => this.iconService.getSvg(this.name()));
}
