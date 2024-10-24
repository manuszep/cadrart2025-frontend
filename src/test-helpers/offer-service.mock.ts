import { ECadrartOfferStatus, ICadrartEntitiesResponse, ICadrartOffer } from '@manuszep/cadrart2025-common';
import { Observable, of } from 'rxjs';

import { CadrartMockApiService } from './api-service.mock';

export class CadrartMockOfferService extends CadrartMockApiService<ICadrartOffer> {
  endpointName = 'offer';

  public getName(entity: ICadrartOffer): string {
    return `${entity.id}`;
  }

  getEntities(
    page: number,
    count: number,
    createdAtGt?: string,
    createdAtLt?: string,
    status?: ECadrartOfferStatus
  ): Observable<ICadrartEntitiesResponse<ICadrartOffer>> {
    const start = page - 1 * count;
    const end = start + count;
    const data = this.mockDataArray.slice(start, end);

    return of({
      statusCode: 200,
      entities: data,
      total: this.mockDataArray.length
    });
  }

  override mapEntityForOption(entity: ICadrartOffer): { label: string; value: ICadrartOffer } {
    return {
      label: `${entity.number}`,
      value: entity
    };
  }

  getEntitiesForClient(clientId: number): Observable<ICadrartOffer[]> {
    return of(this.mockDataArray);
  }
}
