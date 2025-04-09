import { Injectable } from '@angular/core';
import { ECadrartArticleFamily, ICadrartEntitiesResponse, ICadrartExtendedTask } from '@manuszep/cadrart2025-common';
import { Observable } from 'rxjs';

import { CadrartAlertService } from '../components/alert/alert.service';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartTaskService extends CadrartApiService<ICadrartExtendedTask> {
  endpointName = 'task';

  constructor(
    protected override readonly cache: CadrartCacheService,
    protected override readonly alertService: CadrartAlertService
  ) {
    super(cache, alertService);
  }

  public getName(entity: ICadrartExtendedTask): string {
    return `${entity.id}`;
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Task' || name === 'Offer';
  }

  getEntitiesForFamily(family: ECadrartArticleFamily): Observable<ICadrartEntitiesResponse<ICadrartExtendedTask>> {
    const familyRouteMapping = {
      [ECadrartArticleFamily.ASSEMBLY]: 'assembly',
      [ECadrartArticleFamily.CARDBOARD]: 'cardboard',
      [ECadrartArticleFamily.GLASS]: 'glass',
      [ECadrartArticleFamily.PASS]: 'pass',
      [ECadrartArticleFamily.WOOD]: 'wood'
    };

    return this.cache.makeRequest('get', `${this.endpointName}/${familyRouteMapping[family]}`) as Observable<
      ICadrartEntitiesResponse<ICadrartExtendedTask>
    >;
  }
}
