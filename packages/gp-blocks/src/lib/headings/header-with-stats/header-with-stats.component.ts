import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpHeaderWithStatItem {
  label: string;
  value: string;
}

@Component({
  selector: 'gp-header-with-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-with-stats.component.html',
  styleUrl: './header-with-stats.component.scss'
})
export class GpHeaderWithStatsComponent {
  public title = input<string>('');
  public description = input<string>('');
  public stats = input<GpHeaderWithStatItem[]>([]);

  public statClick = output<GpHeaderWithStatItem>();

  @Input() public titleTemplate?: TemplateRef<any>;
  @Input() public statsTemplate?: TemplateRef<any>;

  @ContentChild('title') public contentTitle?: TemplateRef<any>;
  @ContentChild('stats') public contentStats?: TemplateRef<any>;

  public get effectiveTitle(): TemplateRef<any> | undefined {
    return this.titleTemplate || this.contentTitle;
  }

  public get effectiveStats(): TemplateRef<any> | undefined {
    return this.statsTemplate || this.contentStats;
  }
}
