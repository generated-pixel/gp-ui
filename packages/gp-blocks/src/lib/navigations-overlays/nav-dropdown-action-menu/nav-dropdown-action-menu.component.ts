import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public userHeaderTemplate?: TemplateRef<any>;
  @Input() public itemTemplate?: TemplateRef<{ $implicit: GpDropdownMenuItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('userHeader') public contentUserHeader?: TemplateRef<any>;
  @ContentChild('itemTemplate') public contentItemTemplate?: TemplateRef<{ $implicit: GpDropdownMenuItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveUserHeader(): TemplateRef<any> | undefined {
    return this.userHeaderTemplate || this.contentUserHeader;
  }

  public get effectiveItemTemplate(): TemplateRef<{ $implicit: GpDropdownMenuItem }> | undefined {
    return this.itemTemplate || this.contentItemTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
