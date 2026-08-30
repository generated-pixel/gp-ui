import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpMiniSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-mini',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpIconComponent],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss'
})
export class GpLayoutSidebarMiniComponent {
  public brandIcon = input<string>('box');
  public title = input<string>('');
  public activeNavId = input<string>('');
  public userName = input<string>('User');

  public navItems = input<GpMiniSidebarNavEntry[]>([]);

  public navItemClick = output<GpMiniSidebarNavEntry>();
  public userClick = output<void>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
