import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpSwitchComponent } from '@generatedpixel/gp-ui';

export interface GpSession {
  id?: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'gp-settings-security',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpSwitchComponent],
  templateUrl: './settings-security.component.html',
  styleUrl: './settings-security.component.scss'
})
export class GpSettingsSecurityComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public twoFaEnabled = input<boolean>(false);
  public sessions = input<GpSession[]>([]);

  public currentPasswordValue = signal<string>('');
  public newPasswordValue = signal<string>('');
  public confirmPasswordValue = signal<string>('');

  public updatePassword = output<{ current: string; new: string; confirm: string }>();
  public twoFaChange = output<boolean>();
  public revokeSession = output<GpSession>();

  public onUpdatePassword(): void {
    this.updatePassword.emit({
      current: this.currentPasswordValue(),
      new: this.newPasswordValue(),
      confirm: this.confirmPasswordValue()
    });
  }
}
