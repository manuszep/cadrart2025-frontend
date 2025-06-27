import { Injectable } from '@angular/core';
import {
  ECadrartArticleFamily,
  ICadrartEntitiesResponse,
  ICadrartExtendedTask,
  ICadrartSocketUpdateEntity
} from '@manuszep/cadrart2025-common';
import { Observable, take } from 'rxjs';

import { CadrartAlertService } from '../components/alert/alert.service';
import { CadrartExtendedTask } from '../models/extended-task.model';

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

  override handleSocketUpdate(data: ICadrartSocketUpdateEntity<ICadrartExtendedTask>): void {
    if (!this.shouldUpdateFromSocketEvent('update', data.name)) {
      return;
    }

    this.cache.clearCache([
      {
        name: this.endpointName,
        refetch: true
      },
      {
        name: `${this.endpointName}/${data.entity.id}`,
        refetch: true
      },
      {
        name: `${this.endpointName}/assembly`,
        refetch: true
      },
      {
        name: `${this.endpointName}/cardboard`,
        refetch: true
      },
      {
        name: `${this.endpointName}/glass`,
        refetch: true
      },
      {
        name: `${this.endpointName}/pass`,
        refetch: true
      },
      {
        name: `${this.endpointName}/wood`,
        refetch: true
      }
    ]);
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

  doTask(task: CadrartExtendedTask): void {
    this.cache.makeRequest('put', `${this.endpointName}/${task.id}/do`).pipe(take(1)).subscribe();
  }

  undoTask(task: CadrartExtendedTask): void {
    this.cache.makeRequest('put', `${this.endpointName}/${task.id}/undo`).pipe(take(1)).subscribe();
  }

  blockTask(task: CadrartExtendedTask): void {
    this.cache.makeRequest('put', `${this.endpointName}/${task.id}/block`).pipe(take(1)).subscribe();
  }
}
