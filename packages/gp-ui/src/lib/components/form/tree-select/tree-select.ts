import { GpEditableBase } from '../../../base/gp-editable-base';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  forwardRef,
  signal,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GpIcon } from '../../../icons/icon';
import { GpTreeNode } from '../../tree/tree-node/tree-node.interface';
import { GpAppendToDirective } from '../../../overlay/append-to.directive';
import { GpAppendToTarget } from '../../../overlay/append-to.interface';

@Component({
  selector: 'gp-tree-select',
  standalone: true,
  imports: [CommonModule, GpIcon, GpAppendToDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTreeSelect),
      multi: true
    }
  ],
  templateUrl: './tree-select.html',
  styleUrl: './tree-select.scss'
})
export class GpTreeSelect extends GpEditableBase implements ControlValueAccessor {
  public appendTo = input<GpAppendToTarget>('body');
  public options = input<GpTreeNode[]>([]);

  public onNodeSelect = output<{ node: GpTreeNode }>();

  protected selectedNode = signal<GpTreeNode | null>(null);
  protected overlayVisible = signal<boolean>(false);

  private cdr = inject(ChangeDetectorRef);

  constructor(public el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.overlayVisible() &&
      this.el?.nativeElement &&
      !this.el.nativeElement.contains(target) &&
      !target.closest('.gp-treeselect-overlay')
    ) {
      this.overlayVisible.set(false);
      this.cdr.markForCheck();
    }
  }

  public override writeValue(value: any): void {
    this.selectedNode.set(value);
    this.cdr.markForCheck();
  }

  public toggleOverlay(): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }
    this.overlayVisible.update((v) => !v);
    this.cdr.markForCheck();
  }

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
    this.cdr.markForCheck();
  }

  public selectNode(node: GpTreeNode, event: MouseEvent): void {
    this.selectedNode.set(node);
    this.updateValue(node);
    this.handleControlBlur();
    this.onNodeSelect.emit({ node });
    this.overlayVisible.set(false);
    this.cdr.markForCheck();
  }
}
