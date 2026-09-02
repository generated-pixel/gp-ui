import {
  Component,
  input,
  output,
  computed,
  TemplateRef,
  ViewEncapsulation,
  contentChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeSeverity, GpTabPanel, GpTabs } from '@generatedpixel/gp-ui';

export interface GpNavTabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-nav-tab-navigation',
  standalone: true,
  imports: [CommonModule, GpTabPanel, GpTabs],
  templateUrl: './nav-tab-navigation.html',
  styleUrl: './nav-tab-navigation.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavTabNavigation {
  public underlineTabs = input<GpNavTabItem[]>([]);
  public activeUnderlineTab = input<string>('');
  public pillTabs = input<GpNavTabItem[]>([]);
  public activePillTab = input<string>('');

  public underlineActiveIndex = computed(() => this.getActiveIndex(this.underlineTabs(), this.activeUnderlineTab()));
  public pillActiveIndex = computed(() => this.getActiveIndex(this.pillTabs(), this.activePillTab()));

  public underlineTabChange = output<GpNavTabItem>();
  public pillTabChange = output<GpNavTabItem>();

  public underlineTabsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public pillTabsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentUnderlineTabs = contentChild<TemplateRef<any>>('underlineTabs');
  public contentPillTabs = contentChild<TemplateRef<any>>('pillTabs');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveUnderlineTabs = computed(() => this.underlineTabsTemplate() || this.contentUnderlineTabs());

  public effectivePillTabs = computed(() => this.pillTabsTemplate() || this.contentPillTabs());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onUnderlineChange(index: number): void {
    const tab = this.underlineTabs()[index];
    if (tab) {
      this.underlineTabChange.emit(tab);
    }
  }

  public onPillChange(index: number): void {
    const tab = this.pillTabs()[index];
    if (tab) {
      this.pillTabChange.emit(tab);
    }
  }

  private getActiveIndex(tabs: GpNavTabItem[], activeId: string): number {
    const index = tabs.findIndex((tab) => tab.id === activeId);
    return index >= 0 ? index : 0;
  }
}
