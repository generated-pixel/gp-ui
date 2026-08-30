import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

@Component({
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

  @Input() public leftTemplate?: TemplateRef<any>;
  @Input() public mainTemplate?: TemplateRef<any>;
  @Input() public rightTemplate?: TemplateRef<any>;

  @ContentChild('left') public contentLeft?: TemplateRef<any>;
  @ContentChild('leftTemplate') public contentLeftTpl?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;
  @ContentChild('mainTemplate') public contentMainTpl?: TemplateRef<any>;
  @ContentChild('right') public contentRight?: TemplateRef<any>;
  @ContentChild('rightTemplate') public contentRightTpl?: TemplateRef<any>;

  public get effectiveLeft(): TemplateRef<any> | undefined {
    return this.leftTemplate || this.contentLeft || this.contentLeftTpl;
  }

  public get effectiveMain(): TemplateRef<any> | undefined {
    return this.mainTemplate || this.contentMain || this.contentMainTpl;
  }

  public get effectiveRight(): TemplateRef<any> | undefined {
    return this.rightTemplate || this.contentRight || this.contentRightTpl;
  }

  public toggleLeft(): void {
    this.leftCollapsed.update(c => !c);
  }

  public toggleRight(): void {
    this.rightCollapsed.update(c => !c);
  }
}
