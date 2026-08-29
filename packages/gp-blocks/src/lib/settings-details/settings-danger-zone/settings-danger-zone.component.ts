import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-danger-zone',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  templateUrl: './settings-danger-zone.component.html',
  styleUrl: './settings-danger-zone.component.scss'
})
export class GpSettingsDangerZoneComponent {
  @Input() title = 'Danger Zone';
  @Input() subtitle = 'Irreversible and destructive actions for this account.';
}
