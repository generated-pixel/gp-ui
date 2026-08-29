import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

export interface GpStickyBarNavLink {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-stacked-sticky-action-bar',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './stacked-sticky-action-bar.component.html',
  styleUrl: './stacked-sticky-action-bar.component.scss'
})
export class GpLayoutStackedStickyActionBarComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public pageTitle = input<string>('');
  public itemCount = input<number>(0);
  public searchPlaceholder = input<string>('Filter list...');
  public addBtnLabel = input<string>('Add Record');
  public activeNavId = input<string>('');

  public navLinks = input<GpStickyBarNavLink[]>([]);

  public searchQuery = signal<string>('');
  public searchChange = output<string>();
  public addClick = output<void>();
  public navLinkClick = output<GpStickyBarNavLink>();

  public onSearch(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
