import { Component, input, output, TemplateRef, ViewEncapsulation, contentChild, viewChild, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpDividerComponent, GpPopoverComponent } from '@generatedpixel/gp-ui';

export interface GpDropdownMenuItem {
  id: string;
  icon?: string;
  label: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-nav-dropdown-action-menu',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpDividerComponent, GpPopoverComponent],
  templateUrl: './nav-dropdown-action-menu.component.html',
  styleUrl: './nav-dropdown-action-menu.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavDropdownActionMenuComponent {
  private popover = viewChild(GpPopoverComponent);

  public signedInLabel = input<string>('Signed in as');
  public userEmail = input<string>('');
  public menuLabel = input<string>('Open actions');
  public primaryItems = input<GpDropdownMenuItem[]>([]);
  public dangerItems = input<GpDropdownMenuItem[]>([]);

  public itemSelect = output<GpDropdownMenuItem>();

  public userHeaderTemplate = input<TemplateRef<any> | undefined>(undefined);
  public itemTemplate = input<TemplateRef<{ $implicit: GpDropdownMenuItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentUserHeader = contentChild<TemplateRef<any>>('userHeader');
  public contentItemTemplate = contentChild<TemplateRef<{ $implicit: GpDropdownMenuItem }>>('itemTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveUserHeader = computed(() => this.userHeaderTemplate() || this.contentUserHeader());
  public effectiveItemTemplate = computed(() => this.itemTemplate() || this.contentItemTemplate());
  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public selectItem(item: GpDropdownMenuItem): void {
    this.itemSelect.emit(item);
    this.popover()?.hide();
  }
}
