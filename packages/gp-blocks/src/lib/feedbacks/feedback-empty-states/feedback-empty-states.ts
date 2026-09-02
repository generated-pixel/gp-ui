import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpIcon } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-feedback-empty-states',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './feedback-empty-states.html',
  styleUrl: './feedback-empty-states.scss'
})
export class GpFeedbackEmptyStates {
  public icon = input<string>('inbox');
  public title = input<string>('');
  public description = input<string>('');
  public primaryCta = input<string>('');
  public secondaryCta = input<string>('');

  public primaryClick = output<void>();
  public secondaryClick = output<void>();

  public iconTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentIcon = contentChild<TemplateRef<any>>('icon');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveIcon = computed(() => this.iconTemplate() || this.contentIcon());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
