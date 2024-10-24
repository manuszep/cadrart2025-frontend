import { Injectable, WritableSignal, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ICadrartHeaderAction, ICadrartHeaderNavigation } from './header.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartHeaderService {
  public navigation: WritableSignal<ICadrartHeaderNavigation> = signal<ICadrartHeaderNavigation>([]);

  public action: WritableSignal<ICadrartHeaderAction | null> = signal<ICadrartHeaderAction | null>(null);

  private _actionEvent$: Subject<string> = new Subject<string>();

  get actionEvent$(): Observable<string> {
    return this._actionEvent$.asObservable();
  }

  setNavigation(navigation: ICadrartHeaderNavigation): void {
    this.navigation.set(navigation);
  }

  clearNavigation(): void {
    this.navigation.set([]);
  }

  setAction(action: ICadrartHeaderAction | null): void {
    this.action.set(action);
  }

  clearAction(): void {
    this.action.set(null);
  }

  emitAction(): void {
    this._actionEvent$.next(this.action()?.label ?? '');
  }
}
