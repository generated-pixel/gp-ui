import { Directive, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { GpHotkeyService, GpHotkeyOptions } from '../services/hotkey.service';

@Directive({
  selector: '[gpHotkey]',
  standalone: true
})
export class GpHotkeyDirective implements OnInit, OnDestroy {
  public keys = input<string>('', { alias: 'gpHotkey' });
  public hotkeyDescription = input<string | undefined>(undefined);
  public hotkeyGroup = input<string | undefined>(undefined);
  public hotkeyScope = input<string | undefined>(undefined);
  public preventDefault = input<boolean>(true);

  public hotkeyTriggered = output<KeyboardEvent>();

  private hotkeyService = inject(GpHotkeyService);
  private unregisterFns: Array<() => void> = [];

  ngOnInit(): void {
    const rawKeys = this.keys();
    if (!rawKeys) {
      return;
    }

    const keyCombos = rawKeys.split(',').map((k) => k.trim());
    const options: GpHotkeyOptions = {
      description: this.hotkeyDescription(),
      group: this.hotkeyGroup(),
      scope: this.hotkeyScope(),
      preventDefault: this.preventDefault()
    };

    keyCombos.forEach((combo) => {
      const unreg = this.hotkeyService.register(
        combo,
        (event) => {
          this.hotkeyTriggered.emit(event);
        },
        options
      );
      this.unregisterFns.push(unreg);
    });
  }

  ngOnDestroy(): void {
    this.unregisterFns.forEach((unreg) => unreg());
    this.unregisterFns = [];
  }
}
