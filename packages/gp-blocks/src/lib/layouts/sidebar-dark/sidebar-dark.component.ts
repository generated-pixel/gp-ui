import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpIconComponent, GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  badgeSeverity?: GpBadgeSeverity;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-dark',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-dark.component.html',
  styleUrl: './sidebar-dark.component.scss'
})
export class GpLayoutSidebarDarkComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public navGroupLabel = input<string>('');
  public userName = input<string>('');
  public userEmail = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpSidebarNavEntry[]>([]);

  public navItemClick = output<GpSidebarNavEntry>();
  public userClick = output<void>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public brandTemplate?: TemplateRef<any>;
  @Input() public navTemplate?: TemplateRef<any>;
  @Input() public userTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('brand') public contentBrand?: TemplateRef<any>;
  @ContentChild('nav') public contentNav?: TemplateRef<any>;
  @ContentChild('user') public contentUser?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveBrand(): TemplateRef<any> | undefined {
    return this.brandTemplate || this.contentBrand;
  }

  public get effectiveNav(): TemplateRef<any> | undefined {
    return this.navTemplate || this.contentNav;
  }

  public get effectiveUser(): TemplateRef<any> | undefined {
    return this.userTemplate || this.contentUser;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
