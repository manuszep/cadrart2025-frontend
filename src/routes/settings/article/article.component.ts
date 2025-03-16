import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ECadrartArticlePriceMethod, ICadrartArticle } from '@manuszep/cadrart2025-common';
import { EsfsFieldComponent, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartSettingsPageComponent } from '../../../components/settings-page/settings-page.component';
import { CadrartDataConnectorService } from '../../../services/data-connector.service';
import { CadrartArticleService } from '../../../services/article.service';
import { CadrartTableComponent } from '../../../components/table/table.component';
import { CadrartTableValueFormatterDirective } from '../../../components/table/table-value-formatter.directive';
import { CadrartIconComponent } from '../../../components/icon/icon.component';
import { CadrartFormulaTagComponent } from '../../../components/formula-tag/formula-tag.component';
import { CadrartArticleForm } from '../../../models/article.form';
import { CadrartProviderService } from '../../../services/provider.service';
import { CadrartFormulaService } from '../../../services/formula.service';

@Component({
  selector: 'cadrart-route-settings-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CadrartTableComponent,
    CadrartTableValueFormatterDirective,
    CadrartIconComponent,
    CadrartFormulaTagComponent,
    EsfsFieldComponent,
    EsfsFormGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartRouteSettingsArticleComponent extends CadrartSettingsPageComponent<
  ICadrartArticle,
  CadrartArticleForm
> {
  constructor(
    protected override readonly dataConnectorService: CadrartDataConnectorService,
    protected override readonly headerService: CadrartHeaderService,
    protected override readonly inspectorService: CadrartInspectorService,
    protected override readonly service: CadrartArticleService,
    protected readonly providerService: CadrartProviderService,
    protected readonly formulaService: CadrartFormulaService
  ) {
    super(dataConnectorService, headerService, inspectorService, service);
  }

  public override getNewForm(entity: ICadrartArticle): CadrartArticleForm {
    return new CadrartArticleForm(this.providerService, this.formulaService, entity);
  }

  public handlePriceMethodChange(data: ECadrartArticlePriceMethod): void {
    if (data === ECadrartArticlePriceMethod.BY_FIX_VALUE) {
      this.entityFormGroup?.get('maxLength')?.reset();
      this.entityFormGroup?.get('maxWidth')?.reset();
    }

    if (data === ECadrartArticlePriceMethod.BY_LENGTH) {
      this.entityFormGroup?.get('maxWidth')?.reset();
    }
  }
}
