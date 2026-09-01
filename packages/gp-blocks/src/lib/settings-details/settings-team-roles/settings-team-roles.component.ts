import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public membersTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentMembers = contentChild<TemplateRef<any>>('members');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveMembers = computed(() => this.membersTemplate() || this.contentMembers());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
