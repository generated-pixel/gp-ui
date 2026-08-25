import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-accordion-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (selected) {
      <div class="gp-accordion-content" role="region">
        <ng-content />
      </div>
    }
  `
})
export class GpAccordionTabComponent {
  @Input() header = '';
  @Input() disabled = false;
  @Input() selected = false;
}

@Component({
  selector: 'gp-accordion',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-accordion">
      @for (tab of tabs; track $index) {
        <div
          class="gp-accordion-tab"
          [class.gp-accordion-tab-active]="tab.selected"
          [class.gp-accordion-tab-disabled]="tab.disabled"
        >
          <div
            class="gp-accordion-header"
            (click)="toggleTab(tab)"
            role="button"
            [attr.aria-expanded]="tab.selected"
            tabindex="0"
          >
            <gp-icon [name]="tab.selected ? 'chevron-down' : 'chevron-right'" size="0.8em" class="gp-accordion-arrow" />
            <span class="gp-accordion-header-text">{{ tab.header }}</span>
          </div>

          @if (tab.selected) {
            <div class="gp-accordion-body">
              <ng-container *ngTemplateOutlet="tabContentTpl; context: { $implicit: tab }" />
            </div>
          }
        </div>
      }
      <ng-content />
    </div>

    <ng-template #tabContentTpl let-tab>
      <div class="gp-accordion-content">
        <!-- Render tab projected content -->
      </div>
    </ng-template>
  `,
  styles: [`
    .gp-accordion {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .gp-accordion-tab {
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      overflow: hidden;
      background: var(--gp-surface-card);
    }
    .gp-accordion-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background: var(--gp-surface-card);
      cursor: pointer;
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      user-select: none;
      transition: background var(--gp-transition-duration);
    }
    .gp-accordion-header:hover {
      background: var(--gp-surface-hover);
    }
    .gp-accordion-tab-active .gp-accordion-header {
      color: var(--gp-primary);
      border-bottom: 1px solid var(--gp-surface-divider);
    }
    .gp-accordion-arrow {
      color: var(--gp-text-color-muted);
    }
    .gp-accordion-content {
      padding: 1.25rem;
      color: var(--gp-text-color);
      line-height: 1.5;
    }
    .gp-accordion-tab-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `]
})
export class GpAccordionComponent {
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
