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

export interface GpMinimalNavEntry {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-minimal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-minimal.component.html',
  styleUrl: './sidebar-minimal.component.scss'
})
export class GpLayoutSidebarMinimalComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpMinimalNavEntry[]>([]);

  public navItemClick = output<GpMinimalNavEntry>();

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
