import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpButtonComponent } from '../../button/button/button.component';

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
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class GpFileUploadComponent extends GpEditableBaseComponent {
  public accept = input<string>('');
  public multiple = input<boolean>(false);
  public maxFileSize = input<number | undefined>(undefined);
  public chooseLabel = input<string>('Choose files or drag & drop');
  public dragDropLabel = input<string>('PNG, JPG, PDF up to 10MB');
  public uploadLabel = input<string>('Upload');
  public cancelLabel = input<string>('Clear');
  public icon = input<string>('upload');

  public onSelect = output<{ files: File[] }>();
  public onUpload = output<{ files: File[] }>();
  public onClear = output<void>();

  protected files = signal<GpFileItem[]>([]);
  protected dragOver = signal<boolean>(false);

  public formatSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public onFileSelect(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files) {
      this.handleFiles(Array.from(inputEl.files));
      inputEl.value = '';
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
    const maxLimit = this.maxFileSize();
    const valid = selectedFiles.filter((f) => {
      if (maxLimit && f.size > maxLimit) {
        return false;
      }
      return true;
    });

    const items: GpFileItem[] = valid.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      type: f.type
    }));

    if (this.multiple()) {
      this.files.update((prev) => [...prev, ...items]);
    } else {
      this.files.set(items.slice(0, 1));
    }

    this.onSelect.emit({ files: valid });
  }

  public removeFile(f: GpFileItem, event: MouseEvent): void {
    event.stopPropagation();
    this.files.update((prev) => prev.filter((item) => item !== f));
  }

  public upload(): void {
    const rawFiles = this.files().map((f) => f.file);
    this.onUpload.emit({ files: rawFiles });
  }

  public clear(): void {
    this.files.set([]);
    this.onClear.emit();
  }
}
