import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpStatsCounterItem {
  id?: string;
  number: string;
  label: string;
  desc?: string;
}

@Component({
  selector: 'gp-data-display-stats-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-display-stats-counter.component.html',
  styleUrl: './data-display-stats-counter.component.scss'
})
export class GpDataDisplayStatsCounterComponent {
  public counters = input<GpStatsCounterItem[]>([]);

  public counterClick = output<GpStatsCounterItem>();
}
