import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpIcon, GpBadge, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpSectionTabItem {
  id: string;
  label: string;
  count?: string | number;
  active?: boolean;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-header-section-tabs',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon, GpBadge],
  templateUrl: './header-section-tabs.html',
  styleUrl: './header-section-tabs.scss'
})
export class GpHeaderSectionTabs {
  public title = input<string>('');
  public description = input<string>('');
  public actionBtnLabel = input<string>('New Item');
  public activeTabId = input<string>('');
  public tabs = input<GpSectionTabItem[]>([]);

  public actionClick = output<void>();
  public tabChange = output<GpSectionTabItem>();

  public titleTemplate = input<TemplateRef<any> | undefined>(undefined);
  public tabsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentTitle = contentChild<TemplateRef<any>>('title');
  public contentTabs = contentChild<TemplateRef<any>>('tabs');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveTitle = computed(() => this.titleTemplate() || this.contentTitle());

  public effectiveTabs = computed(() => this.tabsTemplate() || this.contentTabs());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public onTabClick(tab: GpSectionTabItem): void {
    this.tabChange.emit(tab);
  }
}
