import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpPinnedStatusNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-pinned-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-pinned-status.component.html',
  styleUrl: './sidebar-pinned-status.component.scss'
})
export class GpLayoutSidebarPinnedStatusComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public systemStatus = input<string>('');
  public uptimeText = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpPinnedStatusNavEntry[]>([]);

  public navItemClick = output<GpPinnedStatusNavEntry>();
  public statusClick = output<void>();
}
