import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { ICadrartFormula } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartFormulaTagComponent } from '../../../components/formula-tag/formula-tag.component';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartSafePipe } from '../../../pipes/safe.pipe';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartFormulaService } from '../../../services/formula.service';
import { CadrartFieldComponent } from '../../../form-system/field/field.component';
import { CadrartFormulaForm, ICadrartFormulaParsedForm } from '../../../models/formula.form';

import { CadrartFormulaPipe } from './formula.pipe';

@Component({
  selector: 'cadrart-route-settings-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartFormulaPipe,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartSafePipe,
    CadrartFormulaTagComponent,
    CadrartButtonComponent,
    CadrartFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteSettingsFormulaComponent extends CadrartSettingsPageComponent<
  ICadrartFormula,
  CadrartFormulaForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartFormulaService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  getFormulaControl(): FormArray<ICadrartFormulaParsedForm> {
    return this.entityFormGroup?.get('formula') as FormArray<ICadrartFormulaParsedForm>;
  }

  addFormula(): void {
    this.entityFormGroup?.addFormula();
  }

  removeFormula(index: number): void {
    this.entityFormGroup?.removeFormula(index);
  }

  public override handleNewClick(): void {
    super.handleNewClick();
    this.addFormula();
  }

  public override getNewForm(entity: ICadrartFormula): CadrartFormulaForm {
    return new CadrartFormulaForm(entity);
  }
}
