import { computed, Injectable, Signal, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CadrartPaginationService {
  private _$total = signal<number>(0);
  private _$pageSize = signal<number>(20);
  private _$page = signal<number>(1);
  private _$lastPage = computed<number>(() => Math.ceil(this._$total() / this._$pageSize()));
  private _$looper = computed<number[]>(() => Array.from({ length: this._$lastPage() }, (_, i) => i + 1));

  public set total(total: number) {
    this._$total.set(total);
  }

  public get total(): Signal<number> {
    return this._$total.asReadonly();
  }

  public get pageSize(): Signal<number> {
    return this._$pageSize.asReadonly();
  }

  public get page(): Signal<number> {
    return this._$page.asReadonly();
  }

  public get lastPage(): Signal<number> {
    return this._$lastPage;
  }

  public get looper(): Signal<number[]> {
    return this._$looper;
  }

  public setPage(page: number): void {
    this._$page.set(page);
  }

  public setPageSize(pageSize: number): void {
    this._$pageSize.set(pageSize);
  }

  public setPageToFirst(): void {
    this._$page.set(1);
  }

  public setPageToLast(): void {
    this._$page.set(this._$lastPage());
  }

  public setPageToPrevious(): void {
    if (this._$page() <= 1) {
      return;
    }

    this._$page.set(this._$page() - 1);
  }

  public setPageToNext(): void {
    if (this._$page() >= this._$lastPage()) {
      return;
    }

    this._$page.set(this._$page() + 1);
  }

  public reset(): void {
    this._$page.set(1);
    this._$pageSize.set(20);
    this._$total.set(0);
  }
}