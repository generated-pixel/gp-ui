import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { ZIndexService } from '../../overlay/z-index.service';

@Component({
  selector: 'gp-image',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-image" [style.width]="width" [style.height]="height">
      <img
        [src]="src"
        [alt]="alt"
        [style.width]="width"
        [style.height]="height"
        class="gp-image-img"
      />

      @if (preview) {
        <div class="gp-image-preview-mask" (click)="showPreview()" role="button" aria-label="Preview image">
          <gp-icon name="eye" size="1.5em" class="gp-image-preview-icon" />
        </div>
      }

      @if (previewVisible()) {
        <div class="gp-image-mask" [style.z-index]="zIndex()" (click)="hidePreview()">
          <div class="gp-image-toolbar" (click)="$event.stopPropagation()">
            <button type="button" class="gp-image-action-btn" (click)="zoomIn()" aria-label="Zoom in">
              <gp-icon name="plus" size="1em" />
            </button>
            <button type="button" class="gp-image-action-btn" (click)="zoomOut()" aria-label="Zoom out">
              <gp-icon name="minus" size="1em" />
            </button>
            <button type="button" class="gp-image-action-btn" (click)="rotateRight()" aria-label="Rotate">
              <gp-icon name="refresh" size="1em" />
            </button>
            <button type="button" class="gp-image-action-btn" (click)="hidePreview()" aria-label="Close preview">
              <gp-icon name="times" size="1em" />
            </button>
          </div>

          <div class="gp-image-preview-container" (click)="$event.stopPropagation()">
            <img
              [src]="previewSrc || src"
              [alt]="alt"
              class="gp-image-preview-img"
              [style.transform]="'scale(' + scale() + ') rotate(' + rotate() + 'deg)'"
            />
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-image {
      position: relative;
      display: inline-block;
      overflow: hidden;
      border-radius: var(--gp-border-radius);
    }
    .gp-image-img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gp-image-preview-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--gp-transition-duration);
      cursor: pointer;
      color: #ffffff;
    }
    .gp-image:hover .gp-image-preview-mask {
      opacity: 1;
    }
    .gp-image-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: gp-fade-in 0.15s ease-out;
    }
    .gp-image-toolbar {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 0.35rem 0.5rem;
      border-radius: var(--gp-border-radius-full);
      z-index: 10;
    }
    .gp-image-action-btn {
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 0.35rem;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gp-image-action-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .gp-image-preview-container {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 90vw;
      max-height: 90vh;
    }
    .gp-image-preview-img {
      max-width: 85vw;
      max-height: 85vh;
      object-fit: contain;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class GpImageComponent {
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
