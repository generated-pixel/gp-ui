import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpCardGridItem {
  id?: string;
  icon: string;
  title: string;
  desc: string;
  status: string;
  meta: string;
}

@Component({
  selector: 'gp-list-card-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './list-card-grid.component.html',
  styleUrl: './list-card-grid.component.scss'
})
export class GpListCardGridComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public createBtnLabel = input<string>('Create New');
  public cards = input<GpCardGridItem[]>([]);

  public createClick = output<void>();
  public cardClick = output<GpCardGridItem>();
}
