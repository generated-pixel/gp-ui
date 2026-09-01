import { Component, input, output, signal, TemplateRef, contentChild, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-three-column-fluid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent],
  templateUrl: './three-column-fluid.component.html',
  styleUrl: './three-column-fluid.component.scss'
})
export class GpLayoutThreeColumnFluidComponent {
  public leftTitle = input<string>('');
  public mainTitle = input<string>('');
  public mainSubtitle = input<string>('');
  public rightTitle = input<string>('');
  public searchPlaceholder = input<string>('Search workspace...');

  public leftCollapsed = signal<boolean>(false);
  public rightCollapsed = signal<boolean>(false);

  public actionClick = output<string>();

  public leftTemplate = input<TemplateRef<any> | undefined>(undefined);
  public mainTemplate = input<TemplateRef<any> | undefined>(undefined);
  public rightTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentLeft = contentChild<TemplateRef<any>>('left');
  public contentLeftTpl = contentChild<TemplateRef<any>>('leftTemplate');
  public contentMain = contentChild<TemplateRef<any>>('main');
  public contentMainTpl = contentChild<TemplateRef<any>>('mainTemplate');
  public contentRight = contentChild<TemplateRef<any>>('right');
  public contentRightTpl = contentChild<TemplateRef<any>>('rightTemplate');

  public effectiveLeft = computed<TemplateRef<any> | undefined>(() => this.leftTemplate() || this.contentLeft() || this.contentLeftTpl());

  public effectiveMain = computed<TemplateRef<any> | undefined>(() => this.mainTemplate() || this.contentMain() || this.contentMainTpl());

  public effectiveRight = computed<TemplateRef<any> | undefined>(() => this.rightTemplate() || this.contentRight() || this.contentRightTpl());

  public toggleLeft(): void {
    this.leftCollapsed.update(c => !c);
  }

  public toggleRight(): void {
    this.rightCollapsed.update(c => !c);
  }
}
