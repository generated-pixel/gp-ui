import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-overlay-slide-over-panel',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './overlay-slide-over-panel.component.html',
  styleUrl: './overlay-slide-over-panel.component.scss'
})
export class GpOverlaySlideOverPanelComponent {
  @Input() title = 'Cluster Properties';
  @Input() description = 'Modify node allocation and regional scaling thresholds.';
}
