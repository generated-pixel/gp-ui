import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTreeNode } from '../../tree/tree-node/tree-node.interface';

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
  templateUrl: './tree-select.component.html',
  styleUrl: './tree-select.component.scss'
})
export class GpTreeSelectComponent extends GpEditableBaseComponent implements ControlValueAccessor {
  @Input() options: GpTreeNode[] = [];
  @Input() override placeholder = 'Select node';
  @Input() override disabled = false;
  @Input() override ariaLabel = '';

  @Output() onNodeSelect = new EventEmitter<{ node: GpTreeNode }>();

  protected selectedNode = signal<GpTreeNode | null>(null);
  protected overlayVisible = signal<boolean>(false);

  // Inherited onChangeCallback
  // Inherited onTouchedCallback

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public override writeValue(value: any): void {
    this.selectedNode.set(value);
  }

  public override registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public override registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public override setDisabledState(isDisabled: boolean): void {
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
