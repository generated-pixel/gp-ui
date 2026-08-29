import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-four-column-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './four-column-grid.component.html',
  styleUrl: './four-column-grid.component.scss'
})
export class GpLayoutFourColumnGridComponent {
  public col1Title = input<string>('');
  public col1Badge = input<string>('');
  public col2Title = input<string>('');
  public col2Badge = input<string>('');
  public col3Title = input<string>('');
  public col3Badge = input<string>('');
  public col4Title = input<string>('');
  public col4Badge = input<string>('');
}
