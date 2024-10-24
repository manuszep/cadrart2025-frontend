import {
  ECadrartJobMeasureType,
  ECadrartJobOrientation,
  ICadrartJob,
  ICadrartLocation,
  ICadrartOffer,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export interface ICadrartJobTotal {
  total: number;
  totalWithVat: number;
  totalBeforeReduction: number;
}

export class CadrartJob extends CadrartEntity<ICadrartJob> {
  get offer(): PartialDeep<ICadrartOffer> | null {
    return this._data.offer ?? null;
  }

  get count(): number {
    return this._data.count ?? 1;
  }

  get orientation(): ECadrartJobOrientation {
    return this._data.orientation ?? ECadrartJobOrientation.VERTICAL;
  }

  get measure(): ECadrartJobMeasureType {
    return this._data.measure ?? ECadrartJobMeasureType.MEASURE_OPENING;
  }

  get location(): PartialDeep<ICadrartLocation> | null {
    return this._data.location ?? null;
  }

  get dueDate(): Date | null {
    return this._data.dueDate ?? null;
  }

  get startDate(): Date | null {
    return this._data.startDate ?? null;
  }

  get openingWidth(): number {
    return this._data.openingWidth ?? 0;
  }

  get openingHeight(): number {
    return this._data.openingHeight ?? 0;
  }

  get marginWidth(): number {
    return this._data.marginWidth ?? 0;
  }

  get marginHeight(): number {
    return this._data.marginHeight ?? 0;
  }

  get glassWidth(): number {
    return this._data.glassWidth ?? 0;
  }

  get glassHeight(): number {
    return this._data.glassHeight ?? 0;
  }

  get tasks(): PartialDeep<ICadrartTask>[] {
    return this._data.tasks ?? [];
  }

  get description(): string | null {
    return this._data.description ?? null;
  }

  get image(): string | null {
    return this._data.image ?? null;
  }

  get total(): number {
    return this._data.total ?? 0;
  }

  get totalWithVat(): number {
    return this._data.totalWithVat ?? 0;
  }

  get totalBeforeReduction(): number {
    return this._data.totalBeforeReduction ?? 0;
  }
}
