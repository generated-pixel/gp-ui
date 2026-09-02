import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpIcon } from '@generatedpixel/gp-ui';

export interface GpFileDownloadItem {
  id?: string;
  name: string;
  size: string;
  date: string;
  by: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-list-file-list-download',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './list-file-list-download.html',
  styleUrl: './list-file-list-download.scss'
})
export class GpListFileListDownload {
  public title = input<string>('');
  public uploadBtnLabel = input<string>('Upload File');
  public files = input<GpFileDownloadItem[]>([]);

  public uploadClick = output<void>();
  public downloadFile = output<GpFileDownloadItem>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public fileTemplate = input<TemplateRef<{ $implicit: GpFileDownloadItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentFileTemplate = contentChild<TemplateRef<{ $implicit: GpFileDownloadItem }>>('fileTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveFileTemplate = computed(() => this.fileTemplate() || this.contentFileTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
