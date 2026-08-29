import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-offcanvas',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpButtonComponent],
  templateUrl: './sidebar-offcanvas.component.html',
  styleUrl: './sidebar-offcanvas.component.scss'
})
export class GpLayoutSidebarOffcanvasComponent {
  @Input() brandName = 'Responsive Mobile';
  @Input() title = 'Offcanvas Drawer Layout';
  @Input() sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
