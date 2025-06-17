import { Directive, ElementRef, OnDestroy, Renderer2, effect, input, output } from '@angular/core';

@Directive({
  selector: '[cadrartHotkey]',
  standalone: true
})
export class CadrartHotkeyDirective implements OnDestroy {
  public hotkey$ = input<string | null>(null, { alias: 'cadrartHotkey' });
  public cadrartHotkeyTrigger = output<void>();

  private _hotKeyHandler?: () => void;

  constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef) {
    effect(() => {
      const key = this.hotkey$();

      if (this._hotKeyHandler) {
        this._hotKeyHandler();
      }

      if (key) {
        this._hotKeyHandler = this.renderer.listen('window', 'keydown', (e: KeyboardEvent) =>
          this.handleHotKey(e, key)
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this._hotKeyHandler) {
      this._hotKeyHandler();
    }
  }

  private handleHotKey(e: KeyboardEvent, key: string): void {
    const parts = key.split('.');
    const modifiers = parts.slice(0, parts.length - 1);

    if (modifiers.length > 0) {
      if (modifiers.includes('ctrl') && !e.ctrlKey) {
        return;
      }

      if (modifiers.includes('alt') && !e.altKey) {
        return;
      }

      if (modifiers.includes('shift') && !e.shiftKey) {
        return;
      }
    }

    const specialKeys = ['enter', 'escape', 'space', 'tab'];
    const lastKey = parts[parts.length - 1].toLowerCase();

    if (specialKeys.includes(lastKey) && e.code && e.code.toLowerCase() === lastKey) {
      this.cadrartHotkeyTrigger.emit();
    }

    if (e.code && e.code.toLowerCase() === `key${lastKey}`) {
      this.cadrartHotkeyTrigger.emit();
    }
  }
}
