import { Injectable } from '@angular/core';
import { ICadrartFormula } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CadrartFormulaService extends CadrartApiService<ICadrartFormula> {
  endpointName = 'formula';

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
