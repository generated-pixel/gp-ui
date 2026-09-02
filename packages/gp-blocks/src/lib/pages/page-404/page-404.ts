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
  selector: 'gp-page-404',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './page-404.html',
  styleUrl: './page-404.scss'
})
export class GpPage404 {
  public code = input<string>('404');
  public title = input<string>('');
  public description = input<string>('');
  public goBackBtnLabel = input<string>('Go Back');
  public returnHomeBtnLabel = input<string>('Return Home');

  public goBack = output<void>();
  public returnHome = output<void>();

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
