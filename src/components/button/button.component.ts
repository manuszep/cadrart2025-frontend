import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output } from '@angular/core';

import { CadrartIconComponent } from '../icon/icon.component';
import { ICadrartIcon } from '../icon/icon.model';
import { ICadrartColor, ICadrartSize } from '../../styles/styles.model';
import { CadrartHotkeyDirective } from '../../directives/hotkey.directive';

@Component({
  selector: 'cadrart-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  imports: [CadrartIconComponent, CadrartHotkeyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartButtonComponent {
  public type$ = input<'button' | 'submit' | 'reset'>('button', { alias: 'type' });
  public disabled$ = input(false, { alias: 'disabled' });
  public loading$ = input(false, { alias: 'loading' });
  public icon$ = input<ICadrartIcon | null>(null, { alias: 'icon' });
  public iconPosition$ = input<'left' | 'right'>('left', { alias: 'iconPosition' });
  public iconOnly$ = input(false, { alias: 'iconOnly' });
  public size$ = input<ICadrartSize>('medium', { alias: 'size' });
  public color$ = input<ICadrartColor>('primary', { alias: 'color' });
  public hoverColor$ = input<ICadrartColor | null>(null, { alias: 'hoverColor' });
  public outline$ = input(false, { alias: 'outline' });
  public grow$ = input(false, { alias: 'grow' });
  public tag$ = input<string | null>(null, { alias: 'tag' });
  public justify$ = input<'left' | 'center' | 'right'>('center', { alias: 'justify' });
  public tabIndex$ = input(0, { alias: 'tabIndex' });
  public hotKey$ = input<string | null>(null, { alias: 'hotKey' });

  public cls$ = computed(() => {
    const loadingCls = this.loading$() ? ' cadrart-button--loading' : '';
    const iconPositionCls = this.iconPosition$() && this.icon$() ? ` cadrart-button--icon-${this.iconPosition$()}` : '';
    const iconOnlyCls = this.iconOnly$() ? ' cadrart-button--icon-only' : '';
    const sizeCls = this.size$() ? ` cadrart-button--${this.size$()}` : '';
    const colorCls = this.color$() ? ` cadrart-button--${this.color$()}` : '';
    const outlineCls = this.outline$() ? ' cadrart-button--outline' : '';
    const growCls = this.grow$() ? ' cadrart-button--grow' : '';
    const justifyCls = this.justify$() ? ` cadrart-button--justify-${this.justify$()}` : '';
    const hoverColorCls = this.hoverColor$() ? ` cadrart-button--hover-${this.hoverColor$()}` : '';

    return `cadrart-button${loadingCls}${iconPositionCls}${iconOnlyCls}${sizeCls}${colorCls}${outlineCls}${growCls}${justifyCls}${hoverColorCls}`;
  });

  public cadrartClick = output<void>();

  public handleHotKey(): void {
    if (this.disabled$()) {
      return;
    }
    this.cadrartClick.emit();
  }
}
