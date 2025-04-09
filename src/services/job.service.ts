import { Injectable } from '@angular/core';
import { ICadrartJob } from '@manuszep/cadrart2025-common';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartJobService extends CadrartApiService<ICadrartJob> {
  endpointName = 'job';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  public getName(entity: ICadrartJob): string {
    return `${entity.id}`;
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Job';
  }

  override mapEntityForOption(entity: ICadrartJob): { label: string; value: ICadrartJob } {
    return {
      label: `${entity.id}`,
      value: entity
    };
  }
}
