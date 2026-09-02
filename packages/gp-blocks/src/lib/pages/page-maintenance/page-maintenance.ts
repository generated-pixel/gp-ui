import {
  Component,
  input,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon, GpBadge, GpBadgeSeverity } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-page-maintenance',
  standalone: true,
  imports: [CommonModule, GpIcon, GpBadge],
  templateUrl: './page-maintenance.html',
  styleUrl: './page-maintenance.scss'
})
export class GpPageMaintenance {
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('warning');
  public icon = input<string>('sliders');
  public title = input<string>('');
  public description = input<string>('');
  public estimatedUptimeLabel = input<string>('Estimated Completion');
  public estimatedUptime = input<string>('');

  public iconTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentIcon = contentChild<TemplateRef<any>>('icon');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveIcon = computed(() => this.iconTemplate() || this.contentIcon());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
