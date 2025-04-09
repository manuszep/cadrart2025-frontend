import { Injectable } from '@angular/core';
import { ICadrartLocation } from '@manuszep/cadrart2025-common';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartLocationService extends CadrartApiService<ICadrartLocation> {
  endpointName = 'location';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  public getName(entity: ICadrartLocation): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Location';
  }

  override mapEntityForOption(entity: ICadrartLocation): { label: string; value: ICadrartLocation } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }
}
