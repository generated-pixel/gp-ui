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
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDockItem {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-bottom-dock',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './stacked-bottom-dock.component.html',
  styleUrl: './stacked-bottom-dock.component.scss'
})
export class GpLayoutStackedBottomDockComponent {
  public brandName = input<string>('');
  public activeTab = input<string>('');
  public activeDockId = input<string>('');

  public dockItems = input<GpDockItem[]>([]);

  public dockItemClick = output<GpDockItem>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public dockTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentDock = contentChild<TemplateRef<any>>('dock');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveDock = computed(() => this.dockTemplate() || this.contentDock());

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
