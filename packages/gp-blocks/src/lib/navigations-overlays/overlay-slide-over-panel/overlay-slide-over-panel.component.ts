import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-overlay-slide-over-panel',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './overlay-slide-over-panel.component.html',
  styleUrl: './overlay-slide-over-panel.component.scss'
})
export class GpOverlaySlideOverPanelComponent {
  public title = input<string>('');
  public description = input<string>('');
  public saveBtnLabel = input<string>('Save Changes');
  public cancelBtnLabel = input<string>('Cancel');

  public configTag = signal<string>('prod-eu-west-1');
  public workerNodes = signal<number>(4);

  public close = output<void>();
  public cancel = output<void>();
  public save = output<{ configTag: string; workerNodes: number }>();

  public onSave(): void {
    this.save.emit({
      configTag: this.configTag(),
      workerNodes: this.workerNodes()
    });
  }
}
