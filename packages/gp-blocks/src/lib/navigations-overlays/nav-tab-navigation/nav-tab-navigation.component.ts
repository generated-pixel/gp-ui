import { Component, input, output, computed, Input, TemplateRef, ContentChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeSeverity, GpTabPanelComponent, GpTabsComponent } from '@generatedpixel/gp-ui';

export interface GpNavTabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-nav-tab-navigation',
  standalone: true,
  imports: [CommonModule, GpTabPanelComponent, GpTabsComponent],
  templateUrl: './nav-tab-navigation.component.html',
  styleUrl: './nav-tab-navigation.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavTabNavigationComponent {
  public underlineTabs = input<GpNavTabItem[]>([]);
  public activeUnderlineTab = input<string>('');
  public pillTabs = input<GpNavTabItem[]>([]);
  public activePillTab = input<string>('');

  public underlineActiveIndex = computed(() => this.getActiveIndex(this.underlineTabs(), this.activeUnderlineTab()));
  public pillActiveIndex = computed(() => this.getActiveIndex(this.pillTabs(), this.activePillTab()));

  public underlineTabChange = output<GpNavTabItem>();
  public pillTabChange = output<GpNavTabItem>();

  @Input() public underlineTabsTemplate?: TemplateRef<any>;
  @Input() public pillTabsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('underlineTabs') public contentUnderlineTabs?: TemplateRef<any>;
  @ContentChild('pillTabs') public contentPillTabs?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveUnderlineTabs(): TemplateRef<any> | undefined {
    return this.underlineTabsTemplate || this.contentUnderlineTabs;
  }

  public get effectivePillTabs(): TemplateRef<any> | undefined {
    return this.pillTabsTemplate || this.contentPillTabs;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

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
