import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpMiniSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-mini',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpIconComponent],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss'
})
export class GpLayoutSidebarMiniComponent {
  public brandIcon = input<string>('box');
  public title = input<string>('');
  public activeNavId = input<string>('');
  public userName = input<string>('User');

  public navItems = input<GpMiniSidebarNavEntry[]>([]);

  public navItemClick = output<GpMiniSidebarNavEntry>();
  public userClick = output<void>();
}
