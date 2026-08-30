import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from '@generatedpixel/gp-ui';

export interface GpCountdownUnit {
  label: string;
  value: string;
}

@Component({
  selector: 'gp-page-coming-soon',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  templateUrl: './page-coming-soon.component.html',
  styleUrl: './page-coming-soon.component.scss'
})
export class GpPageComingSoonComponent {
  public badgeText = input<string>('');
  public title = input<string>('');
  public description = input<string>('');
  public emailPlaceholder = input<string>('Enter your email address...');
  public notifyBtnLabel = input<string>('Notify Me');
  public countdown = input<GpCountdownUnit[]>([]);

  public email = signal<string>('');
  public subscribe = output<string>();

  @Input() public countdownTemplate?: TemplateRef<any>;
  @Input() public formTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('countdown') public contentCountdown?: TemplateRef<any>;
  @ContentChild('form') public contentForm?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveCountdown(): TemplateRef<any> | undefined {
    return this.countdownTemplate || this.contentCountdown;
  }

  public get effectiveForm(): TemplateRef<any> | undefined {
    return this.formTemplate || this.contentForm;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSubscribe(): void {
    if (this.email().trim()) {
      this.subscribe.emit(this.email().trim());
    }
  }
}
