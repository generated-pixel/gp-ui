import { Component, input, output } from '@angular/core';
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
}
