import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-header-over',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './sidebar-header-over.component.html',
  styleUrl: './sidebar-header-over.component.scss'
})
export class GpLayoutSidebarHeaderOverComponent {
  @Input() brandName = 'Global Apex';
  @Input() userName = 'Emma Watson';
}
