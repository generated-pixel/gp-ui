import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

export interface GpTopBarNavLink {
  id?: string;
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  selector: 'gp-nav-responsive-top-bar',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './nav-responsive-top-bar.component.html',
  styleUrl: './nav-responsive-top-bar.component.scss'
})
export class GpNavResponsiveTopBarComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public userName = input<string>('');
  public links = input<GpTopBarNavLink[]>([]);
  public activeLinkId = input<string>('');
  public searchPlaceholder = input<string>('Search anything...');

  public searchQuery = signal<string>('');

  public linkClick = output<GpTopBarNavLink>();
  public searchChange = output<string>();
  public notificationsClick = output<void>();
  public profileClick = output<void>();

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
