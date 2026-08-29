import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpSwitchComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-notifications',
  standalone: true,
  imports: [CommonModule, GpSwitchComponent, GpButtonComponent],
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.scss'
})
export class GpSettingsNotificationsComponent {
  @Input() title = 'Notification Preferences';
  @Input() subtitle = 'Choose what notifications and email digests you receive.';

  preferences = [
    { title: 'Security & Login Alerts', desc: 'Notify me whenever an unusual login or password change occurs.', enabled: true },
    { title: 'Billing & Payment Reminders', desc: 'Receive invoice copies and upcoming renewal alerts.', enabled: true },
    { title: 'Weekly Performance Digest', desc: 'Summary of team activities, errors, and metrics delivered Mondays.', enabled: false },
    { title: 'Product Updates & Changelogs', desc: 'Stay informed on new features and major releases.', enabled: true }
  ];
}
