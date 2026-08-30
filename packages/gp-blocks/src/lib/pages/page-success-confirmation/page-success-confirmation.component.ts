import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-success-confirmation',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-success-confirmation.component.html',
  styleUrl: './page-success-confirmation.component.scss'
})
export class GpPageSuccessConfirmationComponent {
  public icon = input<string>('check-circle');
  public title = input<string>('');
  public description = input<string>('');
  public orderNumberLabel = input<string>('Order Number');
  public orderNumber = input<string>('');
  public emailLabel = input<string>('Confirmation Email');
  public email = input<string>('');
  public secondaryBtnLabel = input<string>('View Dashboard');
  public primaryBtnLabel = input<string>('Download Receipt');

  public secondaryAction = output<void>();
  public primaryAction = output<void>();

  @Input() public iconTemplate?: TemplateRef<any>;
  @Input() public detailsTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('icon') public contentIcon?: TemplateRef<any>;
  @ContentChild('details') public contentDetails?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveIcon(): TemplateRef<any> | undefined {
    return this.iconTemplate || this.contentIcon;
  }

  public get effectiveDetails(): TemplateRef<any> | undefined {
    return this.detailsTemplate || this.contentDetails;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
