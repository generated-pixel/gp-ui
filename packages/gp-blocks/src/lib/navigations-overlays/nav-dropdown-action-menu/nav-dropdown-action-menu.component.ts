import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDropdownMenuItem {
  id: string;
  icon?: string;
  label: string;
}

@Component({
  selector: 'gp-nav-dropdown-action-menu',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './nav-dropdown-action-menu.component.html',
  styleUrl: './nav-dropdown-action-menu.component.scss'
})
export class GpNavDropdownActionMenuComponent {
  public signedInLabel = input<string>('Signed in as');
  public userEmail = input<string>('');
  public primaryItems = input<GpDropdownMenuItem[]>([]);
  public dangerItems = input<GpDropdownMenuItem[]>([]);

  public itemSelect = output<GpDropdownMenuItem>();
}
