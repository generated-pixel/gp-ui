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
import { GpButton } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-page-403',
  standalone: true,
  imports: [CommonModule, GpButton],
  templateUrl: './page-403.html',
  styleUrl: './page-403.scss'
})
export class GpPage403 {
  public code = input<string>('403');
  public title = input<string>('');
  public description = input<string>('');
  public returnHomeBtnLabel = input<string>('Return to Dashboard');
  public requestAccessBtnLabel = input<string>('Request Access');

  public returnHome = output<void>();
  public requestAccess = output<void>();

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
