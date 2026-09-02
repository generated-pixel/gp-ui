import { Component, input, computed, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GpIconRegistry } from './icon-registry.service';

@Component({
  selector: 'gp-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './icon.html',
  styleUrl: './icon.scss'
})
export class GpIcon {
  private registry = inject(GpIconRegistry);
  private sanitizer = inject(DomSanitizer);

  public name = input<string>('');
  public size = input<string | number>('1em');
  public color = input<string>('');
  public spin = input<boolean>(false);
  public rotate = input<number>(0);
  public ariaHidden = input<boolean | string>(true);
  public ariaLabel = input<string>('');

  protected resolvedSize = computed(() => {
    const s = this.size();
    if (typeof s === 'number') {
      return `${s}px`;
    }
    return s;
  });

  protected resolvedTransform = computed(() => {
    const r = this.rotate();
    return r ? `rotate(${r}deg)` : null;
  });

  protected safeSvg = computed<SafeHtml>(() => {
    const raw = this.registry.getIcon(this.name()) || '';
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  });
}
