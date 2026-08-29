import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-two-column-split',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './two-column-split.component.html',
  styleUrl: './two-column-split.component.scss'
})
export class GpLayoutTwoColumnSplitComponent {
  @Input() splitRatio: '50/50' | '60/40' = '60/40';
  @Input() primaryTitle = 'Configuration & Input';
  @Input() primaryBadge = 'Editing';
  @Input() primaryDescription = 'Make changes in the primary input panel.';
  @Input() secondaryTitle = 'Live Output & Results';
  @Input() secondaryDescription = 'Synchronous output stream and inspector.';
}
