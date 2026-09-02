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
  selector: 'gp-page-success-confirmation',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './page-success-confirmation.html',
  styleUrl: './page-success-confirmation.scss'
})
export class GpPageSuccessConfirmation {
  public icon = input<string>('check-circle');
  public title = input<string>('');
  public description = input<string>('');
  public orderNumberLabel = input<string>('Order Number');
  public orderNumber = input<string>('');
  public emailLabel = input<string>('Confirmation Email');
  public email = input<string>('');
  public secondaryBtnLabel = input<string>('View Dashboard');
  public primaryBtnLabel = input<string>('Download Receipt');

  public secondaryAction = output<void>();
  public primaryAction = output<void>();

  public iconTemplate = input<TemplateRef<any> | undefined>(undefined);
  public detailsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentIcon = contentChild<TemplateRef<any>>('icon');
  public contentDetails = contentChild<TemplateRef<any>>('details');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveIcon = computed(() => this.iconTemplate() || this.contentIcon());

  public effectiveDetails = computed(() => this.detailsTemplate() || this.contentDetails());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
