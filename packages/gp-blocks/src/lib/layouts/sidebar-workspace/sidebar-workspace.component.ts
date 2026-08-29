import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpWorkspaceNavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-workspace',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-workspace.component.html',
  styleUrl: './sidebar-workspace.component.scss'
})
export class GpLayoutSidebarWorkspaceComponent {
  public currentWorkspace = input<string>('');
  public workspaceTier = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpWorkspaceNavItem[]>([]);

  public workspaceClick = output<void>();
  public navItemClick = output<GpWorkspaceNavItem>();
}
