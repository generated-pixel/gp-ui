import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-500',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-500.component.html',
  styleUrl: './page-500.component.scss'
})
export class GpPage500Component {
  public code = input<string>('500');
  public title = input<string>('');
  public description = input<string>('');
  public supportBtnLabel = input<string>('Contact Support');
  public retryBtnLabel = input<string>('Try Again');

  public contactSupport = output<void>();
  public retry = output<void>();
}
