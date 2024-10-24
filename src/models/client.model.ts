import { ICadrartClient, ICadrartTag } from '@manuszep/cadrart2025-common';

import { CadrartEntity } from './api.model';
import { CadrartTag } from './tag.model';
import { CadrartOffer } from './offer.model';

export class CadrartClient extends CadrartEntity<ICadrartClient> {
  get lastName(): string | null {
    return this._data.lastName ?? null;
  }

  get firstName(): string | null {
    return this._data.firstName ?? null;
  }

  get company(): string | null {
    return this._data.company ?? null;
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

  get phone2(): string | null {
    return this._data.phone2 ?? null;
  }

  get vat(): number | null {
    return this._data.vat ?? null;
  }

  get tag(): CadrartTag | null {
    return this._data.tag ? new CadrartTag(this._data.tag as ICadrartTag) : null;
  }

  get reduction(): number {
    return this._data.reduction ?? 0;
  }

  get offers(): CadrartOffer[] | null {
    return this._data.offers ? this._data.offers.map((offer) => new CadrartOffer(offer)) : null;
  }

  /**
   * Computed values
   */
  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
