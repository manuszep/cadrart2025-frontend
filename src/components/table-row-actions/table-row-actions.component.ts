import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartButtonComponent } from '../button/button.component';

@Component({
  selector: 'cadrart-table-row-actions',
  templateUrl: './table-row-actions.component.html',
  styleUrls: ['./table-row-actions.component.scss'],
  imports: [CommonModule, CadrartButtonComponent, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartTableRowActionsComponent<TEntry> {
  public entry = input.required<TEntry>();
  public actions = input<Array<any>>([]);

  handleActionClick(action: any): void {
    if (!action.disabled) {
      action.action(this.entry());
    }
  }
}
