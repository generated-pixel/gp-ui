import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-sticky-action-bar',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './stacked-sticky-action-bar.component.html',
  styleUrl: './stacked-sticky-action-bar.component.scss'
})
export class GpLayoutStackedStickyActionBarComponent {
  @Input() brandName = 'Catalog Engine';
  @Input() pageTitle = 'All Products & Variants';
  @Input() itemCount = 142;
}
