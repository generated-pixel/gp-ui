import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpPasswordComponent,
  GpSwitchComponent,
  GpBadgeComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-security',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpPasswordComponent, GpSwitchComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './settings-security.component.html',
  styleUrl: './settings-security.component.scss'
})
export class GpSettingsSecurityComponent {
  @Input() title = 'Security & Authentication';
  @Input() subtitle = 'Manage your password, two-factor authentication, and active web sessions.';
}
