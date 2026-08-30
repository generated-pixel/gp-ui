import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-404',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss'
})
export class GpPage404Component {
  public code = input<string>('404');
  public title = input<string>('');
  public description = input<string>('');
  public goBackBtnLabel = input<string>('Go Back');
  public returnHomeBtnLabel = input<string>('Return Home');

  public goBack = output<void>();
  public returnHome = output<void>();

  @Input() public codeTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('code') public contentCode?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveCode(): TemplateRef<any> | undefined {
    return this.codeTemplate || this.contentCode;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
