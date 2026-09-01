import { Component, input, computed, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GpIconRegistry } from './icon-registry.service';

@Component({
  selector: 'gp-icon',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
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
