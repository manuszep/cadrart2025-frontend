import { Injectable } from '@angular/core';
import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartProviderService extends CadrartApiService<ICadrartProvider> {
  endpointName = 'provider';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  public getName(entity: ICadrartProvider): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Provider';
  }

  override mapEntityForOption(entity: ICadrartProvider): { label: string; value: ICadrartProvider } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }
}
