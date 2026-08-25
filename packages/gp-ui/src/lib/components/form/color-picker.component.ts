import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'gp-color-picker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpColorPickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-color-picker" [class.gp-color-picker-disabled]="disabled">
      <div
        class="gp-color-picker-preview"
        [style.background-color]="value()"
        (click)="toggleOverlay()"
        tabindex="0"
        role="button"
        aria-label="Choose color"
        (keydown.space)="$event.preventDefault(); toggleOverlay()"
      ></div>

      @if (overlayVisible()) {
        <div class="gp-color-picker-overlay">
          <div class="gp-color-picker-palette">
            @for (c of presetColors; track c) {
              <div
                class="gp-color-picker-swatch"
                [style.background-color]="c"
                [class.gp-color-picker-swatch-selected]="value() === c"
                (click)="selectColor(c)"
              ></div>
            }
          </div>
          <div class="gp-color-picker-custom">
            <input
              type="color"
              [value]="value()"
              (input)="onNativeColorInput($event)"
              class="gp-color-picker-native"
            />
            <span class="gp-color-picker-hex">{{ value() }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-color-picker {
      display: inline-block;
      position: relative;
    }
    .gp-color-picker-preview {
      width: 2rem;
      height: 2rem;
      border-radius: var(--gp-border-radius);
      border: 2px solid var(--gp-surface-border);
      cursor: pointer;
      box-shadow: var(--gp-shadow-sm);
      outline: none;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .gp-color-picker-preview:focus-visible {
      box-shadow: var(--gp-focus-ring);
    }
    .gp-color-picker-overlay {
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 4px;
      padding: 0.75rem;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      z-index: 1050;
      width: 14rem;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-color-picker-palette {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.35rem;
      margin-bottom: 0.5rem;
    }
    .gp-color-picker-swatch {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: var(--gp-border-radius-sm);
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.1);
      transition: transform 0.1s;
    }
    .gp-color-picker-swatch:hover {
      transform: scale(1.2);
    }
    .gp-color-picker-swatch-selected {
      box-shadow: 0 0 0 2px var(--gp-primary);
    }
    .gp-color-picker-custom {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      border-top: 1px solid var(--gp-surface-divider);
      padding-top: 0.5rem;
    }
    .gp-color-picker-native {
      width: 2rem;
      height: 1.75rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
    }
    .gp-color-picker-hex {
      font-size: var(--gp-font-size-xs);
      font-family: monospace;
      color: var(--gp-text-color-secondary);
    }
    .gp-color-picker-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `]
})
export class GpColorPickerComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() presetColors = [
    '#6366f1', '#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6',
    '#10b981', '#84cc16', '#eab308', '#f97316', '#ef4444', '#ec4899',
    '#a855f7', '#64748b', '#1e293b', '#ffffff', '#000000', '#f1f5f9'
  ];

  @Output() onChange = new EventEmitter<{ value: string }>();

  protected value = signal<string>('#6366f1');
  protected overlayVisible = signal<boolean>(false);

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  public writeValue(value: any): void {
    this.value.set(value || '#6366f1');
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggleOverlay(): void {
    if (this.disabled) return;
    this.overlayVisible.update(v => !v);
  }

  public selectColor(color: string): void {
    this.value.set(color);
    this.onChangeCallback(color);
    this.onTouchedCallback();
    this.onChange.emit({ value: color });
    this.overlayVisible.set(false);
  }

  protected onNativeColorInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChangeCallback(val);
    this.onChange.emit({ value: val });
  }
}
