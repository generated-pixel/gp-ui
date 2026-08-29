import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpTeamMember {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'gp-settings-team-roles',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './settings-team-roles.component.html',
  styleUrl: './settings-team-roles.component.scss'
})
export class GpSettingsTeamRolesComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public inviteBtnLabel = input<string>('Invite Member');
  public members = input<GpTeamMember[]>([]);

  public inviteMember = output<void>();
  public editMember = output<GpTeamMember>();
}
