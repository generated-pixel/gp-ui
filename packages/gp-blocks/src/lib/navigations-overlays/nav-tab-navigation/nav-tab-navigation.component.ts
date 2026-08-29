import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpNavTabItem {
  id: string;
  label: string;
  badge?: string | number;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-nav-tab-navigation',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
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
}
