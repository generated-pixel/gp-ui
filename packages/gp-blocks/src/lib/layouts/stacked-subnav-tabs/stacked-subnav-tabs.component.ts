import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

export interface GpStackedSubnavTab {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-stacked-subnav-tabs',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-subnav-tabs.component.html',
  styleUrl: './stacked-subnav-tabs.component.scss'
})
export class GpLayoutStackedSubnavTabsComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public userName = input<string>('');
  public activeTabId = input<string>('');

  public tabs = input<GpStackedSubnavTab[]>([]);

  public tabChange = output<GpStackedSubnavTab>();
  public userClick = output<void>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public tabsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;
  @Input() public userTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('tabs') public contentTabs?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;
  @ContentChild('user') public contentUser?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveTabs(): TemplateRef<any> | undefined {
    return this.tabsTemplate || this.contentTabs;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }

  public get effectiveUser(): TemplateRef<any> | undefined {
    return this.userTemplate || this.contentUser;
  }
}
