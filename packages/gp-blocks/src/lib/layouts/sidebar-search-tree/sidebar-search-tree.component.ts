import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

export interface GpTreeLeaf {
  id: string;
  label: string;
  active?: boolean;
}

export interface GpTreeNode {
  id: string;
  label: string;
  icon?: string;
  expanded?: boolean;
  children?: GpTreeLeaf[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-search-tree',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpInputTextComponent],
  templateUrl: './sidebar-search-tree.component.html',
  styleUrl: './sidebar-search-tree.component.scss'
})
export class GpLayoutSidebarSearchTreeComponent {
  public searchPlaceholder = input<string>('Filter tree...');
  public title = input<string>('');
  public catalogLabel = input<string>('');
  public activeLeafId = input<string>('');

  public treeData = input<GpTreeNode[]>([]);

  public searchQuery = signal<string>('');
  public searchChange = output<string>();
  public leafClick = output<GpTreeLeaf>();
  public nodeToggle = output<GpTreeNode>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public treeTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentTree = contentChild<TemplateRef<any>>('tree');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveTree = computed(() => this.treeTemplate() || this.contentTree());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(
    () => this.topActionsTemplate() || this.contentTopActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );

  public toggleNode(node: GpTreeNode): void {
    node.expanded = !node.expanded;
    this.nodeToggle.emit(node);
  }

  public onSearch(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
