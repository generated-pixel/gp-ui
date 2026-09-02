import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpRuleEngineService } from '../../engine/rule-engine.service';
import { GpRuleExecutionLog } from '../../types/context.types';

@Component({
  selector: 'gp-rule-inspector',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rule-inspector.component.html',
  styleUrl: './rule-inspector.component.scss'
})
export class GpRuleInspectorComponent {
  public engine = inject(GpRuleEngineService);

  public title = input<string>('Business Rules Audit Trail');
  public maxLogs = input<number>(20);
  public clearLogs = output<void>();

  public onClear(): void {
    this.engine.clearLogs();
    this.clearLogs.emit();
  }
}
