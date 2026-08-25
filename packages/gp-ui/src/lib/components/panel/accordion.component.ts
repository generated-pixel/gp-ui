import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-accordion-tab',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content />'
})
export class GpAccordionTabComponent extends GpBaseComponent {
  @Input() header = '';
  @Input() override disabled = false;
  @Input() selected = false;
}

@Component({
  selector: 'gp-accordion',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class GpAccordionComponent extends GpBaseComponent {
  @ContentChildren(GpAccordionTabComponent) tabs!: QueryList<GpAccordionTabComponent>;

  @Input() multiple = false;
  @Output() onClose = new EventEmitter<{ index: number }>();
  @Output() onOpen = new EventEmitter<{ index: number }>();

  public toggleTab(tab: GpAccordionTabComponent): void {
    if (tab.disabled) return;
    const isOpened = tab.selected;
    if (!this.multiple && !isOpened) {
      this.tabs.forEach(t => (t.selected = false));
    }
    tab.selected = !isOpened;

    const idx = this.tabs.toArray().indexOf(tab);
    if (tab.selected) {
      this.onOpen.emit({ index: idx });
    } else {
      this.onClose.emit({ index: idx });
    }
  }
}
