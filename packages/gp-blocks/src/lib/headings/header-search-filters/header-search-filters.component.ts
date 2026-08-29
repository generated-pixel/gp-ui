import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpSelectComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-search-filters',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpSelectComponent],
  templateUrl: './header-search-filters.component.html',
  styleUrl: './header-search-filters.component.scss'
})
export class GpHeaderSearchFiltersComponent {
  @Input() title = 'User Directory';
  @Input() subtitle = 'Browse and manage all registered team members and access credentials.';
}
