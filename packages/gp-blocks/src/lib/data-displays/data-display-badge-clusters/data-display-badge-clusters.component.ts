import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpTagComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpBadgeItem {
  value: string;
  severity?: GpBadgeSeverity;
  isTag?: boolean;
}

export interface GpBadgeClusterGroup {
  id?: string;
  title: string;
  items: GpBadgeItem[];
}

@Component({
  selector: 'gp-data-display-badge-clusters',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpTagComponent],
  templateUrl: './data-display-badge-clusters.component.html',
  styleUrl: './data-display-badge-clusters.component.scss'
})
export class GpDataDisplayBadgeClustersComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public groups = input<GpBadgeClusterGroup[]>([]);

  public itemClick = output<GpBadgeItem>();
}
