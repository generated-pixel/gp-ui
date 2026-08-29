import { Component, Input } from '@angular/core';
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
  @Input() brandName = 'Float System';
  @Input() userName = 'Graeme G.';
  @Input() title = 'Workspace Control Deck';
}
