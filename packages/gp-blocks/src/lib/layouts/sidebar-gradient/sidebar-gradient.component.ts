import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpGradientSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-gradient',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-gradient.component.html',
  styleUrl: './sidebar-gradient.component.scss'
})
export class GpLayoutSidebarGradientComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('star');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpGradientSidebarNavEntry[]>([]);

  public navItemClick = output<GpGradientSidebarNavEntry>();
}
