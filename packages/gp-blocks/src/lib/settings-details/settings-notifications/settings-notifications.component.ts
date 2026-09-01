import { Component, input, output, TemplateRef, ElementRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpSwitchComponent } from '@generatedpixel/gp-ui';

export interface GpNotificationPreference {
  id?: string;
  title: string;
  desc: string;
  enabled: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public preferencesTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public footerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentPreferences = contentChild<TemplateRef<any>>('preferences');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentFooter = contentChild<TemplateRef<any>>('footer');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectivePreferences = computed(() => this.preferencesTemplate() || this.contentPreferences());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public effectiveFooterActions = computed<TemplateRef<any> | undefined>(() => this.footerActionsTemplate() || this.contentFooter() || this.contentActions());

  public get hasProjectedHeader(): boolean {
    return !!this.host.nativeElement.querySelector('[header], [slot="header"]');
  }

  public onToggle(item: GpNotificationPreference, enabled: boolean): void {
    this.togglePreference.emit({ item, enabled });
  }
}
