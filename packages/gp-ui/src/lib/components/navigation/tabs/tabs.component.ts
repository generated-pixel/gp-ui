import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  model,
  output,
  contentChildren,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />'
})
export class GpTabPanelComponent extends GpBaseComponent {
  public header = input<string>('');
  public icon = input<string>('');
  public closable = input<boolean>(false);
  public selected = model<boolean>(false);
}

@Component({
  selector: 'gp-tabs',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class GpTabsComponent extends GpBaseComponent {
  public tabPanels = contentChildren(GpTabPanelComponent);

  public activeIndex = model<number>(0);
  public onChange = output<{ index: number }>();
  public onClose = output<{ index: number }>();

  constructor() {
    super();
    effect(() => {
      const panels = this.tabPanels();
      const idx = this.activeIndex();
      if (panels && panels.length > 0) {
        panels.forEach((p, i) => p.selected.set(i === idx));
      }
    });
  }

  public selectTab(tab: GpTabPanelComponent): void {
    if (tab.disabled()) {
      return;
    }
    const panels = this.tabPanels();
    const idx = panels.indexOf(tab);
    if (idx !== -1) {
      this.activeIndex.set(idx);
      this.onChange.emit({ index: idx });
    }
  }

  public closeTab(tab: GpTabPanelComponent, event: MouseEvent): void {
    event.stopPropagation();
    const panels = this.tabPanels();
    const idx = panels.indexOf(tab);
    if (idx !== -1) {
      this.onClose.emit({ index: idx });
    }
  }
}
