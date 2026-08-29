import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-minimal',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-minimal.component.html',
  styleUrl: './sidebar-minimal.component.scss'
})
export class GpLayoutSidebarMinimalComponent {
  @Input() brandName = 'Minimal';
  @Input() title = 'General Account Settings';
}
