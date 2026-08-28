import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  model,
  contentChildren,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-step',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />'
})
export class GpStepComponent extends GpBaseComponent {
  public label = input<string>('');
  public icon = input<string>('');
  public completed = model<boolean>(false);
  public active = model<boolean>(false);
}

@Component({
  selector: 'gp-stepper',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class GpStepperComponent extends GpBaseComponent {
  public steps = contentChildren(GpStepComponent);

  public activeStep = model<number>(0);
  public orientation = input<'horizontal' | 'vertical'>('horizontal');
  public linear = input<boolean>(false);

  constructor() {
    super();
    effect(() => {
      const stepList = this.steps();
      const currentIdx = this.activeStep();
      stepList.forEach((step, i) => {
        step.active.set(i === currentIdx);
        step.completed.set(i < currentIdx);
      });
    });
  }

  public selectStep(idx: number): void {
    if (this.linear() && idx > this.activeStep() + 1) {
      return;
    }
    this.activeStep.set(idx);
  }

  public next(): void {
    if (this.activeStep() < this.steps().length - 1) {
      this.selectStep(this.activeStep() + 1);
    }
  }

  public prev(): void {
    if (this.activeStep() > 0) {
      this.selectStep(this.activeStep() - 1);
    }
  }
}
