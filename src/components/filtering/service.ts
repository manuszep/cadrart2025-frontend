import { Injectable, Signal, signal } from "@angular/core";

export const SORTING_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
}

export type TSortingDirection = typeof SORTING_DIRECTION[keyof typeof SORTING_DIRECTION];

export type TSorting = {
  key: string;
  direction: TSortingDirection;
}

@Injectable({ providedIn: 'root' })
export class CadrartFilteringService {
  private _$needle = signal<string | null>(null);
  private _$sorting = signal<TSorting | null>(null);

  public get needle(): Signal<string | null> {
    return this._$needle.asReadonly();
  }

  public get sorting(): Signal< TSorting | null> {
    return this._$sorting.asReadonly();
  }
}
