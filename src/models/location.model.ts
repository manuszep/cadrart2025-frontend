import { ICadrartJob, ICadrartLocation } from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export class CadrartLocation extends CadrartEntity<ICadrartLocation> {
  get name(): string | null {
    return this._data.name ?? null;
  }

  get jobs(): PartialDeep<ICadrartJob[]> {
    return this._data.jobs ?? [];
  }
}
