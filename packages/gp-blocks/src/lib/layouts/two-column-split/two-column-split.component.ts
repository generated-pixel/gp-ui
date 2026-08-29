import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-two-column-split',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './two-column-split.component.html',
  styleUrl: './two-column-split.component.scss'
})
export class GpLayoutTwoColumnSplitComponent {
  public splitRatio = input<'50/50' | '60/40'>('50/50');
  public primaryTitle = input<string>('');
  public primaryBadge = input<string>('');
  public primaryDescription = input<string>('');
  public secondaryTitle = input<string>('');
  public secondaryDescription = input<string>('');
}
