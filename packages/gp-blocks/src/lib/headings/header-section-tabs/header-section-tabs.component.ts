import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-section-tabs',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './header-section-tabs.component.html',
  styleUrl: './header-section-tabs.component.scss'
})
export class GpHeaderSectionTabsComponent {
  @Input() title = 'Connected Integrations';
  @Input() description = 'Manage third-party tools, OAuth providers, and automated webhook pipelines.';
}
