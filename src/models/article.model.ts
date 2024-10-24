import {
  ECadrartArticleFamily,
  ECadrartArticlePriceMethod,
  ICadrartArticle,
  ICadrartFormula,
  ICadrartProvider,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export class CadrartArticle extends CadrartEntity<ICadrartArticle> {
  get name(): string | null {
    return this._data.name ?? null;
  }

  get place(): string | null {
    return this._data.place ?? null;
  }

  get buyPrice(): number | null {
    return this._data.buyPrice ?? null;
  }

  get sellPrice(): number | null {
    return this._data.sellPrice ?? null;
  }

  get getPriceMethod(): ECadrartArticlePriceMethod {
    return this._data.getPriceMethod ?? ECadrartArticlePriceMethod.BY_LENGTH;
  }

  get family(): ECadrartArticleFamily {
    return this._data.family ?? ECadrartArticleFamily.GLASS;
  }

  get maxReduction(): number | null {
    return this._data.maxReduction ?? null;
  }

  get provider(): PartialDeep<ICadrartProvider> | null {
    return this._data.provider ?? null;
  }

  get formula(): PartialDeep<ICadrartFormula> | null {
    return this._data.formula ?? null;
  }

  get providerRef(): string | null {
    return this._data.providerRef ?? null;
  }

  get maxLength(): number | null {
    return this._data.maxLength ?? null;
  }

  get maxWidth(): number | null {
    return this._data.maxWidth ?? null;
  }

  get combine(): boolean {
    return this._data.combine ?? false;
  }

  get tasks(): PartialDeep<ICadrartTask[]> | null {
    return this._data.tasks ?? null;
  }
}
