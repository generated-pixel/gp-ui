import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpPinnedStatusNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-pinned-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-pinned-status.component.html',
  styleUrl: './sidebar-pinned-status.component.scss'
})
export class GpLayoutSidebarPinnedStatusComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public systemStatus = input<string>('');
  public uptimeText = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpPinnedStatusNavEntry[]>([]);

  public navItemClick = output<GpPinnedStatusNavEntry>();
  public statusClick = output<void>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public statusTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('status') public contentStatus?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveStatus(): TemplateRef<any> | undefined {
    return this.statusTemplate || this.contentStatus;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
