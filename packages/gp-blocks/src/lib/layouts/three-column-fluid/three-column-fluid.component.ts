import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-three-column-fluid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './three-column-fluid.component.html',
  styleUrl: './three-column-fluid.component.scss'
})
export class GpLayoutThreeColumnFluidComponent {
  public leftTitle = input<string>('');
  public mainTitle = input<string>('');
  public mainSubtitle = input<string>('');
  public rightTitle = input<string>('');
  public searchPlaceholder = input<string>('Search workspace...');

  public leftCollapsed = signal<boolean>(false);
  public rightCollapsed = signal<boolean>(false);

  public actionClick = output<string>();

  public toggleLeft(): void {
    this.leftCollapsed.update(c => !c);
  }

  public toggleRight(): void {
    this.rightCollapsed.update(c => !c);
  }
}
