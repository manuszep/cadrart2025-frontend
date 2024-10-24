import { ICadrartClient, ICadrartTag } from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export class CadrartTag extends CadrartEntity<ICadrartTag> {
  get name(): string | null {
    return this._data.name ?? null;
  }

  get clients(): PartialDeep<ICadrartClient[]> | null {
    return this._data.clients ?? null;
  }
}
