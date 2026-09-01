import { Component, input, output, signal, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpPasswordComponent, GpSwitchComponent } from '@generatedpixel/gp-ui';

export interface GpSession {
  id?: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-settings-security',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpPasswordComponent, GpSwitchComponent],
  templateUrl: './settings-security.component.html',
  styleUrl: './settings-security.component.scss'
})
export class GpSettingsSecurityComponent {
  public title = input<string>('Security & Authentication');
  public subtitle = input<string>('Manage your password, two-factor authentication, and active sessions.');
  public twoFaEnabled = input<boolean>(false);
  public sessions = input<GpSession[]>([]);

  public currentPasswordValue = signal<string>('');
  public newPasswordValue = signal<string>('');
  public confirmPasswordValue = signal<string>('');

  public updatePassword = output<{ current: string; new: string; confirm: string }>();
  public twoFaChange = output<boolean>();
  public revokeSession = output<GpSession>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public passwordTemplate = input<TemplateRef<any> | undefined>(undefined);
  public twoFaTemplate = input<TemplateRef<any> | undefined>(undefined);
  public sessionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentPassword = contentChild<TemplateRef<any>>('password');
  public contentTwoFa = contentChild<TemplateRef<any>>('twoFa');
  public contentSessions = contentChild<TemplateRef<any>>('sessions');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public effectivePassword = computed(() => this.passwordTemplate() || this.contentPassword());

  public effectiveTwoFa = computed(() => this.twoFaTemplate() || this.contentTwoFa());

  public effectiveSessions = computed(() => this.sessionsTemplate() || this.contentSessions());

  public onUpdatePassword(): void {
    this.updatePassword.emit({
      current: this.currentPasswordValue(),
      new: this.newPasswordValue(),
      confirm: this.confirmPasswordValue()
    });
  }
}
