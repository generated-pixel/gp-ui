import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;
  @Input() public passwordTemplate?: TemplateRef<any>;
  @Input() public twoFaTemplate?: TemplateRef<any>;
  @Input() public sessionsTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('password') public contentPassword?: TemplateRef<any>;
  @ContentChild('twoFa') public contentTwoFa?: TemplateRef<any>;
  @ContentChild('sessions') public contentSessions?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public get effectivePassword(): TemplateRef<any> | undefined {
    return this.passwordTemplate || this.contentPassword;
  }

  public get effectiveTwoFa(): TemplateRef<any> | undefined {
    return this.twoFaTemplate || this.contentTwoFa;
  }

  public get effectiveSessions(): TemplateRef<any> | undefined {
    return this.sessionsTemplate || this.contentSessions;
  }

  public onUpdatePassword(): void {
    this.updatePassword.emit({
      current: this.currentPasswordValue(),
      new: this.newPasswordValue(),
      confirm: this.confirmPasswordValue()
    });
  }
}
