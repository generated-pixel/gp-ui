import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpDescriptionListItem {
  label: string;
  value: string;
  badge?: boolean;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-data-display-description-list',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './data-display-description-list.component.html',
  styleUrl: './data-display-description-list.component.scss'
})
export class GpDataDisplayDescriptionListComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public items = input<GpDescriptionListItem[]>([]);

  public itemClick = output<GpDescriptionListItem>();
}
