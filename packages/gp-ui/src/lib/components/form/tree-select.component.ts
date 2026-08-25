import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../icons/icon.component';
import { GpTreeNode } from '../tree/tree-node.interface';

@Component({
  selector: 'gp-tree-select',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTreeSelectComponent),
      multi: true
    }
  ],
  template: `
    <div
      class="gp-select gp-treeselect"
      [class.gp-select-open]="overlayVisible()"
      [class.gp-select-disabled]="disabled"
      (click)="toggleOverlay()"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="overlayVisible()"
      [attr.aria-label]="ariaLabel || placeholder || 'Tree Select'"
    >
      <div class="gp-select-label-container">
        <span class="gp-select-label" [class.gp-select-placeholder]="!selectedNode()">
          @if (selectedNode()) {
            @if (selectedNode()?.icon) {
              <gp-icon [name]="selectedNode()!.icon!" class="gp-treeselect-icon" />
            }
            {{ selectedNode()?.label }}
          } @else {
            {{ placeholder }}
          }
        </span>
      </div>

      <div class="gp-select-triggers">
        <gp-icon [name]="overlayVisible() ? 'chevron-up' : 'chevron-down'" size="0.85em" class="gp-select-arrow" />
      </div>

      @if (overlayVisible()) {
        <div class="gp-select-overlay gp-treeselect-overlay" (click)="$event.stopPropagation()">
          <ul class="gp-treeselect-tree" role="tree">
            @for (node of options; track $index) {
              <ng-container *ngTemplateOutlet="treeNodeTpl; context: { $implicit: node, level: 0 }" />
            }
          </ul>
        </div>
      }
    </div>

    <ng-template #treeNodeTpl let-node let-level="level">
      <li class="gp-treeselect-node" [style.padding-left.rem]="level * 1.25" role="treeitem">
        <div
          class="gp-treeselect-node-content"
          [class.gp-treeselect-node-selected]="selectedNode() === node"
          (click)="selectNode(node, $event)"
        >
          @if (node.children && node.children.length > 0) {
            <button
              type="button"
              class="gp-treeselect-toggler"
              (click)="toggleNode(node, $event)"
              aria-label="Toggle node"
            >
              <gp-icon [name]="node.expanded ? 'chevron-down' : 'chevron-right'" size="0.75em" />
            </button>
          } @else {
            <span class="gp-treeselect-toggler-spacer"></span>
          }

          @if (node.icon) {
            <gp-icon [name]="node.icon" class="gp-treeselect-icon" />
          }
          <span class="gp-treeselect-node-label">{{ node.label }}</span>
        </div>

        @if (node.expanded && node.children && node.children.length > 0) {
          <ul class="gp-treeselect-sub-tree" role="group">
            @for (child of node.children; track $index) {
              <ng-container *ngTemplateOutlet="treeNodeTpl; context: { $implicit: child, level: level + 1 }" />
            }
          </ul>
        }
      </li>
    </ng-template>
  `,
  styles: [`
    .gp-treeselect-overlay {
      padding: 0.5rem 0;
      max-height: 18rem;
      overflow-y: auto;
    }
    .gp-treeselect-tree, .gp-treeselect-sub-tree {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .gp-treeselect-node-content {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      transition: background var(--gp-transition-duration);
    }
    .gp-treeselect-node-content:hover {
      background: var(--gp-surface-hover);
    }
    .gp-treeselect-node-selected {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary) !important;
      font-weight: 600;
    }
    .gp-treeselect-toggler {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--gp-text-color-muted);
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
    }
    .gp-treeselect-toggler-spacer {
      width: 1.25rem;
    }
    .gp-treeselect-icon {
      color: var(--gp-primary);
    }
  `]
})
export class GpTreeSelectComponent implements ControlValueAccessor {
  @Input() options: GpTreeNode[] = [];
  @Input() placeholder = 'Select node';
  @Input() disabled = false;
  @Input() ariaLabel = '';

  @Output() onNodeSelect = new EventEmitter<{ node: GpTreeNode }>();

  protected selectedNode = signal<GpTreeNode | null>(null);
  protected overlayVisible = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public writeValue(value: any): void {
    this.selectedNode.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggleOverlay(): void {
    if (this.disabled) return;
    this.overlayVisible.update(v => !v);
  }

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }

  public selectNode(node: GpTreeNode, event: MouseEvent): void {
    this.selectedNode.set(node);
    this.onChangeCallback(node);
    this.onTouchedCallback();
    this.onNodeSelect.emit({ node });
    this.overlayVisible.set(false);
  }
}
