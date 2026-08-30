import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

export interface GpLightSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  badgeSeverity?: 'success' | 'primary' | 'secondary' | 'warning' | 'danger';
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-light',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-light.component.html',
  styleUrl: './sidebar-light.component.scss'
})
export class GpLayoutSidebarLightComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpLightSidebarNavEntry[]>([]);

  public upgradeTitle = input<string>('');
  public upgradeText = input<string>('');
  public upgradeBtnLabel = input<string>('');

  public navItemClick = output<GpLightSidebarNavEntry>();
  public upgradeClick = output<void>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public brandTemplate?: TemplateRef<any>;
  @Input() public navTemplate?: TemplateRef<any>;
  @Input() public upgradeTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('brand') public contentBrand?: TemplateRef<any>;
  @ContentChild('nav') public contentNav?: TemplateRef<any>;
  @ContentChild('upgrade') public contentUpgrade?: TemplateRef<any>;
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

  public get effectiveUpgrade(): TemplateRef<any> | undefined {
    return this.upgradeTemplate || this.contentUpgrade;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
