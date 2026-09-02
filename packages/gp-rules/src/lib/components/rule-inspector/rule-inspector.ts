import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpBadge, GpIcon } from '@generatedpixel/gp-ui';
import { GpRuleEngineService } from '../../engine/rule-engine.service';
import { GpRuleExecutionLog } from '../../types/context.types';

@Component({
  selector: 'gp-rule-inspector',
  standalone: true,
  imports: [CommonModule, GpButton, GpBadge, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rule-inspector.html',
  styleUrl: './rule-inspector.scss'
})
export class GpRuleInspector {
  public engine = inject(GpRuleEngineService);

  public title = input<string>('Business Rules Audit Trail');
  public maxLogs = input<number>(20);
  public clearLogs = output<void>();

  public onClear(): void {
    this.engine.clearLogs();
    this.clearLogs.emit();
  }
}
