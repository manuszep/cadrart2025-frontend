import { ICadrartClient } from '@manuszep/cadrart2025-common';

import { CadrartMockApiService } from './api.service.stub';

export class CadrartMockClientService extends CadrartMockApiService<ICadrartClient> {
  endpointName = 'offer';

  public getName(entity: ICadrartClient): string {
    return `${entity.firstName} ${entity.lastName}` ?? '';
  }

  override mapEntityForOption(entity: ICadrartClient): { label: string; value: ICadrartClient } {
    return {
      label: `${entity.firstName} ${entity.lastName}`,
      value: entity
    };
  }
}
