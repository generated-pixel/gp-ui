import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-three-column-workspace',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './three-column-workspace.component.html',
  styleUrl: './three-column-workspace.component.scss'
})
export class GpLayoutThreeColumnWorkspaceComponent {
  public explorerTitle = input<string>('EXPLORER');
  public activeFileName = input<string>('button.component.ts');
}
