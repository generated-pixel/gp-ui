import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpFloatingSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-floating',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-floating.component.html',
  styleUrl: './sidebar-floating.component.scss'
})
export class GpLayoutSidebarFloatingComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpFloatingSidebarNavEntry[]>([]);

  public navItemClick = output<GpFloatingSidebarNavEntry>();
}
