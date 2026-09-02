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

export interface GpSidebarStepItem {
  number: number;
  label: string;
  completed?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-stepper',
  standalone: true,
  imports: [CommonModule, GpIcon],
  templateUrl: './sidebar-stepper.html',
  styleUrl: './sidebar-stepper.scss'
})
export class GpLayoutSidebarStepper {
  public brandName = input<string>('');
  public currentStep = input<number>(1);
  public currentStepTitle = input<string>('');
  public currentStepSubtitle = input<string>('');

  public steps = input<GpSidebarStepItem[]>([]);

  public stepClick = output<GpSidebarStepItem>();

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
