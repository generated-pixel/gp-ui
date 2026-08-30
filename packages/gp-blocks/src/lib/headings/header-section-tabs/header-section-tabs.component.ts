import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpSectionTabItem {
  id: string;
  label: string;
  count?: string | number;
  active?: boolean;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-header-section-tabs',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './header-section-tabs.component.html',
  styleUrl: './header-section-tabs.component.scss'
})
export class GpHeaderSectionTabsComponent {
  public title = input<string>('');
  public description = input<string>('');
  public actionBtnLabel = input<string>('New Item');
  public activeTabId = input<string>('');
  public tabs = input<GpSectionTabItem[]>([]);

  public actionClick = output<void>();
  public tabChange = output<GpSectionTabItem>();

  @Input() public titleTemplate?: TemplateRef<any>;
  @Input() public tabsTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;

  @ContentChild('title') public contentTitle?: TemplateRef<any>;
  @ContentChild('tabs') public contentTabs?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;

  public get effectiveTitle(): TemplateRef<any> | undefined {
    return this.titleTemplate || this.contentTitle;
  }

  public get effectiveTabs(): TemplateRef<any> | undefined {
    return this.tabsTemplate || this.contentTabs;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public onTabClick(tab: GpSectionTabItem): void {
    this.tabChange.emit(tab);
  }
}
