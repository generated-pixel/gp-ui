import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public actionBarTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('actionBar') public contentActionBar?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveActionBar(): TemplateRef<any> | undefined {
    return this.actionBarTemplate || this.contentActionBar || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }

  public onSearch(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
