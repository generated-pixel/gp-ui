import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-empty-states',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-empty-states.component.html',
  styleUrl: './feedback-empty-states.component.scss'
})
export class GpFeedbackEmptyStatesComponent {
  public icon = input<string>('inbox');
  public title = input<string>('');
  public description = input<string>('');
  public primaryCta = input<string>('');
  public secondaryCta = input<string>('');

  public primaryClick = output<void>();
  public secondaryClick = output<void>();
}
