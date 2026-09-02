import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpButtonComponent, GpInputTextComponent, GpTextareaComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-settings-profile',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpButtonComponent, GpInputTextComponent, GpTextareaComponent],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss'
})
export class GpSettingsProfileComponent {
  public title = input<string>('Profile Information');
  public subtitle = input<string>('Update your account photo and personal details.');
  public userName = input<string>('');
  public firstName = input<string>('');
  public lastName = input<string>('');
  public email = input<string>('');
  public jobTitle = input<string>('');
  public bio = input<string>('');
  public changeAvatarLabel = input<string>('Change');
  public removeAvatarLabel = input<string>('Remove');
  public saveBtnLabel = input<string>('Save Changes');
  public cancelBtnLabel = input<string>('Cancel');

  public changeAvatar = output<void>();
  public removeAvatar = output<void>();
  public save = output<Record<string, string>>();
  public cancel = output<void>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public footerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentFooter = contentChild<TemplateRef<any>>('footer');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public effectiveFooterActions = computed<TemplateRef<any> | undefined>(
    () => this.footerActionsTemplate() || this.contentFooter() || this.contentActions()
  );

  private formValues: Record<string, string> = {};

  public onFieldChange(field: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.formValues[field] = val;
  }

  public onSave(): void {
    this.save.emit({
      firstName: this.formValues['firstName'] ?? this.firstName(),
      lastName: this.formValues['lastName'] ?? this.lastName(),
      email: this.formValues['email'] ?? this.email(),
      jobTitle: this.formValues['jobTitle'] ?? this.jobTitle(),
      bio: this.formValues['bio'] ?? this.bio()
    });
  }
}
