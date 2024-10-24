import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CadrartActionsGroupComponent } from '../actions-group/actions-group.component';
import { CadrartButtonComponent } from '../button/button.component';
import { CadrartIconComponent } from '../icon/icon.component';

@Component({
  selector: 'cadrart-formula-tag',
  templateUrl: './formula-tag.component.html',
  styleUrls: ['./formula-tag.component.scss'],
  imports: [CommonModule, TranslateModule, CadrartButtonComponent, CadrartIconComponent, CadrartActionsGroupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartFormulaTagComponent {
  public formulaParts: string[] = [];

  @Input() set fomula(formula: string) {
    if (!formula) {
      this.formulaParts = [];

      return;
    }

    const parts = formula.split(';');

    this.formulaParts = parts.map((part) => {
      let newPart: string;

      newPart = part.replace('-', '&minus;');
      newPart = newPart.replace('+', '&plus;');
      newPart = newPart.replace('*', '&times;');
      newPart = newPart.replace('/', '&divide;');
      newPart = newPart.replace(
        /(&minus;|&plus;|&times;|&divide;)/g,
        `<span class="formula-tag__step__operator">$1</span>`
      );
      newPart = newPart.replace(':', '<span class="formula-tag__step__delimiter"></span>');

      return newPart;
    });
  }
}
