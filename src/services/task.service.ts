import { Injectable } from '@angular/core';
import { ICadrartExtendedTask } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartTaskService extends CadrartApiService<ICadrartExtendedTask> {
  endpointName = 'task';

  constructor(protected override readonly cache: CadrartCacheService) {
    super(cache);
  }

  public getName(entity: ICadrartExtendedTask): string {
    return `${entity.id}`;
  }

  override shouldUpdateFromSocketEvent(operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Task';
  }
}
