import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpSwitchComponent } from '@generatedpixel/gp-ui';

export interface GpNotificationPreference {
  id?: string;
  title: string;
  desc: string;
  enabled: boolean;
}

@Component({
  selector: 'gp-settings-notifications',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpSwitchComponent],
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.scss'
})
export class GpSettingsNotificationsComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public saveBtnLabel = input<string>('Save Preferences');
  public preferences = input<GpNotificationPreference[]>([]);

  public save = output<GpNotificationPreference[]>();
  public togglePreference = output<{ item: GpNotificationPreference; enabled: boolean }>();

  public onToggle(item: GpNotificationPreference, enabled: boolean): void {
    this.togglePreference.emit({ item, enabled });
  }
}
