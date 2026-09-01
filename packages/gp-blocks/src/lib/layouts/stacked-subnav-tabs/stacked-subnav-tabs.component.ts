import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

export interface GpStackedSubnavTab {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-subnav-tabs',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent, GpButtonComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public tabsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public userTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentTabs = contentChild<TemplateRef<any>>('tabs');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');
  public contentUser = contentChild<TemplateRef<any>>('user');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveTabs = computed(() => this.tabsTemplate() || this.contentTabs());

  public effectiveContent = computed<TemplateRef<any> | undefined>(() => this.contentTemplate() || this.contentArea() || this.contentMain());

  public effectiveUser = computed(() => this.userTemplate() || this.contentUser());
}
