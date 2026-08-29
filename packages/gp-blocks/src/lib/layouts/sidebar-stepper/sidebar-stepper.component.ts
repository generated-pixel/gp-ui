import { Component, input, output } from '@angular/core';
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
}
