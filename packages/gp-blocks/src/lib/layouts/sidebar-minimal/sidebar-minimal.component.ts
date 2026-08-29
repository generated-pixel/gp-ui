import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpMinimalNavEntry {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-minimal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-minimal.component.html',
  styleUrl: './sidebar-minimal.component.scss'
})
export class GpLayoutSidebarMinimalComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpMinimalNavEntry[]>([]);

  public navItemClick = output<GpMinimalNavEntry>();
}
