import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpInputText } from '@generatedpixel/gp-ui';

export interface GpCountdownUnit {
  label: string;
  value: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-page-coming-soon',
  standalone: true,
  imports: [CommonModule, GpButton, GpInputText],
  templateUrl: './page-coming-soon.html',
  styleUrl: './page-coming-soon.scss'
})
export class GpPageComingSoon {
  public badgeText = input<string>('');
  public title = input<string>('');
  public description = input<string>('');
  public emailPlaceholder = input<string>('Enter your email address...');
  public notifyBtnLabel = input<string>('Notify Me');
  public countdown = input<GpCountdownUnit[]>([]);

  public email = signal<string>('');
  public subscribe = output<string>();

  public countdownTemplate = input<TemplateRef<any> | undefined>(undefined);
  public formTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentCountdown = contentChild<TemplateRef<any>>('countdown');
  public contentForm = contentChild<TemplateRef<any>>('form');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveCountdown = computed(() => this.countdownTemplate() || this.contentCountdown());

  public effectiveForm = computed(() => this.formTemplate() || this.contentForm());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onSubscribe(): void {
    if (this.email().trim()) {
      this.subscribe.emit(this.email().trim());
    }
  }
}
