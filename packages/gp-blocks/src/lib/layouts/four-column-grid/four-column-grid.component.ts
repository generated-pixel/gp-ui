import { Component, input, TemplateRef, contentChild, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-four-column-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './four-column-grid.component.html',
  styleUrl: './four-column-grid.component.scss'
})
export class GpLayoutFourColumnGridComponent {
  public col1Title = input<string>('Column 1');
  public col1Badge = input<string>('');
  public col2Title = input<string>('Column 2');
  public col2Badge = input<string>('');
  public col3Title = input<string>('Column 3');
  public col3Badge = input<string>('');
  public col4Title = input<string>('Column 4');
  public col4Badge = input<string>('');

  public col1Template = input<TemplateRef<any> | undefined>(undefined);
  public col2Template = input<TemplateRef<any> | undefined>(undefined);
  public col3Template = input<TemplateRef<any> | undefined>(undefined);
  public col4Template = input<TemplateRef<any> | undefined>(undefined);

  public contentCol1 = contentChild<TemplateRef<any>>('col1');
  public contentCol1Tpl = contentChild<TemplateRef<any>>('col1Template');
  public contentCol2 = contentChild<TemplateRef<any>>('col2');
  public contentCol2Tpl = contentChild<TemplateRef<any>>('col2Template');
  public contentCol3 = contentChild<TemplateRef<any>>('col3');
  public contentCol3Tpl = contentChild<TemplateRef<any>>('col3Template');
  public contentCol4 = contentChild<TemplateRef<any>>('col4');
  public contentCol4Tpl = contentChild<TemplateRef<any>>('col4Template');

  public effectiveCol1 = computed<TemplateRef<any> | undefined>(() => this.col1Template() || this.contentCol1() || this.contentCol1Tpl());

  public effectiveCol2 = computed<TemplateRef<any> | undefined>(() => this.col2Template() || this.contentCol2() || this.contentCol2Tpl());

  public effectiveCol3 = computed<TemplateRef<any> | undefined>(() => this.col3Template() || this.contentCol3() || this.contentCol3Tpl());

  public effectiveCol4 = computed<TemplateRef<any> | undefined>(() => this.col4Template() || this.contentCol4() || this.contentCol4Tpl());
}
