import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-empty-states',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-empty-states.component.html',
  styleUrl: './feedback-empty-states.component.scss'
})
export class GpFeedbackEmptyStatesComponent {
  @Input() icon = 'folder-open';
  @Input() title = 'No Active Deployments Found';
  @Input() description = 'Get started by connecting your GitHub repository or creating a new cloud infrastructure cluster.';
  @Input() primaryCta = 'Create New Deployment';
}
