import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import {
  ICadrartApiEntity,
  ICadrartSocketCreateEntity,
  ICadrartSocketDeleteEntity,
  ICadrartSocketUpdateEntity
} from '@manuszep/cadrart2025-common';

import { getEndpointUrl } from '../utils/url';

import { ICadrartRequestOptions } from './api.service';

@Injectable({ providedIn: 'root' })
export class CadrartCacheService {
  private cache$: Record<string, BehaviorSubject<unknown>> = {};

  public createSocket: Observable<ICadrartSocketCreateEntity<any>>;
  public updateSocket: Observable<ICadrartSocketUpdateEntity<any>>;
  public deleteSocket: Observable<ICadrartSocketDeleteEntity>;

  constructor(private readonly http: HttpClient, private socket: Socket) {
    this.createSocket = this.socket.fromEvent<ICadrartSocketCreateEntity<any>, string>('create');
    this.updateSocket = this.socket.fromEvent<ICadrartSocketUpdateEntity<any>, string>('update');
    this.deleteSocket = this.socket.fromEvent<ICadrartSocketDeleteEntity, string>('delete');
  }

  private setEndpointCache(endpoint: string, data: unknown): void {
    this.cache$[endpoint] = this.cache$[endpoint] || new BehaviorSubject(null);
    this.cache$[endpoint].next(data);
  }

  private getEndpointCache(endpoint: string): BehaviorSubject<unknown> {
    return this.cache$[endpoint];
  }

  private hasEndpointCache(endpoint: string): boolean {
    return typeof this.cache$[endpoint] !== 'undefined';
  }

  private isEndpointCacheEmpty(endpoint: string): boolean {
    return !this.hasEndpointCache(endpoint) || !this.cache$[endpoint]?.value;
  }

  public makeRequest(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: ICadrartApiEntity,
    force = false
  ): Observable<unknown> {
    // For non GET methods, we always go through the network
    if (method !== 'get') {
      return this.http[method](getEndpointUrl(endpoint), data as unknown as ICadrartRequestOptions);
    }

    // If there's no cache for this endpoint, we make the call and write the result to the cache
    if (this.isEndpointCacheEmpty(endpoint) || force) {
      // If the cache does not exist, create it
      if (!this.hasEndpointCache(endpoint)) {
        this.setEndpointCache(endpoint, null);
      }

      // Initialize HTTP request
      this.http.get(getEndpointUrl(endpoint)).subscribe((data: unknown) => {
        this.setEndpointCache(endpoint, data);
      });
    }

    // Always return the cache. It will be updated by the HTTP request when done
    return this.getEndpointCache(endpoint).pipe(filter((data) => data !== null)); // Filter null values from observable output
  }

  private makeEndpointSearchRegexp(endpoint: string): RegExp {
    // Escape special characters from endpoint
    // build a regexp to match the exact endpoint but also url parameters like /endpoint?page=1&count=10
    const escapedEndpoint = endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return new RegExp(`^${escapedEndpoint}(\\?.*)?$`);
  }

  public clearCache(endpoints: { name: string; refetch: boolean }[]): void {
    for (const endpoint of endpoints) {
      const endpointCaches = Object.keys(this.cache$).filter((key) =>
        key.match(this.makeEndpointSearchRegexp(endpoint.name))
      );

      // Clear all caches

      for (const endpointCache of endpointCaches) {
        if (endpoint.refetch) {
          // Fetch again and refresh cache value
          this.makeRequest('get', endpointCache, undefined, true);
        } else {
          this.setEndpointCache(endpointCache, null);
        }
      }
    }
  }
}
