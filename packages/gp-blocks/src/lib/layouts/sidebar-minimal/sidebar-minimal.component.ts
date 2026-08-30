import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpMinimalNavEntry {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-minimal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-minimal.component.html',
  styleUrl: './sidebar-minimal.component.scss'
})
export class GpLayoutSidebarMinimalComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpMinimalNavEntry[]>([]);

  public navItemClick = output<GpMinimalNavEntry>();

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
