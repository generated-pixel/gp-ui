import { Component, input, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
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

  @Input() public col1Template?: TemplateRef<any>;
  @Input() public col2Template?: TemplateRef<any>;
  @Input() public col3Template?: TemplateRef<any>;
  @Input() public col4Template?: TemplateRef<any>;

  @ContentChild('col1') public contentCol1?: TemplateRef<any>;
  @ContentChild('col1Template') public contentCol1Tpl?: TemplateRef<any>;
  @ContentChild('col2') public contentCol2?: TemplateRef<any>;
  @ContentChild('col2Template') public contentCol2Tpl?: TemplateRef<any>;
  @ContentChild('col3') public contentCol3?: TemplateRef<any>;
  @ContentChild('col3Template') public contentCol3Tpl?: TemplateRef<any>;
  @ContentChild('col4') public contentCol4?: TemplateRef<any>;
  @ContentChild('col4Template') public contentCol4Tpl?: TemplateRef<any>;

  public get effectiveCol1(): TemplateRef<any> | undefined {
    return this.col1Template || this.contentCol1 || this.contentCol1Tpl;
  }

  public get effectiveCol2(): TemplateRef<any> | undefined {
    return this.col2Template || this.contentCol2 || this.contentCol2Tpl;
  }

  public get effectiveCol3(): TemplateRef<any> | undefined {
    return this.col3Template || this.contentCol3 || this.contentCol3Tpl;
  }

  public get effectiveCol4(): TemplateRef<any> | undefined {
    return this.col4Template || this.contentCol4 || this.contentCol4Tpl;
  }
}
