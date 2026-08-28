import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterContentInit
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
  @Input() label = '';
  @Input() icon = '';
  @Input() override disabled = false;
  @Input() completed = false;
  @Input() active = false;
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
export class GpStepperComponent extends GpBaseComponent implements AfterContentInit {
  @ContentChildren(GpStepComponent) steps!: QueryList<GpStepComponent>;

  @Input() activeStep = 0;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() linear = false;

  @Output() activeStepChange = new EventEmitter<number>();

  ngAfterContentInit(): void {
    if (this.steps && this.steps.length > 0) {
      this.updateActiveStep(this.activeStep);
    }
  }

  public selectStep(idx: number): void {
    if (this.linear && idx > this.activeStep + 1) return;
    this.updateActiveStep(idx);
    this.activeStepChange.emit(idx);
  }

  private updateActiveStep(idx: number): void {
    this.activeStep = idx;
    this.steps.forEach((step, i) => {
      step.active = i === idx;
      if (i < idx) step.completed = true;
    });
  }

  public next(): void {
    if (this.activeStep < this.steps.length - 1) {
      this.selectStep(this.activeStep + 1);
    }
  }

  public prev(): void {
    if (this.activeStep > 0) {
      this.selectStep(this.activeStep - 1);
    }
  }
}
