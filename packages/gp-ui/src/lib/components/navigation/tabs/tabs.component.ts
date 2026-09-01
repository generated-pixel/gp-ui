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
import { GpBadgeComponent, GpBadgeSeverity } from '../../feedback/badge/badge.component';

@Component({
  selector: 'gp-tab-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss'
})
export class GpTabPanelComponent extends GpBaseComponent {
  public header = input<string>('');
  public icon = input<string>('');
  public badge = input<string | number | undefined>(undefined);
  public badgeSeverity = input<GpBadgeSeverity>('primary');
  public closable = input<boolean>(false);
  public selected = model<boolean>(false);
}

@Component({
  selector: 'gp-tabs',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class GpTabsComponent extends GpBaseComponent {
  public tabPanels = contentChildren(GpTabPanelComponent);

  public activeIndex = model<number>(0);
  public hidePanels = input<boolean>(false);
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

  public onTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    const panels = this.tabPanels();
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = this.findEnabledTab(currentIndex, 1);
    } else if (event.key === 'ArrowLeft') {
      nextIndex = this.findEnabledTab(currentIndex, -1);
    } else if (event.key === 'Home') {
      nextIndex = panels.findIndex((panel) => !panel.disabled());
    } else if (event.key === 'End') {
      for (let index = panels.length - 1; index >= 0; index--) {
        if (!panels[index].disabled()) {
          nextIndex = index;
          break;
        }
      }
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = panels[nextIndex];
    if (nextTab) {
      this.selectTab(nextTab);
      const target = event.currentTarget as HTMLElement;
      target.closest('[role="tablist"]')
        ?.querySelectorAll<HTMLElement>('[role="tab"]')
        [nextIndex]?.focus();
    }
  }

  private findEnabledTab(currentIndex: number, direction: 1 | -1): number {
    const panels = this.tabPanels();
    for (let offset = 1; offset <= panels.length; offset++) {
      const index = (currentIndex + direction * offset + panels.length) % panels.length;
      if (!panels[index].disabled()) {
        return index;
      }
    }
    return currentIndex;
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
