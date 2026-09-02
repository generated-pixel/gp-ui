import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpButton, GpBadge, GpIcon } from '@generatedpixel/gp-ui';
import { GpRuleEngineService } from '../../engine/rule-engine.service';
import { GpRuleExecutionLog } from '../../types/context.types';

@Component({
  selector: 'gp-rule-inspector',
  standalone: true,
  imports: [CommonModule, FormsModule, GpButton, GpBadge, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rule-inspector.html',
  styleUrl: './rule-inspector.scss'
})
export class GpRuleInspector {
  public engine = inject(GpRuleEngineService);

  public title = input<string>('Business Rules Audit Trail');
  public maxLogs = input<number>(50);
  public showStats = input<boolean>(true);
  public clearLogs = output<void>();

  public filterQuery = signal<string>('');
  public statusFilter = signal<'all' | 'matched' | 'unmatched'>('all');

  public filteredLogs = computed(() => {
    const q = this.filterQuery().toLowerCase().trim();
    const sf = this.statusFilter();
    let list = this.engine.logs();

    if (sf === 'matched') {
      list = list.filter((l) => l.conditionMet);
    } else if (sf === 'unmatched') {
      list = list.filter((l) => !l.conditionMet);
    }

    if (q) {
      list = list.filter(
        (l) =>
          l.ruleId.toLowerCase().includes(q) ||
          (l.ruleName && l.ruleName.toLowerCase().includes(q)) ||
          l.triggerEvent.toLowerCase().includes(q) ||
          (l.targetField && l.targetField.toLowerCase().includes(q)) ||
          l.actionsExecuted.some((a) => a.toLowerCase().includes(q))
      );
    }

    return list.slice(0, this.maxLogs());
  });

  public onClear(): void {
    this.engine.clearLogs();
    this.clearLogs.emit();
  }

  public onExportJson(): void {
    const data = JSON.stringify(this.engine.logs(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gp-rules-audit-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
