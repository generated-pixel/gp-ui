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
import { GpButton, GpButtonVariant } from '@generatedpixel/gp-ui';

export interface GpDangerAction {
  id: string;
  title: string;
  desc: string;
  buttonLabel: string;
  buttonVariant?: GpButtonVariant;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-settings-danger-zone',
  standalone: true,
  imports: [CommonModule, GpButton],
  templateUrl: './settings-danger-zone.html',
  styleUrl: './settings-danger-zone.scss'
})
export class GpSettingsDangerZone {
  public title = input<string>('Danger Zone');
  public subtitle = input<string>('Irreversible and destructive actions for this account.');
  public actions = input<GpDangerAction[]>([]);

  public actionClick = output<GpDangerAction>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
