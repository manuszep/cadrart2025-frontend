import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';
import { CadrartArticle } from './article.model';

export class CadrartProvider extends CadrartEntity<ICadrartProvider> {
  get name(): string | null {
    return this._data.name ?? null;
  }

  get address(): string | null {
    return this._data.address ?? null;
  }

  get vat(): string | null {
    return this._data.vat ?? null;
  }

  get iban(): string | null {
    return this._data.iban ?? null;
  }

  get mail(): string | null {
    return this._data.mail ?? null;
  }

  get articles(): CadrartArticle[] | null {
    return this._data.articles ? this._data.articles.map((article) => new CadrartArticle(article)) : null;
  }
}
