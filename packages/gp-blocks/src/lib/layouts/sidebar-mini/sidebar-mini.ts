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
import { GpAvatar, GpIcon } from '@generatedpixel/gp-ui';

export interface GpMiniSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-mini',
  standalone: true,
  imports: [CommonModule, GpAvatar, GpIcon],
  templateUrl: './sidebar-mini.html',
  styleUrl: './sidebar-mini.scss'
})
export class GpLayoutSidebarMini {
  public brandIcon = input<string>('box');
  public title = input<string>('');
  public activeNavId = input<string>('');
  public userName = input<string>('User');

  public navItems = input<GpMiniSidebarNavEntry[]>([]);

  public navItemClick = output<GpMiniSidebarNavEntry>();
  public userClick = output<void>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
