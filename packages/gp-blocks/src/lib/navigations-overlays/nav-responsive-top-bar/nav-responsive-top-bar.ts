import {
  Component,
  input,
  output,
  signal,
  computed,
  TemplateRef,
  ViewEncapsulation,
  contentChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatar, GpButton, GpIcon, GpInputText, GpMenubar, GpMenubarItem, GpToolbar } from '@generatedpixel/gp-ui';

export interface GpTopBarNavLink {
  id?: string;
  label: string;
  url?: string;
  active?: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-nav-responsive-top-bar',
  standalone: true,
  imports: [CommonModule, GpAvatar, GpButton, GpIcon, GpInputText, GpMenubar, GpToolbar],
  host: { class: 'gp-nav-responsive-topbar-host' },
  templateUrl: './nav-responsive-top-bar.html',
  styleUrl: './nav-responsive-top-bar.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavResponsiveTopBar {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public userName = input<string>('');
  public links = input<GpTopBarNavLink[]>([]);
  public activeLinkId = input<string>('');
  public searchPlaceholder = input<string>('Search anything...');

  public searchQuery = signal<string>('');
  public menuItems = computed<GpMenubarItem[]>(() =>
    this.links().map((link) => ({
      label: link.label,
      url: link.url,
      active: link.id === this.activeLinkId() || link.active,
      command: () => this.linkClick.emit(link)
    }))
  );

  public linkClick = output<GpTopBarNavLink>();
  public searchChange = output<string>();
  public notificationsClick = output<void>();
  public profileClick = output<void>();

  public brandTemplate = input<TemplateRef<any> | undefined>(undefined);
  public navTemplate = input<TemplateRef<any> | undefined>(undefined);
  public searchTemplate = input<TemplateRef<any> | undefined>(undefined);
  public userTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentBrand = contentChild<TemplateRef<any>>('brand');
  public contentNav = contentChild<TemplateRef<any>>('nav');
  public contentSearch = contentChild<TemplateRef<any>>('search');
  public contentUser = contentChild<TemplateRef<any>>('user');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveBrand = computed(() => this.brandTemplate() || this.contentBrand());

  public effectiveNav = computed(() => this.navTemplate() || this.contentNav());

  public effectiveSearch = computed(() => this.searchTemplate() || this.contentSearch());

  public effectiveUser = computed(() => this.userTemplate() || this.contentUser());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
