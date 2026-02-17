import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { ICadrartApiEntity, ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';
import { filter, Observable, skip } from 'rxjs';

import { CadrartFooterService } from '../components/footer/footer.service';
import { CadrartPaginationService } from '../components/pagination/pagination.service';
import { sortStringOrNumbers } from '../utils';

import { AuthenticatedSocketService } from './authenticated-socket.service';

export type IDataConnectorSortAccessor<TModel extends ICadrartApiEntity = ICadrartApiEntity> = Record<
  string,
  (value: TModel, key: string) => string | number
>;

export type IDataConnectorRequestor<TModel extends ICadrartApiEntity = ICadrartApiEntity> = (
  page: number,
  count: number,
  needle?: string,
  extra?: Record<string, unknown>
) => Observable<ICadrartEntitiesResponse<TModel>>;

export type IDataConnectorConfig<T extends ICadrartApiEntity> = {
  requestor: IDataConnectorRequestor<T>;
  accessors?: IDataConnectorSortAccessor;
  showPagination?: boolean;
};

function defaultAccessor<TModel extends ICadrartApiEntity = ICadrartApiEntity>(
  value: TModel,
  key: keyof TModel
): TModel[keyof TModel] {
  return value[key];
}

@Injectable({
  providedIn: 'root'
})
export class CadrartDataConnectorService<TData extends ICadrartApiEntity = ICadrartApiEntity> {
  private readonly router = inject(Router);
  private readonly footerService = inject(CadrartFooterService);
  private readonly paginationService = inject(CadrartPaginationService);
  private readonly socketService = inject(AuthenticatedSocketService);

  private readonly _$needle = signal('');
  private readonly _$sortColumn = signal('');
  private readonly _$extraParams = signal<Record<string, unknown>>({});
  private readonly _$requestor = signal<IDataConnectorRequestor<TData> | null>(null);

  // The core resource that reacts to all input signals
  private readonly _$resource = rxResource({
    request: () => ({
      page: this.paginationService.page(),
      count: this.paginationService.pageSize(),
      needle: this._$needle(),
      extra: this._$extraParams(),
      requestor: this._$requestor()
    }),
    loader: ({ request }) => {
      if (!request.requestor) {
        return new Observable<ICadrartEntitiesResponse<TData>>((observer) => {
          observer.next({ entities: [], total: 0, statusCode: 200 });
          observer.complete();
        });
      }
      return request.requestor(request.page, request.count, request.needle, request.extra);
    }
  });

  private readonly _$total = computed(() => this._$resource.value()?.total ?? 0);

  // Derived signal for filtered/sorted data (if client-side filtering/sorting is still needed)
  public readonly data = computed(() => {
    const data = this._$resource.value();
    const sortColumn = this._$sortColumn();

    if (!data) return [];

    // Note: Usually filtering is done on backend via 'needle', but we keep client-side sorting/search for flexibility
    const searchResults = this.doSearch(data.entities, this._$needle());
    const sortedResults = this.doSort(searchResults, sortColumn);

    return sortedResults;
  });

  private accessors: IDataConnectorSortAccessor = {};

  constructor() {
    // Reset on navigation
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed()
      )
      .subscribe(() => this.reset());

    // Sync total with pagination service
    effect(() => {
      this.paginationService.total = this._$total();
    });

    // Aggressive Refresh on Socket Events
    this.socketService.updateEvents$.pipe(takeUntilDestroyed(), skip(1)).subscribe(() => {
      this._$resource.reload();
    });
    this.socketService.createEvents$.pipe(takeUntilDestroyed(), skip(1)).subscribe(() => {
      this._$resource.reload();
    });
    this.socketService.deleteEvents$.pipe(takeUntilDestroyed(), skip(1)).subscribe(() => {
      this._$resource.reload();
    });
  }

  public connect(config: IDataConnectorConfig<TData>): Signal<TData[]> {
    this._$requestor.set(config.requestor);
    this.accessors = config.accessors ?? {};

    if (config.showPagination !== false) {
      this.footerService.enablePagination();
    } else {
      this.footerService.disablePagination();
    }

    return this.data;
  }

  public setNeedle(needle: string): void {
    this._$needle.set(needle);
    this.paginationService.setPage(1);
  }

  public setExtraParams(params: Record<string, unknown>, resetPage = true): void {
    this._$extraParams.update((prev) => ({ ...prev, ...params }));
    if (resetPage) {
      this.paginationService.setPage(1);
    }
  }

  public setSortColumn(sortColumn: string): void {
    this._$sortColumn.set(sortColumn);
  }

  public reset(): void {
    this._$needle.set('');
    this._$sortColumn.set('');
    this._$extraParams.set({});
    this._$requestor.set(null);
    this.accessors = {};
    this.paginationService.reset();
    this.footerService.disablePagination();
  }

  public get needle(): Signal<string> {
    return this._$needle.asReadonly();
  }

  public reload(): void {
    this._$resource.reload();
  }

  private doSearch(data: TData[], needle: string): TData[] {
    if (!needle) return data;

    const sanitizedNeedle = needle.toLowerCase().trim();
    return data.filter((item) => {
      const hayStack = JSON.stringify(item).toLowerCase();
      return hayStack.includes(sanitizedNeedle);
    });
  }

  private doSort(data: TData[], sortColumn: string): TData[] {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const accessor = this.accessors[sortColumn] || defaultAccessor;
      const valA = accessor(a, sortColumn);
      const valB = accessor(b, sortColumn);
      return sortStringOrNumbers(valA, valB);
    });
  }
}
