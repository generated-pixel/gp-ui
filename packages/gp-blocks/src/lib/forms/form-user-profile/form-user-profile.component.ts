import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-user-profile',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  templateUrl: './form-user-profile.component.html',
  styleUrl: './form-user-profile.component.scss'
})
export class GpFormUserProfileComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public saveBtnLabel = input<string>('Save Profile');
  public cancelBtnLabel = input<string>('Cancel');

  public firstName = signal<string>('');
  public lastName = signal<string>('');
  public email = signal<string>('');
  public phone = signal<string>('');
  public bio = signal<string>('');

  public save = output<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
  }>();
  public cancel = output<void>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public formTemplate?: TemplateRef<any>;
  @Input() public footerActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('form') public contentForm?: TemplateRef<any>;
  @ContentChild('footerActions') public contentFooterActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveForm(): TemplateRef<any> | undefined {
    return this.formTemplate || this.contentForm;
  }

  public get effectiveFooterActions(): TemplateRef<any> | undefined {
    return this.footerActionsTemplate || this.contentFooterActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSave(): void {
    this.save.emit({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      phone: this.phone(),
      bio: this.bio()
    });
  }
}
