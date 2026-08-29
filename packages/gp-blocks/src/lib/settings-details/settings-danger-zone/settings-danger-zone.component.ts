import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpButtonVariant } from '@generatedpixel/gp-ui';

export interface GpDangerAction {
  id: string;
  title: string;
  desc: string;
  buttonLabel: string;
  buttonVariant?: GpButtonVariant;
}

@Component({
  selector: 'gp-settings-danger-zone',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  templateUrl: './settings-danger-zone.component.html',
  styleUrl: './settings-danger-zone.component.scss'
})
export class GpSettingsDangerZoneComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public actions = input<GpDangerAction[]>([]);

  public actionClick = output<GpDangerAction>();
}
