import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity, GpButtonComponent } from '@generatedpixel/gp-ui';

export interface GpNavTabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-nav-tab-navigation',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent],
  templateUrl: './nav-tab-navigation.component.html',
  styleUrl: './nav-tab-navigation.component.scss'
})
export class GpNavTabNavigationComponent {
  public underlineTabs = input<GpNavTabItem[]>([]);
  public activeUnderlineTab = input<string>('');
  public pillTabs = input<GpNavTabItem[]>([]);
  public activePillTab = input<string>('');

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
}
