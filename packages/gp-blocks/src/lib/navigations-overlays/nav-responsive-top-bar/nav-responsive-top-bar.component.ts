import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public brandTemplate?: TemplateRef<any>;
  @Input() public navTemplate?: TemplateRef<any>;
  @Input() public searchTemplate?: TemplateRef<any>;
  @Input() public userTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('brand') public contentBrand?: TemplateRef<any>;
  @ContentChild('nav') public contentNav?: TemplateRef<any>;
  @ContentChild('search') public contentSearch?: TemplateRef<any>;
  @ContentChild('user') public contentUser?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveBrand(): TemplateRef<any> | undefined {
    return this.brandTemplate || this.contentBrand;
  }

  public get effectiveNav(): TemplateRef<any> | undefined {
    return this.navTemplate || this.contentNav;
  }

  public get effectiveSearch(): TemplateRef<any> | undefined {
    return this.searchTemplate || this.contentSearch;
  }

  public get effectiveUser(): TemplateRef<any> | undefined {
    return this.userTemplate || this.contentUser;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
