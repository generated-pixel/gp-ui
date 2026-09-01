import { Component, input, output, signal, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpDrawerComponent, GpInputNumberComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-overlay-slide-over-panel',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpDrawerComponent, GpInputNumberComponent, GpInputTextComponent],
  templateUrl: './overlay-slide-over-panel.component.html',
  styleUrl: './overlay-slide-over-panel.component.scss'
})
export class GpOverlaySlideOverPanelComponent {
  public title = input<string>('');
  public description = input<string>('');
  public saveBtnLabel = input<string>('Save Changes');
  public cancelBtnLabel = input<string>('Cancel');
  public openLabel = input<string>('Open panel');

  public configTag = signal<string>('prod-eu-west-1');
  public workerNodes = signal<number>(4);
  public visible = signal<boolean>(false);
  private closeReason: 'cancel' | 'save' | null = null;

  public close = output<void>();
  public cancel = output<void>();
  public save = output<{ configTag: string; workerNodes: number }>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public bodyTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentBody = contentChild<TemplateRef<any>>('body');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveBody = computed(() => this.bodyTemplate() || this.contentBody());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public open(): void {
    this.closeReason = null;
    this.visible.set(true);
  }

  public onVisibleChange(visible: boolean): void {
    this.visible.set(visible);
  }

  public onDrawerHide(): void {
    this.visible.set(false);
    if (this.closeReason === null) {
      this.close.emit();
    }
    this.closeReason = null;
  }

  public onCancel(): void {
    this.closeReason = 'cancel';
    this.cancel.emit();
    this.visible.set(false);
  }

  public onSave(): void {
    this.closeReason = 'save';
    this.save.emit({
      configTag: this.configTag(),
      workerNodes: this.workerNodes()
    });
    this.visible.set(false);
  }
}
