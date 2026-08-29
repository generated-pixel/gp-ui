import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-three-column-workspace',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './three-column-workspace.component.html',
  styleUrl: './three-column-workspace.component.scss'
})
export class GpLayoutThreeColumnWorkspaceComponent {
  @Input() explorerTitle = 'Explorer';
  @Input() activeFileName = 'button.component.ts';
}
