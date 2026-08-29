import { Component, input, output } from '@angular/core';
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
}
