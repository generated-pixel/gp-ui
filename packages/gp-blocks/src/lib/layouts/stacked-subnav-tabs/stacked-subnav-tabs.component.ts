import { Component, input, output } from '@angular/core';
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
}
