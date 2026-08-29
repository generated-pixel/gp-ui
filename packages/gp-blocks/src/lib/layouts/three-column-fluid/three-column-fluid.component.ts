import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-three-column-fluid',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './three-column-fluid.component.html',
  styleUrl: './three-column-fluid.component.scss'
})
export class GpLayoutThreeColumnFluidComponent {
  @Input() leftTitle = 'Navigation';
  @Input() rightTitle = 'Inspector';
  @Input() mainTitle = 'Primary Workspace';
  @Input() mainSubtitle = 'Three-column fluid layout with responsive collapsible panels.';
  @Input() searchPlaceholder = 'Search in workspace...';
  @Input() leftCollapsed = false;
  @Input() rightCollapsed = false;

  @Output() actionClick = new EventEmitter<string>();

  toggleLeft() {
    this.leftCollapsed = !this.leftCollapsed;
  }

  toggleRight() {
    this.rightCollapsed = !this.rightCollapsed;
  }
}
