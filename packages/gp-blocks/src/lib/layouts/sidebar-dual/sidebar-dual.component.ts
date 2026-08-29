import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

export interface GpDualTier1Item {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

export interface GpDualTier2Item {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-dual',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-dual.component.html',
  styleUrl: './sidebar-dual.component.scss'
})
export class GpLayoutSidebarDualComponent {
  public activeTier1Id = input<string>('');
  public subnavTitle = input<string>('');
  public subnavBadge = input<string>('');
  public activeTier2Id = input<string>('');
  public title = input<string>('');

  public tier1Items = input<GpDualTier1Item[]>([]);
  public tier2Items = input<GpDualTier2Item[]>([]);

  public tier1Click = output<GpDualTier1Item>();
  public tier2Click = output<GpDualTier2Item>();
}
