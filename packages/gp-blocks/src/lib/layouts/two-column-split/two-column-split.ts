import {
  Component,
  input,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon, GpBadge } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-two-column-split',
  standalone: true,
  imports: [CommonModule, GpIcon, GpBadge],
  templateUrl: './two-column-split.html',
  styleUrl: './two-column-split.scss'
})
export class GpLayoutTwoColumnSplit {
  public splitRatio = input<'50/50' | '60/40'>('50/50');
  public primaryTitle = input<string>('');
  public primaryBadge = input<string>('');
  public primaryDescription = input<string>('');
  public secondaryTitle = input<string>('');
  public secondaryDescription = input<string>('');

  public primaryTemplate = input<TemplateRef<any> | undefined>(undefined);
  public secondaryTemplate = input<TemplateRef<any> | undefined>(undefined);
  public primaryActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public secondaryActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentPrimary = contentChild<TemplateRef<any>>('primary');
  public contentPrimaryTpl = contentChild<TemplateRef<any>>('primaryTemplate');
  public contentLeft = contentChild<TemplateRef<any>>('left');
  public contentSecondary = contentChild<TemplateRef<any>>('secondary');
  public contentSecondaryTpl = contentChild<TemplateRef<any>>('secondaryTemplate');
  public contentRight = contentChild<TemplateRef<any>>('right');
  public contentPrimaryActions = contentChild<TemplateRef<any>>('primaryActions');
  public contentSecondaryActions = contentChild<TemplateRef<any>>('secondaryActions');

  public effectivePrimary = computed<TemplateRef<any> | undefined>(
    () => this.primaryTemplate() || this.contentPrimary() || this.contentPrimaryTpl() || this.contentLeft()
  );

  public effectiveSecondary = computed<TemplateRef<any> | undefined>(
    () => this.secondaryTemplate() || this.contentSecondary() || this.contentSecondaryTpl() || this.contentRight()
  );

  public effectivePrimaryActions = computed(() => this.primaryActionsTemplate() || this.contentPrimaryActions());

  public effectiveSecondaryActions = computed(() => this.secondaryActionsTemplate() || this.contentSecondaryActions());
}
