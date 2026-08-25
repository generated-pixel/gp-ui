import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpButtonComponent } from '../button/button.component';

export interface GpFileItem {
  file: File;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

@Component({
  selector: 'gp-file-upload',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-fileupload" [class.gp-fileupload-disabled]="disabled">
      <div
        class="gp-fileupload-dropzone"
        [class.gp-fileupload-dragover]="dragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
        tabindex="0"
        role="button"
        aria-label="Upload files area"
      >
        <input
          #fileInput
          type="file"
          [accept]="accept"
          [multiple]="multiple"
          [disabled]="disabled"
          (change)="onFileSelect($event)"
          class="gp-sr-only"
        />

        <gp-icon [name]="icon" size="2.5em" class="gp-fileupload-icon" />
        <div class="gp-fileupload-title">{{ chooseLabel }}</div>
        <div class="gp-fileupload-subtitle">{{ dragDropLabel }}</div>
      </div>

      @if (files().length > 0) {
        <div class="gp-fileupload-files">
          @for (f of files(); track f.name + f.size) {
            <div class="gp-fileupload-file-card">
              <gp-icon name="file" size="1.5em" class="gp-fileupload-file-icon" />
              <div class="gp-fileupload-file-info">
                <span class="gp-fileupload-file-name">{{ f.name }}</span>
                <span class="gp-fileupload-file-size">{{ formatSize(f.size) }}</span>
              </div>
              <button
                type="button"
                class="gp-fileupload-file-remove"
                (click)="removeFile(f, $event)"
                aria-label="Remove file"
              >
                <gp-icon name="times" size="0.85em" />
              </button>
            </div>
          }

          <div class="gp-fileupload-actions">
            <gp-button
              [label]="uploadLabel"
              icon="upload"
              severity="primary"
              [disabled]="disabled"
              (onClickEvent)="upload()"
            />
            <gp-button
              [label]="cancelLabel"
              icon="times"
              variant="outlined"
              severity="secondary"
              (onClickEvent)="clear()"
            />
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-fileupload {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
    .gp-fileupload-dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem 1.5rem;
      border: 2px dashed var(--gp-input-border);
      border-radius: var(--gp-border-radius-md);
      background: var(--gp-surface-card);
      cursor: pointer;
      transition: all var(--gp-transition-duration);
      text-align: center;
    }
    .gp-fileupload-dropzone:hover, .gp-fileupload-dragover {
      border-color: var(--gp-primary);
      background: var(--gp-primary-light);
    }
    .gp-fileupload-icon {
      color: var(--gp-primary);
    }
    .gp-fileupload-title {
      font-weight: 600;
      font-size: var(--gp-font-size-base);
      color: var(--gp-text-color);
    }
    .gp-fileupload-subtitle {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
    }
    .gp-fileupload-files {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .gp-fileupload-file-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
    }
    .gp-fileupload-file-icon {
      color: var(--gp-primary);
    }
    .gp-fileupload-file-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .gp-fileupload-file-name {
      font-size: var(--gp-font-size-sm);
      font-weight: 500;
      color: var(--gp-text-color);
    }
    .gp-fileupload-file-size {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
    }
    .gp-fileupload-file-remove {
      background: none;
      border: none;
      color: var(--gp-text-color-muted);
      cursor: pointer;
      padding: 0.25rem;
      display: inline-flex;
      border-radius: 50%;
    }
    .gp-fileupload-file-remove:hover {
      color: var(--gp-danger);
    }
    .gp-fileupload-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .gp-fileupload-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `]
})
export class GpFileUploadComponent {
  @Input() name = '';
  @Input() accept = '';
  @Input() multiple = false;
  @Input() maxFileSize?: number;
  @Input() chooseLabel = 'Choose files or drag & drop';
  @Input() dragDropLabel = 'PNG, JPG, PDF up to 10MB';
  @Input() uploadLabel = 'Upload';
  @Input() cancelLabel = 'Clear';
  @Input() icon = 'upload';
  @Input() disabled = false;

  @Output() onSelect = new EventEmitter<{ files: File[] }>();
  @Output() onUpload = new EventEmitter<{ files: File[] }>();
  @Output() onClear = new EventEmitter<void>();

  protected files = signal<GpFileItem[]>([]);
  protected dragOver = signal<boolean>(false);

  public formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = '';
    }
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    if (event.dataTransfer?.files) {
      this.handleFiles(Array.from(event.dataTransfer.files));
    }
  }

  private handleFiles(selectedFiles: File[]): void {
    const valid = selectedFiles.filter(f => {
      if (this.maxFileSize && f.size > this.maxFileSize) return false;
      return true;
    });

    const items: GpFileItem[] = valid.map(f => ({
      file: f,
      name: f.name,
      size: f.size,
      type: f.type
    }));

    if (this.multiple) {
      this.files.update(prev => [...prev, ...items]);
    } else {
      this.files.set(items.slice(0, 1));
    }

    this.onSelect.emit({ files: valid });
  }

  public removeFile(f: GpFileItem, event: MouseEvent): void {
    event.stopPropagation();
    this.files.update(prev => prev.filter(item => item !== f));
  }

  public upload(): void {
    const rawFiles = this.files().map(f => f.file);
    this.onUpload.emit({ files: rawFiles });
  }

  public clear(): void {
    this.files.set([]);
    this.onClear.emit();
  }
}
