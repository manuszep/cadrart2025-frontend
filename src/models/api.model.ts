import { ICadrartApiEntity } from '@manuszep/cadrart2025-common';

import { PartialDeep } from '../utils/types';

export abstract class CadrartEntity<TEntity extends ICadrartApiEntity> {
  protected _data: PartialDeep<TEntity> = {} as PartialDeep<TEntity>;

  constructor(data: PartialDeep<TEntity> = {} as PartialDeep<TEntity>) {
    this._data = data === null ? ({} as PartialDeep<TEntity>) : data;
  }

  public get id(): number | undefined {
    return this._data.id ?? undefined;
  }

  public getLabelForColumn(key: keyof PartialDeep<TEntity>): string {
    return String(this._data[key] ?? '');
  }

  public setValues(data: PartialDeep<TEntity>): void {
    this._data = data;
  }

  public updateValues(data: PartialDeep<TEntity>): void {
    this._data = { ...this._data, ...data };
  }

  public getRawValue(): PartialDeep<TEntity> {
    return this._data;
  }
}
