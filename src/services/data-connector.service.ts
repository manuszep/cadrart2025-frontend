import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, filter } from 'rxjs';
import { ICadrartApiEntity, ICadrartEntitiesResponse } from '@manuszep/cadrart2025-common';

import { sortStringOrNumbers } from '../utils';
import { CadrartFooterService } from '../components/footer/footer.service';

export type IDataConnectorSortAccessor = Record<string, (value: any, key: string) => string | number>;

export type IDataConnectorConfig<T extends ICadrartApiEntity> = {
  requestor: (page: number, count: number, needle?: string) => Observable<ICadrartEntitiesResponse<T>>;
  accessors: IDataConnectorSortAccessor;
};

function defaultAccessor(value: any, key: string): any {
  return value[key];
}

@Injectable({
  providedIn: 'root'
})
export class CadrartDataConnectorService {
  private data$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  private filteredData$: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  private needle$: BehaviorSubject<string> = new BehaviorSubject('');
  private sortColumn$: BehaviorSubject<string | ''> = new BehaviorSubject('');
  private page$: BehaviorSubject<number> = new BehaviorSubject(1);
  private pageSize$: BehaviorSubject<number> = new BehaviorSubject(20);
  private accessors$: IDataConnectorSortAccessor = {} as IDataConnectorSortAccessor;
  private total$: BehaviorSubject<number> = new BehaviorSubject(0);
  private requestor: (page: number, count: number, needle?: string) => Observable<ICadrartEntitiesResponse<any>> = () =>
    new Observable();

  private requestorSubscription: Subscription | null = null;

  /*clear(): void {
    this.setData([]);
  }*/

  /*setData(data: any[]): void {
    this.needle$.next('');
    this.data$.next(data);
    this.filteredData$.next(data);
    this.accessors$ = {} as IDataConnectorSortAccessor;
  }*/

  /*setAccessors(accessors: IDataConnectorSortAccessor): void {
    this.accessors$ = accessors;
  }*/

  constructor(private readonly router: Router, private readonly footerService: CadrartFooterService) {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.reset();
    });
  }

  public get data(): Observable<any[]> {
    return this.filteredData$.asObservable();
  }

  public get total(): Observable<number> {
    return this.total$.asObservable();
  }

  public get pageSize(): Observable<number> {
    return this.pageSize$.asObservable();
  }

  public get page(): Observable<number> {
    return this.page$.asObservable();
  }

  public setPage(target: number | 'last' | 'next' | 'previous'): void {
    const lastPage = Math.ceil(this.total$.value / this.pageSize$.value);
    let page = -1;

    if (target === 'last') {
      page = lastPage;
    }

    if (target === 'next' && this.page$.value < lastPage) {
      page = this.page$.value + 1;
    }

    if (target === 'previous' && this.page$.value > 1) {
      page = this.page$.value - 1;
    }

    if (typeof target === 'number') {
      page = target;
    }

    if (page !== -1 && page !== this.page$.value) {
      this.page$.next(page);
      this.makeRequest();
    }
  }

  public setPageSize(pageSize: number): void {
    this.pageSize$.next(pageSize);

    if (this.page$.value !== 1) {
      this.page$.next(1);
    }

    this.makeRequest();
  }

  connect<T extends ICadrartApiEntity>(config: IDataConnectorConfig<T>): Observable<T[]> {
    const { requestor, accessors } = config;

    this.requestor = requestor;
    this.accessors$ = accessors;

    this.makeRequest();

    this.footerService.enablePagination();

    return this.filteredData$.asObservable();
  }

  makeRequest(): void {
    if (this.requestorSubscription) {
      this.requestorSubscription.unsubscribe();
    }

    this.requestorSubscription = this.requestor(this.page$.value, this.pageSize$.value, this.needle$.value).subscribe(
      (data: ICadrartEntitiesResponse<any>) => {
        this.data$.next(data.entities);
        this.filteredData$.next(data.entities);
        this.total$.next(data.total);
      }
    );
  }

  reset(): void {
    this.needle$.next('');
    this.sortColumn$.next('');
    this.page$.next(1);
    this.pageSize$.next(5);
    this.data$.next([]);
    this.filteredData$.next([]);
    this.accessors$ = {} as IDataConnectorSortAccessor;
    this.footerService.disablePagination();

    if (this.requestorSubscription) {
      this.requestorSubscription.unsubscribe();
    }
  }

  setNeedle(needle: string): void {
    this.needle$.next(needle);
    this.page$.next(1);
    this.makeRequest();
  }

  setSortColumn(sortColumn: string): void {
    this.sortColumn$.next(sortColumn);
    this.doFilter();
  }

  private doSearch(data: any[]): any[] {
    if (this.needle$.value === '') {
      return data;
    }

    return data.filter((item: any) => {
      /*const values = Object.keys(item).map((k: string) => {
        return this.accessors$[k] ? this.accessors$[k](item, k) : item[k];
      });
      const hayStack = values.join('||').toLowerCase();*/
      const hayStack = JSON.stringify(item).toLowerCase();
      const sanitizedNeedle = new RegExp(
        this.needle$.value
          .toLowerCase()
          .replace(/\\/g, '\\\\')
          .replace(/\./g, `\\.`)
          .replace(/\+/g, `\\+`)
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
          .replace(/\*/g, '\\*')
      );

      return hayStack.search(sanitizedNeedle) !== -1;
    });
  }

  private doSort(data: any[]): any[] {
    const sortValue = this.sortColumn$.value;

    if (sortValue === '') {
      return data;
    }

    return data.sort((a: any, b: any) => {
      const accessor = this.accessors$[sortValue] || defaultAccessor;
      const valA = accessor(a, sortValue);
      const valB = accessor(b, sortValue);

      return sortStringOrNumbers(valA, valB);
    });
  }

  private doFilter(): void {
    this.filteredData$.next(this.doSort(this.doSearch(this.data$.value)));
  }
}
