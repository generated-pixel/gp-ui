import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-nav-mega-menu-block',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './nav-mega-menu-block.component.html',
  styleUrl: './nav-mega-menu-block.component.scss'
})
export class GpNavMegaMenuBlockComponent {}
