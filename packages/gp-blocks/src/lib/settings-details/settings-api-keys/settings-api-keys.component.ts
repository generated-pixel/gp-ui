import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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
  public title = input<string>('API Keys & Tokens');
  public subtitle = input<string>('Manage secret API tokens for programmatic integration with services.');
  public generateBtnLabel = input<string>('Generate New Key');
  public apiKeys = input<GpApiKey[]>([]);

  public generateKey = output<void>();
  public revokeKey = output<GpApiKey>();
  public copyKey = output<GpApiKey>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public keysTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('keys') public contentKeys?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveKeys(): TemplateRef<any> | undefined {
    return this.keysTemplate || this.contentKeys;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
