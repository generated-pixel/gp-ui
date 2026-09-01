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
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

export interface GpStackedNavLink {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-classic',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-classic.component.html',
  styleUrl: './stacked-classic.component.scss'
})
export class GpLayoutStackedClassicComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public userName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpStackedNavLink[]>([]);

  public navItemClick = output<GpStackedNavLink>();
  public userClick = output<void>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public headerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public userTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentHeaderActions = contentChild<TemplateRef<any>>('headerActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');
  public contentUser = contentChild<TemplateRef<any>>('user');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveHeaderActions = computed<TemplateRef<any> | undefined>(
    () => this.headerActionsTemplate() || this.contentHeaderActions() || this.contentActions()
  );

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );

  public effectiveUser = computed(() => this.userTemplate() || this.contentUser());
}
