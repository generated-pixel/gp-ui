import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public cardTemplate = input<TemplateRef<{ $implicit: GpCardGridItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentCardTemplate = contentChild<TemplateRef<{ $implicit: GpCardGridItem }>>('cardTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveCardTemplate = computed(() => this.cardTemplate() || this.contentCardTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
