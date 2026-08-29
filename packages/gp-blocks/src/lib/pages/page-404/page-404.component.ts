import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-404',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss'
})
export class GpPage404Component {
  public code = input<string>('404');
  public title = input<string>('');
  public description = input<string>('');
  public goBackBtnLabel = input<string>('Go Back');
  public returnHomeBtnLabel = input<string>('Return Home');

  public goBack = output<void>();
  public returnHome = output<void>();
}
