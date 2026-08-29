import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpApiKey {
  id?: string;
  name: string;
  scope: string;
  token: string;
  created: string;
  lastUsed: string;
}

@Component({
  selector: 'gp-settings-api-keys',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './settings-api-keys.component.html',
  styleUrl: './settings-api-keys.component.scss'
})
export class GpSettingsApiKeysComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public generateBtnLabel = input<string>('Generate New Key');
  public apiKeys = input<GpApiKey[]>([]);

  public generateKey = output<void>();
  public revokeKey = output<GpApiKey>();
  public copyKey = output<GpApiKey>();
}
