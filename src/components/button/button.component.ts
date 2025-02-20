import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation,
  signal
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
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartButtonComponent implements OnChanges, OnDestroy {
  private _hotKeyHandler?: () => void;

  public cls = signal('cadrart-button');

  @Input() public type: 'button' | 'submit' | 'reset' = 'button';
  @Input() public disabled = false;
  @Input() public loading = false;
  @Input() public icon: ICadrartIcon | null = null;
  @Input() public iconPosition: 'left' | 'right' = 'left';
  @Input() public iconOnly = false;
  @Input() public size: ICadrartSize = 'medium';
  @Input() public color: ICadrartColor = 'primary';
  @Input() public hoverColor: ICadrartColor | null = null;
  @Input() public outline = false;
  @Input() public grow = false;
  @Input() public tag: string | null = null;
  @Input() public justify: 'left' | 'center' | 'right' = 'center';
  @Input() public tabIndex = 0;
  @Input() public set hotKey(key: string | undefined | null) {
    if (this._hotKeyHandler) {
      this._hotKeyHandler();
    }

    if (key) {
      this._hotKeyHandler = this.renderer.listen(`window`, `keydown`, (e: KeyboardEvent) => this.handleHotKey(e, key));
    }
  }

  @Output() public cadrartClick: EventEmitter<void> = new EventEmitter();

  constructor(private readonly renderer: Renderer2) {}

  ngOnDestroy(): void {
    if (this._hotKeyHandler) {
      this._hotKeyHandler();
    }
  }

  ngOnChanges(): void {
    const loadingCls = this.loading ? ' cadrart-button--loading' : '';
    const iconPositionCls = this.iconPosition && this.icon ? ` cadrart-button--icon-${this.iconPosition}` : '';
    const iconOnlyCls = this.iconOnly ? ' cadrart-button--icon-only' : '';
    const sizeCls = this.size ? ` cadrart-button--${this.size}` : '';
    const colorCls = this.color ? ` cadrart-button--${this.color}` : '';
    const outlineCls = this.outline ? ' cadrart-button--outline' : '';
    const growCls = this.grow ? ' cadrart-button--grow' : '';
    const justifyCls = this.justify ? ` cadrart-button--justify-${this.justify}` : '';
    const hoverColorCls = this.hoverColor ? ` cadrart-button--hover-${this.hoverColor}` : '';

    this.cls.set(
      `cadrart-button${loadingCls}${iconPositionCls}${iconOnlyCls}${sizeCls}${colorCls}${outlineCls}${growCls}${justifyCls}${hoverColorCls}`
    );
  }

  handleClick(): void {
    this.cadrartClick.emit();
  }

  handleHotKey(e: KeyboardEvent, key: string): void {
    if (this.disabled) {
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
