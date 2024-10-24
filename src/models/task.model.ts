import { ICadrartArticle, ICadrartJob, ICadrartTask } from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export class CadrartTask extends CadrartEntity<ICadrartTask> {
  get job(): PartialDeep<ICadrartJob> | null {
    return this._data.job ?? null;
  }

  get article(): PartialDeep<ICadrartArticle> | null {
    return this._data.article ?? null;
  }

  get comment(): string | null {
    return this._data.comment ?? null;
  }

  get image(): string | null {
    return this._data.image ?? null;
  }

  get total(): number {
    return this._data.total ?? 0;
  }

  get totalBeforeReduction(): number {
    return this._data.totalBeforeReduction ?? 0;
  }

  get totalWithVat(): number {
    return this._data.totalWithVat ?? 0;
  }

  get doneCount(): number {
    return this._data.doneCount ?? 0;
  }

  get parent(): PartialDeep<ICadrartTask> | null {
    return this._data.parent ?? null;
  }

  get children(): PartialDeep<ICadrartTask>[] {
    return this._data.children ?? [];
  }
}
