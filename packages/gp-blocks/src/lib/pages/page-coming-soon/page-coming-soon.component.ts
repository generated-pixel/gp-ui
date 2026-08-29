import { Component, input, output, signal } from '@angular/core';
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

  public onSubscribe(): void {
    if (this.email().trim()) {
      this.subscribe.emit(this.email().trim());
    }
  }
}
