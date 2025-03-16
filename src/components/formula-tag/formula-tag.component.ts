import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cadrart-formula-tag',
  templateUrl: './formula-tag.component.html',
  styleUrls: ['./formula-tag.component.scss'],
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
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
