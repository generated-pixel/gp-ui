import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-profile',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpButtonComponent],
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
