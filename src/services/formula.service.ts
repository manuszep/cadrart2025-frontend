import { Injectable } from '@angular/core';
import { ICadrartFormula } from '@manuszep/cadrart2025-common';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartFormulaService extends CadrartApiService<ICadrartFormula> {
  endpointName = 'formula';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  getName(entity: ICadrartFormula): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Formula';
  }

  override mapEntityForOption(entity: ICadrartFormula): { label: string; value: ICadrartFormula } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }
}
