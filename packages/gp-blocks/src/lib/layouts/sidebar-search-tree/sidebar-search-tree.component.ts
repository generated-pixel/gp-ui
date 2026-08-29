import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-search-tree',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-search-tree.component.html',
  styleUrl: './sidebar-search-tree.component.scss'
})
export class GpLayoutSidebarSearchTreeComponent {
  @Input() searchPlaceholder = 'Filter tree...';
  @Input() title = 'Components Documentation';
}
