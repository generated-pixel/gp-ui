import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-workspace',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-workspace.component.html',
  styleUrl: './sidebar-workspace.component.scss'
})
export class GpLayoutSidebarWorkspaceComponent {
  @Input() currentWorkspace = 'Acme Global Corp';
  @Input() title = 'Team Workspace Overview';
}
