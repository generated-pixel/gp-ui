import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpInputTextComponent, GpTextareaComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-user-profile',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpInputTextComponent, GpTextareaComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public formTemplate = input<TemplateRef<any> | undefined>(undefined);
  public footerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentForm = contentChild<TemplateRef<any>>('form');
  public contentFooterActions = contentChild<TemplateRef<any>>('footerActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveForm = computed(() => this.formTemplate() || this.contentForm());

  public effectiveFooterActions = computed<TemplateRef<any> | undefined>(
    () => this.footerActionsTemplate() || this.contentFooterActions() || this.contentActions()
  );

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

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
