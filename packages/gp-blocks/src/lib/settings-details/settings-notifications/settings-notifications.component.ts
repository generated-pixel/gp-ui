import { Component, input, output, Input, TemplateRef, ContentChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpSwitchComponent } from '@generatedpixel/gp-ui';

export interface GpNotificationPreference {
  id?: string;
  title: string;
  desc: string;
  enabled: boolean;
}

@Component({
  selector: 'gp-settings-notifications',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpSwitchComponent],
  templateUrl: './settings-notifications.component.html',
  styleUrl: './settings-notifications.component.scss'
})
export class GpSettingsNotificationsComponent {
  public constructor(private readonly host: ElementRef<HTMLElement>) {}

  public title = input<string>('Notification Preferences');
  public subtitle = input<string>('Decide how you would like to be alerted about workspace activity and security.');
  public saveBtnLabel = input<string>('Save Preferences');
  public preferences = input<GpNotificationPreference[]>([]);

  public save = output<GpNotificationPreference[]>();
  public togglePreference = output<{ item: GpNotificationPreference; enabled: boolean }>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public preferencesTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;
  @Input() public footerActionsTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('preferences') public contentPreferences?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('footer') public contentFooter?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectivePreferences(): TemplateRef<any> | undefined {
    return this.preferencesTemplate || this.contentPreferences;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public get effectiveFooterActions(): TemplateRef<any> | undefined {
    return this.footerActionsTemplate || this.contentFooter || this.contentActions;
  }

  public get hasProjectedHeader(): boolean {
    return !!this.host.nativeElement.querySelector('[header], [slot="header"]');
  }

  public onToggle(item: GpNotificationPreference, enabled: boolean): void {
    this.togglePreference.emit({ item, enabled });
  }
}
