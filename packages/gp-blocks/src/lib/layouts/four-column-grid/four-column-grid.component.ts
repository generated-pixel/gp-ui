import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-four-column-grid',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './four-column-grid.component.html',
  styleUrl: './four-column-grid.component.scss'
})
export class GpLayoutFourColumnGridComponent {
  @Input() col1Title = 'Incoming Tasks';
  @Input() col1Badge = '5 New';
  @Input() col2Title = 'In Progress';
  @Input() col2Badge = '3 Active';
  @Input() col3Title = 'Review & QA';
  @Input() col3Badge = '2 Pending';
  @Input() col4Title = 'Completed';
  @Input() col4Badge = '18 Done';
}
