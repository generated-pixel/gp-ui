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
  selector: 'gp-page-500',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './page-500.html',
  styleUrl: './page-500.scss'
})
export class GpPage500 {
  public code = input<string>('500');
  public title = input<string>('');
  public description = input<string>('');
  public supportBtnLabel = input<string>('Contact Support');
  public retryBtnLabel = input<string>('Try Again');

  public contactSupport = output<void>();
  public retry = output<void>();

  public codeTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentCode = contentChild<TemplateRef<any>>('code');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveCode = computed(() => this.codeTemplate() || this.contentCode());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
