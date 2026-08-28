import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { ZIndexService } from '../../../overlay/z-index.service';

@Component({
  selector: 'gp-image',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class GpImageComponent extends GpBaseComponent {
  private zIndexService = inject(ZIndexService);

  @Input() src = '';
  @Input() alt = '';
  @Input() width = '';
  @Input() height = '';
  @Input() preview = false;
  @Input() previewSrc = '';

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
    this.scale.update(s => Math.min(3, s + 0.25));
  }

  public zoomOut(): void {
    this.scale.update(s => Math.max(0.5, s - 0.25));
  }

  public rotateRight(): void {
    this.rotate.update(r => (r + 90) % 360);
  }
}
