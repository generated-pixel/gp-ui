import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public selectorTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('selector') public contentSelector?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveSelector(): TemplateRef<any> | undefined {
    return this.selectorTemplate || this.contentSelector;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
