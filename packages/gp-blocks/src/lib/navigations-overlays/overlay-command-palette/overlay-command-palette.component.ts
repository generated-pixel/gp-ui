import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-overlay-command-palette',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './overlay-command-palette.component.html',
  styleUrl: './overlay-command-palette.component.scss'
})
export class GpOverlayCommandPaletteComponent {}
