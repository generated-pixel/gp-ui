import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpWorkspaceNavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public selectorTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentSelector = contentChild<TemplateRef<any>>('selector');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveSelector = computed(() => this.selectorTemplate() || this.contentSelector());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(() => this.topActionsTemplate() || this.contentTopActions() || this.contentActions());

  public effectiveContent = computed<TemplateRef<any> | undefined>(() => this.contentTemplate() || this.contentArea() || this.contentMain());
}
