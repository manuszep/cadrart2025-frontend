import { Injectable } from '@angular/core';
import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  ICadrartApiEntity,
  ICadrartEntitiesResponse,
  ICadrartEntityResponse,
  ICadrartSocketCreateEntity,
  ICadrartSocketDeleteEntity,
  ICadrartSocketUpdateEntity
} from '@manuszep/cadrart2025-common';

import { CadrartCacheService } from './cache.service';

export type ICadrartRequestOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  context?: HttpContext;
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType: 'arraybuffer';
  withCredentials?: boolean;
};

@Injectable({ providedIn: 'root' })
export abstract class CadrartApiService<T extends ICadrartApiEntity> {
  abstract endpointName: string;

  constructor(protected readonly cache: CadrartCacheService) {
    this.cache.createSocket.subscribe((data: ICadrartSocketCreateEntity<T>) => {
      this.handleSocketCreate(data);
    });

    this.cache.updateSocket.subscribe((data: ICadrartSocketUpdateEntity<T>) => {
      this.handleSocketUpdate(data);
    });

    this.cache.deleteSocket.subscribe((data: ICadrartSocketDeleteEntity) => {
      this.handleSocketDelete(data);
    });
  }

  public abstract getName(entity: T): string;

  getEntities(page: number, count: number, needle?: string): Observable<ICadrartEntitiesResponse<T>> {
    return (
      this.cache.makeRequest(
        'get',
        `${this.endpointName}?page=${page}&count=${count}&needle=${needle ?? ''}`
      ) as Observable<ICadrartEntitiesResponse<T>>
    ).pipe(
      map((response: ICadrartEntitiesResponse<T>) => {
        return response;
      })
    );
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

  getEntity(id: string): Observable<T> {
    return (this.cache.makeRequest('get', `${this.endpointName}/${id}`) as Observable<ICadrartEntityResponse<T>>).pipe(
      map((response: ICadrartEntityResponse<T>) => {
        return response.entity;
      })
    );
  }

  addOrUpdateEntity(data: T): Observable<T> {
    if (typeof data.id !== 'undefined') {
      return this.updateEntity(data.id as number, data);
    }

    return this.addEntity(data);
  }

  addEntity(data: T): Observable<T> {
    return (this.cache.makeRequest('post', this.endpointName, data) as Observable<ICadrartEntityResponse<T>>).pipe(
      map((response: ICadrartEntityResponse<T>) => {
        return response.entity;
      })
    );
  }

  updateEntity(id: number, data: T): Observable<T> {
    return (
      this.cache.makeRequest('put', `${this.endpointName}/${id}`, data) as Observable<ICadrartEntityResponse<T>>
    ).pipe(
      map((response: ICadrartEntityResponse<T>) => {
        return response.entity;
      })
    );
  }

  deleteEntity(id: number): Observable<T> {
    return (
      this.cache.makeRequest('delete', `${this.endpointName}/${id}`) as Observable<ICadrartEntityResponse<T>>
    ).pipe(
      map((response: ICadrartEntityResponse<T>) => {
        return response.entity;
      })
    );
  }

  shouldUpdateFromSocketEvent(operation: 'create' | 'update' | 'delete', name: string): boolean {
    return !!name && !!operation;
  }

  handleSocketCreate(data: ICadrartSocketCreateEntity<T>): void {
    if (!this.shouldUpdateFromSocketEvent('create', data.name)) {
      return;
    }

    this.cache.clearCache([
      {
        name: this.endpointName,
        refetch: true
      }
    ]);
  }

  handleSocketUpdate(data: ICadrartSocketUpdateEntity<T>): void {
    if (!this.shouldUpdateFromSocketEvent('update', data.name)) {
      return;
    }

    this.cache.clearCache([
      {
        name: this.endpointName,
        refetch: true
      },
      {
        name: `${this.endpointName}/${data.entity.id}`,
        refetch: true
      }
    ]);
  }

  handleSocketDelete(data: ICadrartSocketDeleteEntity): void {
    if (!this.shouldUpdateFromSocketEvent('delete', data.name)) {
      return;
    }

    this.cache.clearCache([
      {
        name: this.endpointName,
        refetch: true
      },
      {
        name: `${this.endpointName}/${data.id}`,
        refetch: false
      }
    ]);
  }
}
