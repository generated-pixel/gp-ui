import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

export interface GpHeaderOverNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-header-over',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './sidebar-header-over.component.html',
  styleUrl: './sidebar-header-over.component.scss'
})
export class GpLayoutSidebarHeaderOverComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public userName = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpHeaderOverNavEntry[]>([]);

  public navItemClick = output<GpHeaderOverNavEntry>();
  public userClick = output<void>();
}
