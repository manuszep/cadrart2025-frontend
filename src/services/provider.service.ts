import { Injectable } from '@angular/core';
import { ICadrartProvider } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CadrartProviderService extends CadrartApiService<ICadrartProvider> {
  endpointName = 'provider';

  public getName(entity: ICadrartProvider): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Provider';
  }

  override mapEntityForOption(entity: ICadrartProvider): { label: string; value: ICadrartProvider } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }
}
