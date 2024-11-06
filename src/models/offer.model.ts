import {
  ECadrartOfferStatus,
  ICadrartClient,
  ICadrartJob,
  ICadrartOffer,
  ICadrartTeamMember
} from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

import { CadrartEntity } from './api.model';

export class CadrartOffer extends CadrartEntity<ICadrartOffer> {
  get createdAt(): Date | null {
    const d = this._data.createdAt;

    if (!d) {
      return null;
    }

    if (d instanceof Date) {
      return d;
    }

    return new Date(d);
  }

  get offerDate(): string {
    const d = this.createdAt;

    if (!d) {
      return '';
    }

    return d.toLocaleDateString('fr-FR');
  }

  get number(): string | null {
    return this._data.number ?? null;
  }

  get client(): PartialDeep<ICadrartClient> | null {
    return this._data.client ?? null;
  }

  get clientName(): string {
    if (!this.client) {
      return '';
    }

    return `${this.client.firstName} ${this.client.lastName}`;
  }

  get clientAddress(): string {
    if (!this.client) {
      return '';
    }

    return `${this.client.address}`;
  }

  get assignedTo(): PartialDeep<ICadrartTeamMember> | null {
    return this._data.assignedTo ?? null;
  }

  get assignedToName(): string {
    if (!this.assignedTo) {
      return '';
    }

    return `${this.assignedTo.firstName} ${this.assignedTo.lastName}`;
  }

  get status(): ECadrartOfferStatus {
    return this._data.status ?? ECadrartOfferStatus.STATUS_CREATED;
  }

  get adjustedReduction(): number | null {
    return this._data.adjustedReduction ?? null;
  }

  get adjustedVat(): number | null {
    return this._data.adjustedVat ?? null;
  }

  get jobs(): PartialDeep<ICadrartJob[]> | null {
    return this._data.jobs ?? null;
  }

  get total(): number | null {
    return this._data.total ?? null;
  }

  get totalBeforeReduction(): number | null {
    return this._data.totalBeforeReduction ?? null;
  }

  get totalWithVat(): number | null {
    return this._data.totalWithVat ?? null;
  }

  public start(): void {
    this._data.status = ECadrartOfferStatus.STATUS_STARTED;
  }

  public stop(): void {
    this._data.status = ECadrartOfferStatus.STATUS_CREATED;
  }

  public complete(): void {
    this._data.status = ECadrartOfferStatus.STATUS_DONE;
  }

  public getVat(): number {
    const clientVat = this.client && !isNaN(Number(this.client.vat)) ? Number(this.client.vat) : 21;
    const offerVat = this.adjustedVat && !isNaN(Number(this.adjustedVat)) ? Number(this.adjustedVat) : undefined;

    return offerVat ?? clientVat;
  }

  public getReduction(): number {
    const clientReduction = this.client && !isNaN(Number(this.client.reduction)) ? Number(this.client.reduction) : 0;
    const offerReduction =
      this.adjustedReduction && !isNaN(Number(this.adjustedReduction)) ? Number(this.adjustedReduction) : 0;

    return offerReduction ?? clientReduction;
  }
}
