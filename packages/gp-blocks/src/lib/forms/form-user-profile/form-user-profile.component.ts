import { Component, input, output, signal } from '@angular/core';
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
