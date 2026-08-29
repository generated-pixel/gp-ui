import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-with-stats',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './header-with-stats.component.html',
  styleUrl: './header-with-stats.component.scss'
})
export class GpHeaderWithStatsComponent {
  @Input() title = 'Sales Pipeline & Deals';
  @Input() description = 'Quarterly sales performance, pipeline velocity, and deal win rates.';
}
