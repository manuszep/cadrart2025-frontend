import { Injectable, TemplateRef, WritableSignal, signal } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

import { ICadrartInspectorActionEvent, ICadrartInspectorConfig } from '../components/inspector/inspector.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartMockInspectorService {
  public toggled: WritableSignal<boolean> = signal(false);
  public title: WritableSignal<string | null> = signal(null);
  public content: WritableSignal<TemplateRef<unknown> | null> = signal(null);
  public actionLabel: WritableSignal<string | null> = signal(null);
  public actionDisabled: WritableSignal<Observable<boolean>> = signal(of(false));
  public closeOnClickOut: WritableSignal<boolean> = signal(false);

  private _actionEvent$: Subject<ICadrartInspectorActionEvent> = new Subject<ICadrartInspectorActionEvent>();

  triggerEvent(data: ICadrartInspectorActionEvent): void {
    this._actionEvent$.next(data);
  }

  get actionEvent$(): Observable<ICadrartInspectorActionEvent> {
    return this._actionEvent$.asObservable();
  }

  showInspector(config: ICadrartInspectorConfig) {
    return;
  }

  closeInspector(): void {
    return;
  }

  emitSubmitAction(): void {
    this._actionEvent$.next('submit');
  }

  emitCloseAction(): void {
    this._actionEvent$.next('close');
  }
}
