import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpFileDownloadItem {
  id?: string;
  name: string;
  size: string;
  date: string;
  by: string;
}

@Component({
  selector: 'gp-list-file-list-download',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './list-file-list-download.component.html',
  styleUrl: './list-file-list-download.component.scss'
})
export class GpListFileListDownloadComponent {
  public title = input<string>('');
  public uploadBtnLabel = input<string>('Upload File');
  public files = input<GpFileDownloadItem[]>([]);

  public uploadClick = output<void>();
  public downloadFile = output<GpFileDownloadItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public fileTemplate?: TemplateRef<{ $implicit: GpFileDownloadItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('fileTemplate') public contentFileTemplate?: TemplateRef<{ $implicit: GpFileDownloadItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveFileTemplate(): TemplateRef<{ $implicit: GpFileDownloadItem }> | undefined {
    return this.fileTemplate || this.contentFileTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
