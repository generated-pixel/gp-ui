import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpHeaderWithStatItem {
  label: string;
  value: string;
}

@Component({
  selector: 'gp-header-with-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-with-stats.component.html',
  styleUrl: './header-with-stats.component.scss'
})
export class GpHeaderWithStatsComponent {
  public title = input<string>('');
  public description = input<string>('');
  public stats = input<GpHeaderWithStatItem[]>([]);

  public statClick = output<GpHeaderWithStatItem>();
}
