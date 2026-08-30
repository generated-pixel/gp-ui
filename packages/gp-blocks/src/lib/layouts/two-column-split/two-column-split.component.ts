import { Component, input, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-two-column-split',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './two-column-split.component.html',
  styleUrl: './two-column-split.component.scss'
})
export class GpLayoutTwoColumnSplitComponent {
  public splitRatio = input<'50/50' | '60/40'>('50/50');
  public primaryTitle = input<string>('');
  public primaryBadge = input<string>('');
  public primaryDescription = input<string>('');
  public secondaryTitle = input<string>('');
  public secondaryDescription = input<string>('');

  @Input() public primaryTemplate?: TemplateRef<any>;
  @Input() public secondaryTemplate?: TemplateRef<any>;
  @Input() public primaryActionsTemplate?: TemplateRef<any>;
  @Input() public secondaryActionsTemplate?: TemplateRef<any>;

  @ContentChild('primary') public contentPrimary?: TemplateRef<any>;
  @ContentChild('primaryTemplate') public contentPrimaryTpl?: TemplateRef<any>;
  @ContentChild('left') public contentLeft?: TemplateRef<any>;
  @ContentChild('secondary') public contentSecondary?: TemplateRef<any>;
  @ContentChild('secondaryTemplate') public contentSecondaryTpl?: TemplateRef<any>;
  @ContentChild('right') public contentRight?: TemplateRef<any>;
  @ContentChild('primaryActions') public contentPrimaryActions?: TemplateRef<any>;
  @ContentChild('secondaryActions') public contentSecondaryActions?: TemplateRef<any>;

  public get effectivePrimary(): TemplateRef<any> | undefined {
    return this.primaryTemplate || this.contentPrimary || this.contentPrimaryTpl || this.contentLeft;
  }

  public get effectiveSecondary(): TemplateRef<any> | undefined {
    return this.secondaryTemplate || this.contentSecondary || this.contentSecondaryTpl || this.contentRight;
  }

  public get effectivePrimaryActions(): TemplateRef<any> | undefined {
    return this.primaryActionsTemplate || this.contentPrimaryActions;
  }

  public get effectiveSecondaryActions(): TemplateRef<any> | undefined {
    return this.secondaryActionsTemplate || this.contentSecondaryActions;
  }
}
