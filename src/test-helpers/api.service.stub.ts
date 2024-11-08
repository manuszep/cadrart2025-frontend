import { map, Observable, of } from 'rxjs';
import {
  ICadrartApiEntity,
  ICadrartEntitiesResponse,
  ICadrartSocketCreateEntity,
  ICadrartSocketDeleteEntity,
  ICadrartSocketUpdateEntity
} from '@manuszep/cadrart2025-common';

export abstract class CadrartMockApiService<T extends ICadrartApiEntity> {
  abstract endpointName: string;

  public mockDataArray: T[] = [];
  public mockDataItem?: T;

  public abstract getName(entity: T): string;

  public setMockDataArray(data: T[]): void {
    this.mockDataArray = data;
  }

  public setMockDataItem(data: T): void {
    this.mockDataItem = data;
  }

  getEntities(page: number, count: number): Observable<ICadrartEntitiesResponse<T>> {
    const start = page - 1 * count;
    const end = start + count;
    const data = this.mockDataArray.slice(start, end);

    return of({
      statusCode: 200,
      entities: data,
      total: this.mockDataArray.length
    });
  }

  getEntitiesAsOptions(): Observable<{ label: string; value: unknown }[]> {
    return this.getEntities(1, 1000).pipe(
      map((response: ICadrartEntitiesResponse<T>) => {
        return response.entities.map((entity: T) => this.mapEntityForOption(entity));
      })
    );
  }

  mapEntityForOption(entity: T): { label: string; value: T } {
    return {
      label: `${entity.id}`,
      value: entity
    };
  }

  getEntity(_id: string): Observable<T> {
    return of(this.mockDataItem as T);
  }

  addOrUpdateEntity(data: T): Observable<T> {
    if (typeof data.id !== 'undefined') {
      return this.updateEntity(data.id as number, data);
    }

    return this.addEntity(data);
  }

  addEntity(data: T): Observable<T> {
    return of({
      ...data,
      id: 1
    });
  }

  updateEntity(_id: number, data: T): Observable<T> {
    return of(data);
  }

  deleteEntity(_id: number): Observable<T> {
    return of(this.mockDataItem as T);
  }

  shouldUpdateFromSocketEvent(_operation: 'create' | 'update' | 'delete', _name: string): boolean {
    return true;
  }

  handleSocketCreate(_data: ICadrartSocketCreateEntity<T>): void {
    return;
  }

  handleSocketUpdate(_data: ICadrartSocketUpdateEntity<T>): void {
    return;
  }

  handleSocketDelete(_data: ICadrartSocketDeleteEntity): void {
    return;
  }
}
