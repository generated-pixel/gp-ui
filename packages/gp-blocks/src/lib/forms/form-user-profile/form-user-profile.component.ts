import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpSelectComponent,
  GpCheckboxComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpSelectComponent,
    GpCheckboxComponent
  ],
  templateUrl: './form-user-profile.component.html',
  styleUrl: './form-user-profile.component.scss'
})
export class GpFormUserProfileComponent {
  @Input() title = 'Personal Information';
  @Input() subtitle = 'Update your contact details and public bio information.';
}
