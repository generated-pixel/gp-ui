import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpOffcanvasNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-offcanvas',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-offcanvas.component.html',
  styleUrl: './sidebar-offcanvas.component.scss'
})
export class GpLayoutSidebarOffcanvasComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpOffcanvasNavEntry[]>([]);

  public sidebarOpen = signal<boolean>(false);

  public navItemClick = output<GpOffcanvasNavEntry>();
  public openChange = output<boolean>();

  public toggleSidebar(): void {
    this.sidebarOpen.update(v => {
      const next = !v;
      this.openChange.emit(next);
      return next;
    });
  }

  public closeSidebar(): void {
    this.sidebarOpen.set(false);
    this.openChange.emit(false);
  }
}
