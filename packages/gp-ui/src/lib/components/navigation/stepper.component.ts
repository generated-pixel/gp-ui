import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-step',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (active) {
      <div class="gp-step-content" role="tabpanel">
        <ng-content />
      </div>
    }
  `
})
export class GpStepComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() completed = false;
  @Input() active = false;
}

@Component({
  selector: 'gp-stepper',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-stepper" [class.gp-stepper-vertical]="orientation === 'vertical'">
      <div class="gp-stepper-header-container">
        @for (step of steps; track $index; let idx = $index; let last = $last) {
          <div
            class="gp-stepper-header"
            [class.gp-stepper-header-active]="step.active"
            [class.gp-stepper-header-completed]="step.completed"
            [class.gp-stepper-header-disabled]="step.disabled"
            (click)="selectStep(idx)"
            role="button"
            tabindex="0"
          >
            <div class="gp-stepper-number">
              @if (step.completed) {
                <gp-icon name="check" size="0.85em" />
              } @else if (step.icon) {
                <gp-icon [name]="step.icon" size="0.85em" />
              } @else {
                {{ idx + 1 }}
              }
            </div>
            <span class="gp-stepper-title">{{ step.label }}</span>
          </div>

          @if (!last) {
            <div class="gp-stepper-separator" [class.gp-stepper-separator-active]="step.completed"></div>
          }
        }
      </div>

      <div class="gp-stepper-panels">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .gp-stepper {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .gp-stepper-header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 1.5rem;
    }
    .gp-stepper-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    .gp-stepper-number {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      border: 2px solid var(--gp-surface-border);
      background: var(--gp-surface-card);
      color: var(--gp-text-color-secondary);
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--gp-transition-duration);
    }
    .gp-stepper-title {
      font-size: var(--gp-font-size-sm);
      font-weight: 500;
      color: var(--gp-text-color-secondary);
    }
    .gp-stepper-header-active .gp-stepper-number {
      border-color: var(--gp-primary);
      background: var(--gp-primary);
      color: var(--gp-primary-text);
    }
    .gp-stepper-header-active .gp-stepper-title {
      color: var(--gp-primary);
      font-weight: 600;
    }
    .gp-stepper-header-completed .gp-stepper-number {
      border-color: var(--gp-success);
      background: var(--gp-success);
      color: var(--gp-success-text);
    }
    .gp-stepper-separator {
      flex: 1;
      height: 2px;
      background: var(--gp-surface-divider);
      margin: 0 0.75rem;
      transition: background var(--gp-transition-duration);
    }
    .gp-stepper-separator-active {
      background: var(--gp-success);
    }
  `]
})
export class GpStepperComponent {
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
