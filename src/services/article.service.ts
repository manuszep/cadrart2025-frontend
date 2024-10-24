import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ICadrartArticle, ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartArticleService extends CadrartApiService<ICadrartArticle> {
  endpointName = 'article';

  constructor(protected override readonly cache: CadrartCacheService) {
    super(cache);
  }

  public getName(entity: ICadrartArticle): string {
    return entity.name ?? '';
  }

  override shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Article';
  }

  override mapEntityForOption(entity: ICadrartArticle): { label: string; value: ICadrartArticle } {
    return {
      label: `${entity.name}`,
      value: entity
    };
  }

  getCombinable(): Observable<ICadrartArticle[]> {
    return (
      this.cache.makeRequest('get', `${this.endpointName}/combinable`) as Observable<
        ICadrartEntitiesResponse<ICadrartArticle>
      >
    ).pipe(
      map((response: ICadrartEntitiesResponse<ICadrartArticle>) => {
        return response.entities;
      })
    );
  }

  getCombinableAsOptions(): Observable<{ label: string; value: unknown }[]> {
    return this.getCombinable().pipe(
      map((entities: ICadrartArticle[]) => {
        return entities.map((entity: ICadrartArticle) => this.mapEntityForOption(entity));
      })
    );
  }
}
