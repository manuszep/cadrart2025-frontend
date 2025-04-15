import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output
} from '@angular/core';

import { CadrartIconComponent } from '../icon/icon.component';
import { ICadrartIcon } from '../icon/icon.model';
import { ICadrartColor, ICadrartSize } from '../../styles/styles.model';

@Component({
  selector: 'cadrart-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CadrartIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartButtonComponent implements OnDestroy {
  private _hotKeyHandler?: () => void;

  public type = input<'button' | 'submit' | 'reset'>('button');
  public disabled = input(false);
  public loading = input(false);
  public icon = input<ICadrartIcon | null>(null);
  public iconPosition = input<'left' | 'right'>('left');
  public iconOnly = input(false);
  public size = input<ICadrartSize>('medium');
  public color = input<ICadrartColor>('primary');
  public hoverColor = input<ICadrartColor | null>(null);
  public outline = input(false);
  public grow = input(false);
  public tag = input<string | null>(null);
  public justify = input<'left' | 'center' | 'right'>('center');
  public tabIndex = input(0);
  public hotKey = input<string | undefined | null>(null);

  public cls = computed(() => {
    const loadingCls = this.loading() ? ' cadrart-button--loading' : '';
    const iconPositionCls = this.iconPosition() && this.icon() ? ` cadrart-button--icon-${this.iconPosition()}` : '';
    const iconOnlyCls = this.iconOnly() ? ' cadrart-button--icon-only' : '';
    const sizeCls = this.size() ? ` cadrart-button--${this.size()}` : '';
    const colorCls = this.color() ? ` cadrart-button--${this.color()}` : '';
    const outlineCls = this.outline() ? ' cadrart-button--outline' : '';
    const growCls = this.grow() ? ' cadrart-button--grow' : '';
    const justifyCls = this.justify() ? ` cadrart-button--justify-${this.justify()}` : '';
    const hoverColorCls = this.hoverColor() ? ` cadrart-button--hover-${this.hoverColor()}` : '';

    return `cadrart-button${loadingCls}${iconPositionCls}${iconOnlyCls}${sizeCls}${colorCls}${outlineCls}${growCls}${justifyCls}${hoverColorCls}`;
  });

  public cadrartClick = output<void>();

  constructor(private readonly renderer: Renderer2) {
    effect(() => {
      const key = this.hotKey();

      if (this._hotKeyHandler) {
        this._hotKeyHandler();
      }

      if (key) {
        this._hotKeyHandler = this.renderer.listen(`window`, `keydown`, (e: KeyboardEvent) =>
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

  handleClick(): void {
    this.cadrartClick.emit();
  }

  handleHotKey(e: KeyboardEvent, key: string): void {
    if (this.disabled()) {
      return;
    }

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
      this.cadrartClick.emit();
    }

    if (e.code && e.code.toLowerCase() === `key${lastKey}`) {
      this.cadrartClick.emit();
    }
  }
}
