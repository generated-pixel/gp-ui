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
import { GpIcon, GpBadge, GpButton } from '@generatedpixel/gp-ui';

export interface GpLightSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  badge?: string;
  badgeSeverity?: 'success' | 'primary' | 'secondary' | 'warning' | 'danger';
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-light',
  standalone: true,
  imports: [CommonModule, GpIcon, GpBadge, GpButton],
  templateUrl: './sidebar-light.html',
  styleUrl: './sidebar-light.scss'
})
export class GpLayoutSidebarLight {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpLightSidebarNavEntry[]>([]);

  public upgradeTitle = input<string>('');
  public upgradeText = input<string>('');
  public upgradeBtnLabel = input<string>('');

  public navItemClick = output<GpLightSidebarNavEntry>();
  public upgradeClick = output<void>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public brandTemplate = input<TemplateRef<any> | undefined>(undefined);
  public navTemplate = input<TemplateRef<any> | undefined>(undefined);
  public upgradeTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentBrand = contentChild<TemplateRef<any>>('brand');
  public contentNav = contentChild<TemplateRef<any>>('nav');
  public contentUpgrade = contentChild<TemplateRef<any>>('upgrade');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveBrand = computed(() => this.brandTemplate() || this.contentBrand());

  public effectiveNav = computed(() => this.navTemplate() || this.contentNav());

  public effectiveUpgrade = computed(() => this.upgradeTemplate() || this.contentUpgrade());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
