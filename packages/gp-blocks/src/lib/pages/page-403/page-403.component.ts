import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-403',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  templateUrl: './page-403.component.html',
  styleUrl: './page-403.component.scss'
})
export class GpPage403Component {
  public code = input<string>('403');
  public title = input<string>('');
  public description = input<string>('');
  public returnHomeBtnLabel = input<string>('Return to Dashboard');
  public requestAccessBtnLabel = input<string>('Request Access');

  public returnHome = output<void>();
  public requestAccess = output<void>();

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
