import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-floating-card',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-floating-card.component.html',
  styleUrl: './stacked-floating-card.component.scss'
})
export class GpLayoutStackedFloatingCardComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public userName = input<string>('');
  public title = input<string>('');

  public brandClick = output<void>();
  public userClick = output<void>();
}
