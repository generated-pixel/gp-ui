import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

export interface GpStickyBarNavLink {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-sticky-action-bar',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent, GpInputTextComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionBarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentActionBar = contentChild<TemplateRef<any>>('actionBar');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveActionBar = computed<TemplateRef<any> | undefined>(
    () => this.actionBarTemplate() || this.contentActionBar() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );

  public onSearch(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
