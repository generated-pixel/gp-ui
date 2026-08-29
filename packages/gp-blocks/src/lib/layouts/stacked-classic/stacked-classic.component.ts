import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-classic',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-classic.component.html',
  styleUrl: './stacked-classic.component.scss'
})
export class GpLayoutStackedClassicComponent {
  @Input() brandName = 'Orbit Portal';
  @Input() userName = 'Graeme Gorman';
  @Input() title = 'Dashboard Overview';
}
