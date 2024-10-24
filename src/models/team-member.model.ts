import { ICadrartTeamMember } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';
import { CadrartOffer } from './offer.model';

export class CadrartTeamMember extends CadrartEntity<ICadrartTeamMember> {
  get lastName(): string | null {
    return this._data.lastName ?? null;
  }

  get firstName(): string | null {
    return this._data.firstName ?? null;
  }

  get address(): string | null {
    return this._data.address ?? null;
  }

  get mail(): string | null {
    return this._data.mail ?? null;
  }

  get phone(): string | null {
    return this._data.phone ?? null;
  }

  get image(): string | null {
    return this._data.image ?? null;
  }

  get offers(): CadrartOffer[] | null {
    return this._data.offers ? this._data.offers.map((offer) => new CadrartOffer(offer)) : null;
  }
}
