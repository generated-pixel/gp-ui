import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-nav-tab-navigation',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './nav-tab-navigation.component.html',
  styleUrl: './nav-tab-navigation.component.scss'
})
export class GpNavTabNavigationComponent {}
