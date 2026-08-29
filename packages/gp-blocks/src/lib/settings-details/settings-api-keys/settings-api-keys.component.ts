import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-api-keys',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './settings-api-keys.component.html',
  styleUrl: './settings-api-keys.component.scss'
})
export class GpSettingsApiKeysComponent {
  @Input() title = 'API Keys & Secrets';
  @Input() subtitle = 'Manage secure bearer tokens for accessing the REST and GraphQL APIs.';

  apiKeys = [
    { name: 'Production Backend Runner', token: 'gp_live_89a7f62e84c91038b72e', scope: 'Full Access (Read/Write)', created: 'May 12, 2026', lastUsed: '2 mins ago' },
    { name: 'CI/CD Automated Deployment Key', token: 'gp_test_33a1e94b28c00918a61f', scope: 'Read Only', created: 'Jun 28, 2026', lastUsed: '1 hour ago' }
  ];
}
