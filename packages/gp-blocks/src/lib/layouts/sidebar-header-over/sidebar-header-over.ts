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
import { GpIcon, GpAvatar } from '@generatedpixel/gp-ui';

export interface GpHeaderOverNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-header-over',
  standalone: true,
  imports: [CommonModule, GpIcon, GpAvatar],
  templateUrl: './sidebar-header-over.html',
  styleUrl: './sidebar-header-over.scss'
})
export class GpLayoutSidebarHeaderOver {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public userName = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpHeaderOverNavEntry[]>([]);

  public navItemClick = output<GpHeaderOverNavEntry>();
  public userClick = output<void>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
