import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';

import { ICadrartButtonToggleItem } from './button-toggle.model';

@Component({
  selector: 'cadrart-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrls: ['./button-toggle.component.scss'],
  imports: [TranslateModule, CadrartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartButtonToggleComponent {
  public label = input<string>();
  public items = input<ICadrartButtonToggleItem[]>([]);
  public outline = input(false);
  public value = model<string | number>('');

  public cadrartChange = output<string | number>();

  handleClick(item: ICadrartButtonToggleItem): void {
    this.value.set(item.value);

    this.cadrartChange.emit(item.value);
  }
}
