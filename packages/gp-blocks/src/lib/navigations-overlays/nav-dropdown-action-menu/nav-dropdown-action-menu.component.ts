import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-nav-dropdown-action-menu',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './nav-dropdown-action-menu.component.html',
  styleUrl: './nav-dropdown-action-menu.component.scss'
})
export class GpNavDropdownActionMenuComponent {}
