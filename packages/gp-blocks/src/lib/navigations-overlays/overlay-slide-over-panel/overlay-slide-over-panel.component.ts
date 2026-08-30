import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpDrawerComponent, GpInputNumberComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

@Component({
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public bodyTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('body') public contentBody?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveBody(): TemplateRef<any> | undefined {
    return this.bodyTemplate || this.contentBody;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

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
