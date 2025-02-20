import {
  ECadrartArticleFamily,
  ECadrartArticlePriceMethod,
  ICadrartArticle,
  ICadrartFormula,
  ICadrartProvider
} from '@manuszep/cadrart2025-common';
import {
  EsfsFormControl,
  EsfsFormControlCheckbox,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { CadrartProviderService } from '../services/provider.service';
import { CadrartFormulaService } from '../services/formula.service';

function getFormConfig(
  providerService: CadrartProviderService,
  formulaService: CadrartFormulaService
): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    name: new EsfsFormControlText('', { required: true, minLength: 2, maxLength: 100 }),
    place: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 50 }),
    buyPrice: new EsfsFormControlNumber(0, { required: true, min: 0, max: 99999, iconAfter: 'euro' }),
    sellPrice: new EsfsFormControlNumber(0, { required: true, min: 0, max: 99999, iconAfter: 'euro' }),
    getPriceMethod: new EsfsFormControlDropdown(ECadrartArticlePriceMethod.BY_LENGTH, {
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
    }),
    family: new EsfsFormControlDropdown(ECadrartArticleFamily.GLASS, {
      required: true,
      options: [
        { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.GLASS}`, value: ECadrartArticleFamily.GLASS },
        { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.WOOD}`, value: ECadrartArticleFamily.WOOD },
        { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.CARDBOARD}`, value: ECadrartArticleFamily.CARDBOARD },
        { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.ASSEMBLY}`, value: ECadrartArticleFamily.ASSEMBLY },
        { label: `ARTICLE.FAMILY.${ECadrartArticleFamily.PASS}`, value: ECadrartArticleFamily.PASS }
      ]
    }),
    maxReduction: new EsfsFormControlNumber(100, {
      min: 0,
      max: 100,
      iconAfter: 'percent'
    }),
    provider: new EsfsFormControlDropdown<ICadrartProvider | undefined>(undefined, {
      required: false,
      options: providerService.getEntitiesAsOptions()
    }),
    formula: new EsfsFormControlDropdown<ICadrartFormula | undefined>(undefined, {
      required: false,
      options: formulaService.getEntitiesAsOptions()
    }),
    providerRef: new EsfsFormControlText('', { required: false, minLength: 2, maxLength: 50 }),
    maxLength: new EsfsFormControlNumber(null, { required: false, min: 0, max: 9999, textAfter: true }),
    maxWidth: new EsfsFormControlNumber(null, { required: false, min: 0, max: 9999, textAfter: true }),
    combine: new EsfsFormControlCheckbox(false, { required: false })
  };
}

export class CadrartArticleForm extends EsfsFormGroup<ICadrartArticle> {
  constructor(
    providerService: CadrartProviderService,
    formulaService: CadrartFormulaService,
    entity?: ICadrartArticle,
    options: IEsfsFormGroupOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(providerService, formulaService), options, 'FIELD', false, entity ?? {});
  }
}
