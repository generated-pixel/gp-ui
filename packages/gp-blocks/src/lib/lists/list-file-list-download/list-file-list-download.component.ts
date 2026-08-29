import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-file-list-download',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './list-file-list-download.component.html',
  styleUrl: './list-file-list-download.component.scss'
})
export class GpListFileListDownloadComponent {
  @Input() title = 'Project Attachments & Assets';

  files = [
    { name: 'enterprise_architecture_q3.pdf', size: '4.2 MB', by: 'Graeme G.', date: 'Aug 26, 2026' },
    { name: 'api_openapi_spec_v2.yaml', size: '240 KB', by: 'Alex H.', date: 'Aug 24, 2026' },
    { name: 'brand_design_tokens_figma.zip', size: '18.4 MB', by: 'Jane D.', date: 'Aug 20, 2026' }
  ];
}
