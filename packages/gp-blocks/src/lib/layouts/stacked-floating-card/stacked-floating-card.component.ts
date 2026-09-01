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
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-floating-card',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-floating-card.component.html',
  styleUrl: './stacked-floating-card.component.scss'
})
export class GpLayoutStackedFloatingCardComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public userName = input<string>('');
  public title = input<string>('');

  public brandClick = output<void>();
  public userClick = output<void>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);
  public userTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');
  public contentUser = contentChild<TemplateRef<any>>('user');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );

  public effectiveUser = computed(() => this.userTemplate() || this.contentUser());
}
