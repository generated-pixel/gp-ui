import { GpBaseComponent } from '../../../base/gp-base.component';
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
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-accordion-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-tab.component.html',
  styleUrl: './accordion-tab.component.scss'
})
export class GpAccordionTabComponent extends GpBaseComponent {
  public header = input<string>('');
  public selected = model<boolean>(false);
}

@Component({
  selector: 'gp-accordion',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class GpAccordionComponent extends GpBaseComponent {
  public tabs = contentChildren(GpAccordionTabComponent);

  public multiple = input<boolean>(false);
  public onClose = output<{ index: number }>();
  public onOpen = output<{ index: number }>();

  public toggleTab(tab: GpAccordionTabComponent): void {
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
