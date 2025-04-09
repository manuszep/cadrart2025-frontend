import { Injectable } from '@angular/core';
import { ICadrartTag } from '@manuszep/cadrart2025-common';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartTagService extends CadrartApiService<ICadrartTag> {
  endpointName = 'tag';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  public getName(entity: ICadrartTag): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Tag';
  }

  override mapEntityForOption(entity: ICadrartTag): { label: string; value: ICadrartTag } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }
}
