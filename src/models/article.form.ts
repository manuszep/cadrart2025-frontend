import {
  ECadrartArticleFamily,
  ECadrartArticlePriceMethod,
  ICadrartArticle,
  ICadrartFormula,
  ICadrartProvider
} from '@manuszep/cadrart2025-common';
import { AbstractControlOptions } from '@angular/forms';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFieldSelect } from '../form-system/select/select.config';
import { CadrartProviderService } from '../services/provider.service';
import { CadrartFormulaService } from '../services/formula.service';
import { CadrartFieldCheckbox } from '../form-system/checkbox/checkbox.config';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';

function getFormConfig(providerService: CadrartProviderService, formulaService: CadrartFormulaService): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    name: new CadrartFormControl('', new CadrartFieldText({ required: true, minLength: 2, maxLength: 100 })),
    place: new CadrartFormControl('', new CadrartFieldText({ required: false, minLength: 2, maxLength: 50 })),
    buyPrice: new CadrartFormControl(
      0,
      new CadrartFieldNumber({ required: true, min: 0, max: 99999, iconAfter: 'euro' })
    ),
    sellPrice: new CadrartFormControl(
      0,
      new CadrartFieldNumber({ required: true, min: 0, max: 99999, iconAfter: 'euro' })
    ),
    getPriceMethod: new CadrartFormControl(
      ECadrartArticlePriceMethod.BY_LENGTH,
      new CadrartFieldSelect({
        required: true,
        options: [
          {
            label: `ARTICLE.PRICEMETHOD.${ECadrartArticlePriceMethod.BY_LENGTH}`,
            value: ECadrartArticlePriceMethod.BY_LENGTH
          },
          {
            label: `ARTICLE.PRICEMETHOD.${ECadrartArticlePriceMethod.BY_AREA}`,
            value: ECadrartArticlePriceMethod.BY_AREA
          },
          {
            label: `ARTICLE.PRICEMETHOD.${ECadrartArticlePriceMethod.BY_FIX_VALUE}`,
            value: ECadrartArticlePriceMethod.BY_FIX_VALUE
          }
        ]
      })
    ),
    family: new CadrartFormControl(
      ECadrartArticleFamily.GLASS,
      new CadrartFieldSelect({
        required: true,
        options: [
          { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.GLASS}`, value: ECadrartArticleFamily.GLASS },
          { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.WOOD}`, value: ECadrartArticleFamily.WOOD },
          { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.CARDBOARD}`, value: ECadrartArticleFamily.CARDBOARD },
          { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.ASSEMBLY}`, value: ECadrartArticleFamily.ASSEMBLY },
          { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.PASS}`, value: ECadrartArticleFamily.PASS }
        ]
      })
    ),
    maxReduction: new CadrartFormControl<number | undefined>(
      100,
      new CadrartFieldNumber({
        min: 0,
        max: 100,
        iconAfter: 'percent'
      })
    ),
    provider: new CadrartFormControl<ICadrartProvider | undefined>(
      undefined,
      new CadrartFieldSelect({ required: false, options: providerService.getEntitiesAsOptions() })
    ),
    formula: new CadrartFormControl<ICadrartFormula | undefined>(
      undefined,
      new CadrartFieldSelect({ required: false, options: formulaService.getEntitiesAsOptions() })
    ),
    providerRef: new CadrartFormControl('', new CadrartFieldText({ required: false, minLength: 2, maxLength: 50 })),
    maxLength: new CadrartFormControl<number | undefined>(
      undefined,
      new CadrartFieldNumber({ required: false, min: 0, max: 9999, textAfter: 'cm' })
    ),
    maxWidth: new CadrartFormControl<number | undefined>(
      undefined,
      new CadrartFieldNumber({ required: false, min: 0, max: 9999, textAfter: 'cm' })
    ),
    combine: new CadrartFormControl(false, new CadrartFieldCheckbox({ required: false }))
  };
}

export class CadrartArticleForm extends CadrartFormGroup<ICadrartArticle> {
  constructor(
    providerService: CadrartProviderService,
    formulaService: CadrartFormulaService,
    entity?: ICadrartArticle,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(providerService, formulaService), entity ?? {}, options);
  }
}
