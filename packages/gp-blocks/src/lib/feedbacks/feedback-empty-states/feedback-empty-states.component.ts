import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-feedback-empty-states',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './feedback-empty-states.component.html',
  styleUrl: './feedback-empty-states.component.scss'
})
export class GpFeedbackEmptyStatesComponent {
  public icon = input<string>('inbox');
  public title = input<string>('');
  public description = input<string>('');
  public primaryCta = input<string>('');
  public secondaryCta = input<string>('');

  public primaryClick = output<void>();
  public secondaryClick = output<void>();

  @Input() public iconTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('icon') public contentIcon?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveIcon(): TemplateRef<any> | undefined {
    return this.iconTemplate || this.contentIcon;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
