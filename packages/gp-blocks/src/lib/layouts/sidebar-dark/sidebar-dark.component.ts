import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpIconComponent, GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  badgeSeverity?: GpBadgeSeverity;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-dark',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-dark.component.html',
  styleUrl: './sidebar-dark.component.scss'
})
export class GpLayoutSidebarDarkComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public navGroupLabel = input<string>('');
  public userName = input<string>('');
  public userEmail = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpSidebarNavEntry[]>([]);

  public navItemClick = output<GpSidebarNavEntry>();
  public userClick = output<void>();
}
