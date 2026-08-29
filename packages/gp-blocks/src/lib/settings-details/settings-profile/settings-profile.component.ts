import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpAvatarComponent,
  GpIconComponent,
  GpSelectComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-profile',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpAvatarComponent,
    GpIconComponent,
    GpSelectComponent
  ],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.scss'
})
export class GpSettingsProfileComponent {
  @Input() title = 'Public Profile';
  @Input() subtitle = 'This information will be displayed publicly to collaborators in your team.';
  @Input() userName = 'Jane Doe';
  @Input() firstName = 'Jane';
  @Input() lastName = 'Doe';
  @Input() email = 'jane.doe@enterprise.io';
  @Input() jobTitle = 'VP of Engineering';
  @Input() bio = 'Passionate about distributed systems, UI design systems, and frontend developer experience.';
}
