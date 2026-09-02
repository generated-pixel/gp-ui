import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  model,
  output,
  contentChildren,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-accordion-tab',
  standalone: true,
  imports: [],
  templateUrl: './accordion-tab.html',
  styleUrl: './accordion-tab.scss'
})
export class GpAccordionTab extends GpBase {
  public header = input<string>('');
  public selected = model<boolean>(false);
}

@Component({
  selector: 'gp-accordion',
  standalone: true,
  imports: [NgTemplateOutlet, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss'
})
export class GpAccordion extends GpBase {
  public tabs = contentChildren(GpAccordionTab);

  public multiple = input<boolean>(false);
  public onClose = output<{ index: number }>();
  public onOpen = output<{ index: number }>();

  public toggleTab(tab: GpAccordionTab): void {
    if (tab.disabled()) {
      return;
    }
    const isOpened = tab.selected();
    if (!this.multiple() && !isOpened) {
      this.tabs().forEach((t) => t.selected.set(false));
    }
    tab.selected.set(!isOpened);

    const idx = this.tabs().indexOf(tab);
    if (tab.selected()) {
      this.onOpen.emit({ index: idx });
    } else {
      this.onClose.emit({ index: idx });
    }
  }
}
