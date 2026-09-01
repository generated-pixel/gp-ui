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
import { GpIconComponent, GpBadgeComponent, GpButtonComponent } from '@generatedpixel/gp-ui';

export interface GpDualTier1Item {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

export interface GpDualTier2Item {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-dual',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpButtonComponent],
  templateUrl: './sidebar-dual.component.html',
  styleUrl: './sidebar-dual.component.scss'
})
export class GpLayoutSidebarDualComponent {
  public activeTier1Id = input<string>('');
  public subnavTitle = input<string>('');
  public subnavBadge = input<string>('');
  public activeTier2Id = input<string>('');
  public title = input<string>('');

  public tier1Items = input<GpDualTier1Item[]>([]);
  public tier2Items = input<GpDualTier2Item[]>([]);

  public tier1Click = output<GpDualTier1Item>();
  public tier2Click = output<GpDualTier2Item>();

  public tier1Template = input<TemplateRef<any> | undefined>(undefined);
  public tier2Template = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentTier1 = contentChild<TemplateRef<any>>('tier1');
  public contentTier2 = contentChild<TemplateRef<any>>('tier2');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveTier1 = computed(() => this.tier1Template() || this.contentTier1());

  public effectiveTier2 = computed(() => this.tier2Template() || this.contentTier2());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
