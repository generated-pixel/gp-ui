import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (selected) {
      <div class="gp-tabpanel-content" role="tabpanel">
        <ng-content />
      </div>
    }
  `
})
export class GpTabPanelComponent {
  @Input() header = '';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() closable = false;
  @Input() selected = false;
}

@Component({
  selector: 'gp-tabs',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-tabview">
      <div class="gp-tabview-nav-container">
        <ul class="gp-tabview-nav" role="tablist">
          @for (tab of tabPanels; track $index) {
            <li
              class="gp-tabview-header"
              [class.gp-tabview-header-active]="tab.selected"
              [class.gp-tabview-header-disabled]="tab.disabled"
              role="presentation"
            >
              <button
                type="button"
                class="gp-tabview-nav-link"
                [disabled]="tab.disabled"
                (click)="selectTab(tab)"
                role="tab"
                [attr.aria-selected]="tab.selected"
              >
                @if (tab.icon) {
                  <gp-icon [name]="tab.icon" size="0.9em" />
                }
                <span>{{ tab.header }}</span>

                @if (tab.closable) {
                  <button
                    type="button"
                    class="gp-tabview-close-btn"
                    (click)="closeTab(tab, $event)"
                    aria-label="Close tab"
                  >
                    <gp-icon name="times" size="0.7em" />
                  </button>
                }
              </button>
            </li>
          }
        </ul>
      </div>

      <div class="gp-tabview-panels">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .gp-tabview {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .gp-tabview-nav-container {
      border-bottom: 2px solid var(--gp-surface-border);
      position: relative;
    }
    .gp-tabview-nav {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 0.5rem;
    }
    .gp-tabview-nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      font-size: var(--gp-font-size-sm);
      font-weight: 500;
      color: var(--gp-text-color-secondary);
      cursor: pointer;
      font-family: inherit;
      transition: all var(--gp-transition-duration);
    }
    .gp-tabview-nav-link:hover:not(:disabled) {
      color: var(--gp-text-color);
      border-bottom-color: var(--gp-input-border-hover);
    }
    .gp-tabview-header-active .gp-tabview-nav-link {
      color: var(--gp-primary) !important;
      border-bottom-color: var(--gp-primary) !important;
      font-weight: 600;
    }
    .gp-tabview-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-muted);
      padding: 0.15rem;
      display: inline-flex;
      border-radius: 50%;
    }
    .gp-tabview-close-btn:hover {
      color: var(--gp-danger);
    }
    .gp-tabview-panels {
      padding: 1rem 0;
    }
  `]
})
export class GpTabsComponent {
  @ContentChildren(GpTabPanelComponent) tabPanels!: QueryList<GpTabPanelComponent>;

  @Input() activeIndex = 0;
  @Output() onChange = new EventEmitter<{ index: number }>();
  @Output() onClose = new EventEmitter<{ index: number }>();

  ngAfterContentInit(): void {
    if (this.tabPanels && this.tabPanels.length > 0) {
      const selected = this.tabPanels.find(p => p.selected);
      if (!selected) {
        this.tabPanels.first.selected = true;
      }
    }
  }

  public selectTab(tab: GpTabPanelComponent): void {
    if (tab.disabled) return;
    this.tabPanels.forEach(p => (p.selected = false));
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
