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
import { GpBadge, GpButton, GpIcon } from '@generatedpixel/gp-ui';

export interface GpApiKey {
  id?: string;
  name: string;
  scope: string;
  token: string;
  created: string;
  lastUsed: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-settings-api-keys',
  standalone: true,
  imports: [CommonModule, GpBadge, GpButton, GpIcon],
  templateUrl: './settings-api-keys.html',
  styleUrl: './settings-api-keys.scss'
})
export class GpSettingsApiKeys {
  public title = input<string>('API Keys & Tokens');
  public subtitle = input<string>('Manage secret API tokens for programmatic integration with services.');
  public generateBtnLabel = input<string>('Generate New Key');
  public apiKeys = input<GpApiKey[]>([]);

  public generateKey = output<void>();
  public revokeKey = output<GpApiKey>();
  public copyKey = output<GpApiKey>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public keysTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentKeys = contentChild<TemplateRef<any>>('keys');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveKeys = computed(() => this.keysTemplate() || this.contentKeys());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
