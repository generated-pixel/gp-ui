import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpCardGridItem {
  id?: string;
  icon: string;
  title: string;
  desc: string;
  status: string;
  meta: string;
}

@Component({
  selector: 'gp-list-card-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './list-card-grid.component.html',
  styleUrl: './list-card-grid.component.scss'
})
export class GpListCardGridComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public createBtnLabel = input<string>('Create New');
  public cards = input<GpCardGridItem[]>([]);

  public createClick = output<void>();
  public cardClick = output<GpCardGridItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public cardTemplate?: TemplateRef<{ $implicit: GpCardGridItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('cardTemplate') public contentCardTemplate?: TemplateRef<{ $implicit: GpCardGridItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveCardTemplate(): TemplateRef<{ $implicit: GpCardGridItem }> | undefined {
    return this.cardTemplate || this.contentCardTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
