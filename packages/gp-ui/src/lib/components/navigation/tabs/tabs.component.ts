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
  selector: 'gp-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />'
})
export class GpTabPanelComponent extends GpBaseComponent {
  @Input() header = '';
  @Input() icon = '';
  @Input() override disabled = false;
  @Input() closable = false;
  @Input() selected = false;
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
export class GpTabsComponent extends GpBaseComponent implements AfterContentInit {
  @ContentChildren(GpTabPanelComponent) tabPanels!: QueryList<GpTabPanelComponent>;

  @Input() activeIndex = 0;
  @Output() onChange = new EventEmitter<{ index: number }>();
  @Output() onClose = new EventEmitter<{ index: number }>();

  ngAfterContentInit(): void {
    if (this.tabPanels && this.tabPanels.length > 0) {
      const selected = this.tabPanels.find((p) => p.selected);
      if (!selected) {
        this.tabPanels.first.selected = true;
      }
    }
  }

  public selectTab(tab: GpTabPanelComponent): void {
    if (tab.disabled) {
      return;
    }
    this.tabPanels.forEach((p) => (p.selected = false));
    tab.selected = true;
    const idx = this.tabPanels.toArray().indexOf(tab);
    this.onChange.emit({ index: idx });
  }

  public closeTab(tab: GpTabPanelComponent, event: MouseEvent): void {
    event.stopPropagation();
    const idx = this.tabPanels.toArray().indexOf(tab);
    this.onClose.emit({ index: idx });
  }
}
