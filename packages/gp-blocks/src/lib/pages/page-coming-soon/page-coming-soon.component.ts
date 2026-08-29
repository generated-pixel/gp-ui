import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-coming-soon',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-coming-soon.component.html',
  styleUrl: './page-coming-soon.component.scss'
})
export class GpPageComingSoonComponent {
  @Input() title = 'Next-Gen Workflow Engine';
  @Input() description = 'We are putting the final touches on our real-time collaborative flow orchestrator. Join our priority access waitlist today.';
}
