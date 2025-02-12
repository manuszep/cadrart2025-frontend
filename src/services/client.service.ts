import { Injectable } from '@angular/core';
import { ICadrartClient } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartClientService extends CadrartApiService<ICadrartClient> {
  endpointName = 'client';

  constructor(protected override readonly cache: CadrartCacheService) {
    super(cache);
  }

  public getName(entity: ICadrartClient): string {
    const value = `${entity.firstName ?? ''} ${entity.lastName ?? ''}`;

    return value !== '' && value !== ' ' ? value : '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Client';
  }

  override mapEntityForOption(entity: ICadrartClient): { label: string; value: ICadrartClient } {
    return {
      label: `${entity.firstName} ${entity.lastName}`,
      value: entity
    };
  }
}
