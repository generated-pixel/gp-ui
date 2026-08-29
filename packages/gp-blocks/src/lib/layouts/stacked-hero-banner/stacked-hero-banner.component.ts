import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-hero-banner',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './stacked-hero-banner.component.html',
  styleUrl: './stacked-hero-banner.component.scss'
})
export class GpLayoutStackedHeroBannerComponent {
  @Input() brandName = 'Quantum Cloud';
  @Input() heroTitle = 'Supercharge Your Enterprise Operations';
  @Input() heroSubtitle = 'Deploy scalable microservices and monitor real-time event pipelines with zero downtime.';
  @Input() primaryCta = 'Get Started Free';
  @Input() secondaryCta = 'Documentation';
}
