import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDockItem {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-stacked-bottom-dock',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './stacked-bottom-dock.component.html',
  styleUrl: './stacked-bottom-dock.component.scss'
})
export class GpLayoutStackedBottomDockComponent {
  public brandName = input<string>('');
  public activeTab = input<string>('');
  public activeDockId = input<string>('');

  public dockItems = input<GpDockItem[]>([]);

  public dockItemClick = output<GpDockItem>();
}
