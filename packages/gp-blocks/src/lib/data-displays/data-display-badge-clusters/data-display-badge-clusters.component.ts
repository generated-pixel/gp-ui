import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpTagComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-data-display-badge-clusters',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpTagComponent],
  templateUrl: './data-display-badge-clusters.component.html',
  styleUrl: './data-display-badge-clusters.component.scss'
})
export class GpDataDisplayBadgeClustersComponent {
  @Input() title = 'Status & Tag Taxonomy';
  @Input() subtitle = 'Hierarchical tag grouping and badges for metadata categorization.';
}
