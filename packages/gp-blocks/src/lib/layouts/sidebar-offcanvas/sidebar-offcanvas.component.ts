import { Component, input, output, signal, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpOffcanvasNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-offcanvas',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './sidebar-offcanvas.component.html',
  styleUrl: './sidebar-offcanvas.component.scss'
})
export class GpLayoutSidebarOffcanvasComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpOffcanvasNavEntry[]>([]);

  public sidebarOpen = signal<boolean>(false);

  public navItemClick = output<GpOffcanvasNavEntry>();
  public openChange = output<boolean>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(() => this.topActionsTemplate() || this.contentTopActions() || this.contentActions());

  public effectiveContent = computed<TemplateRef<any> | undefined>(() => this.contentTemplate() || this.contentArea() || this.contentMain());

  public toggleSidebar(): void {
    this.sidebarOpen.update(v => {
      const next = !v;
      this.openChange.emit(next);
      return next;
    });
  }

  public closeSidebar(): void {
    this.sidebarOpen.set(false);
    this.openChange.emit(false);
  }
}
