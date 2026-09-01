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
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpPinnedStatusNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-pinned-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-pinned-status.component.html',
  styleUrl: './sidebar-pinned-status.component.scss'
})
export class GpLayoutSidebarPinnedStatusComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public systemStatus = input<string>('');
  public uptimeText = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpPinnedStatusNavEntry[]>([]);

  public navItemClick = output<GpPinnedStatusNavEntry>();
  public statusClick = output<void>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public statusTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentStatus = contentChild<TemplateRef<any>>('status');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveStatus = computed(() => this.statusTemplate() || this.contentStatus());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
