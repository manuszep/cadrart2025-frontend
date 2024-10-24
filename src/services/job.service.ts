import { Injectable } from '@angular/core';
import { ICadrartJob } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartJobService extends CadrartApiService<ICadrartJob> {
  endpointName = 'job';

  constructor(protected override readonly cache: CadrartCacheService) {
    super(cache);
  }

  public getName(entity: ICadrartJob): string {
    return `${entity.id}`;
  }

  override shouldUpdateFromSocketEvent(operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Job';
  }

  override mapEntityForOption(entity: ICadrartJob): { label: string; value: ICadrartJob } {
    return {
      label: `${entity.id}`,
      value: entity
    };
  }
}
