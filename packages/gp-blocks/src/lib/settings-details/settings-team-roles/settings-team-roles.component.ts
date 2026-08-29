import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-team-roles',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './settings-team-roles.component.html',
  styleUrl: './settings-team-roles.component.scss'
})
export class GpSettingsTeamRolesComponent {
  @Input() title = 'Team Members & Roles';
  @Input() subtitle = 'Manage who has access to this workspace and configure permission roles.';

  members = [
    { name: 'Graeme Gorman', email: 'graeme@generatedpixel.dev', role: 'Owner / Admin', status: 'Active' },
    { name: 'Sarah Connor', email: 'sarah.c@company.io', role: 'Billing Manager', status: 'Active' },
    { name: 'David Miller', email: 'david.m@company.io', role: 'Developer', status: 'Pending Invite' }
  ];
}
