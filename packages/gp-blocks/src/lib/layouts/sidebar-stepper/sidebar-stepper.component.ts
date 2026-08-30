import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpSidebarStepItem {
  number: number;
  label: string;
  completed?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-stepper',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-stepper.component.html',
  styleUrl: './sidebar-stepper.component.scss'
})
export class GpLayoutSidebarStepperComponent {
  public brandName = input<string>('');
  public currentStep = input<number>(1);
  public currentStepTitle = input<string>('');
  public currentStepSubtitle = input<string>('');

  public steps = input<GpSidebarStepItem[]>([]);

  public stepClick = output<GpSidebarStepItem>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
