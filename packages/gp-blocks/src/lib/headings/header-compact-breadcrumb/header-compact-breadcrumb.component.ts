import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-compact-breadcrumb',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './header-compact-breadcrumb.component.html',
  styleUrl: './header-compact-breadcrumb.component.scss'
})
export class GpHeaderCompactBreadcrumbComponent {
  @Input() activeItem = 'Infrastructure Setup v2';
}
