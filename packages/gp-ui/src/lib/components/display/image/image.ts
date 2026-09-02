import { GpBase } from '../../../base/gp-base';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';

import { GpIcon } from '../../../icons/icon';
import { ZIndexService } from '../../../overlay/z-index.service';

@Component({
  selector: 'gp-image',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './image.html',
  styleUrl: './image.scss'
})
export class GpImage extends GpBase {
  private zIndexService = inject(ZIndexService);

  public src = input<string>('');
  public alt = input<string>('');
  public width = input<string>('');
  public height = input<string>('');
  public preview = input<boolean>(false);
  public previewSrc = input<string>('');

  protected previewVisible = signal<boolean>(false);
  protected scale = signal<number>(1);
  protected rotate = signal<number>(0);
  protected zIndex = signal<number>(1300);

  public showPreview(): void {
    this.zIndex.set(this.zIndexService.get('modal'));
    this.scale.set(1);
    this.rotate.set(0);
    this.previewVisible.set(true);
  }

  public hidePreview(): void {
    this.previewVisible.set(false);
  }

  public zoomIn(): void {
    this.scale.update((s) => Math.min(3, s + 0.25));
  }

  public zoomOut(): void {
    this.scale.update((s) => Math.max(0.5, s - 0.25));
  }

  public rotateRight(): void {
    this.rotate.update((r) => (r + 90) % 360);
  }
}
