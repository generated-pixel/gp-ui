import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpButtonSeverity } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-confirm-modals',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-confirm-modals.component.html',
  styleUrl: './feedback-confirm-modals.component.scss'
})
export class GpFeedbackConfirmModalsComponent {
  public icon = input<string>('trash');
  public iconSeverity = input<string>('icon-danger');
  public title = input<string>('');
  public message = input<string>('');
  public confirmBtnLabel = input<string>('Confirm');
  public cancelBtnLabel = input<string>('Cancel');
  public confirmSeverity = input<GpButtonSeverity>('danger');

  public confirm = output<void>();
  public cancel = output<void>();

  @Input() public iconTemplate?: TemplateRef<any>;
  @Input() public bodyTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('icon') public contentIcon?: TemplateRef<any>;
  @ContentChild('body') public contentBody?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveIcon(): TemplateRef<any> | undefined {
    return this.iconTemplate || this.contentIcon;
  }

  public get effectiveBody(): TemplateRef<any> | undefined {
    return this.bodyTemplate || this.contentBody;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
