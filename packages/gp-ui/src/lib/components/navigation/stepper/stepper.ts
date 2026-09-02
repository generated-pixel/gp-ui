import { GpBase } from '../../../base/gp-base';
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

import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-step',
  standalone: true,
  imports: [],
  templateUrl: './step.html',
  styleUrl: './step.scss'
})
export class GpStep extends GpBase {
  public label = input<string>('');
  public icon = input<string>('');
  public completed = model<boolean>(false);
  public active = model<boolean>(false);
}

@Component({
  selector: 'gp-stepper',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss'
})
export class GpStepper extends GpBase {
  public steps = contentChildren(GpStep);

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
