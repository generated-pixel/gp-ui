import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpDockComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-bottom-dock',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpDockComponent],
  templateUrl: './stacked-bottom-dock.component.html',
  styleUrl: './stacked-bottom-dock.component.scss'
})
export class GpLayoutStackedBottomDockComponent {
  @Input() brandName = 'Dock Space';
  @Input() activeTab = 'Live Grid';
}
