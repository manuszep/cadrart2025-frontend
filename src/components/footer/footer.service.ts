import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadrartFooterService {
  private _content$: BehaviorSubject<TemplateRef<any> | null> = new BehaviorSubject<TemplateRef<any> | null>(null);
  private _paginate$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get content$(): Observable<TemplateRef<any> | null> {
    return this._content$.asObservable();
  }

  get paginate$(): Observable<boolean> {
    return this._paginate$.asObservable();
  }

  showFooter(content: TemplateRef<any>) {
    this._content$.next(content);
  }

  enablePagination(): void {
    this._paginate$.next(true);
  }

  disablePagination(): void {
    this._paginate$.next(false);
  }

  closeFooter(): void {
    this._content$.next(null);
  }
}
