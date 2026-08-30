import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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
  public title = input<string>('Team Members & Roles');
  public subtitle = input<string>('Manage workspace members and configure access permissions.');
  public inviteBtnLabel = input<string>('Invite Member');
  public members = input<GpTeamMember[]>([]);

  public inviteMember = output<void>();
  public editMember = output<GpTeamMember>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public membersTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('members') public contentMembers?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveMembers(): TemplateRef<any> | undefined {
    return this.membersTemplate || this.contentMembers;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
