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
import { GpIcon } from '@generatedpixel/gp-ui';

export interface GpGradientSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-gradient',
  standalone: true,
  imports: [CommonModule, GpIcon],
  templateUrl: './sidebar-gradient.html',
  styleUrl: './sidebar-gradient.scss'
})
export class GpLayoutSidebarGradient {
  public brandName = input<string>('');
  public brandIcon = input<string>('star');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpGradientSidebarNavEntry[]>([]);

  public navItemClick = output<GpGradientSidebarNavEntry>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public brandTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentBrand = contentChild<TemplateRef<any>>('brand');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveBrand = computed(() => this.brandTemplate() || this.contentBrand());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
