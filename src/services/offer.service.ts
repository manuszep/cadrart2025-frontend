import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICadrartOffer, ICadrartEntitiesResponse, ECadrartOfferStatus } from '@manuszep/cadrart2025-common';

import { CadrartApiService } from './api.service';
import { CadrartCacheService } from './cache.service';

@Injectable({ providedIn: 'root' })
export class CadrartOfferService extends CadrartApiService<ICadrartOffer> {
  endpointName = 'offer';

  constructor(protected override readonly cache: CadrartCacheService) {
    super(cache);
  }

  public getName(entity: ICadrartOffer): string {
    return `${entity.id}`;
  }

  override shouldUpdateFromSocketEvent(operation: 'create' | 'update' | 'delete', name: string): boolean {
    return name === 'Offer';
  }

  override mapEntityForOption(entity: ICadrartOffer): { label: string; value: ICadrartOffer } {
    return {
      label: `${entity.number}`,
      value: entity
    };
  }

  override getEntities(
    page: number,
    count: number,
    createdAtGt?: string,
    createdAtLt?: string,
    status?: ECadrartOfferStatus
  ): Observable<ICadrartEntitiesResponse<ICadrartOffer>> {
    let queryString = `?page=${page}&count=${count}`;

    if (createdAtLt) {
      queryString = queryString.concat(`&createdAtLt=${createdAtLt}`);
    }

    if (createdAtGt) {
      queryString = queryString.concat(`&createdAtGt=${createdAtGt}`);
    }

    if (typeof status !== 'undefined') {
      queryString = queryString.concat(`&status=${status}`);
    }

    return (
      this.cache.makeRequest('get', `${this.endpointName}${queryString}`) as Observable<
        ICadrartEntitiesResponse<ICadrartOffer>
      >
    ).pipe(
      map((response: ICadrartEntitiesResponse<ICadrartOffer>) => {
        return response;
      })
    );
  }

  getEntitiesForClient(clientId: number): Observable<ICadrartOffer[]> {
    return (
      this.cache.makeRequest('get', `${this.endpointName}/client/${clientId}`) as Observable<
        ICadrartEntitiesResponse<ICadrartOffer>
      >
    ).pipe(
      map((response: ICadrartEntitiesResponse<ICadrartOffer>) => {
        return response.entities;
      })
    );
  }
}
