import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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
  public title = input<string>('Danger Zone');
  public subtitle = input<string>('Irreversible and destructive actions for this account.');
  public actions = input<GpDangerAction[]>([]);

  public actionClick = output<GpDangerAction>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
