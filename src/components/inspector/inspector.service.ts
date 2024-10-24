import { Injectable, TemplateRef, WritableSignal, signal } from '@angular/core';
import { Router, Event, RouterEvent, NavigationStart } from '@angular/router';
import { Subject, Observable, of, filter } from 'rxjs';

import { ICadrartInspectorActionEvent, ICadrartInspectorConfig } from './inspector.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartInspectorService {
  public toggled: WritableSignal<boolean> = signal(false);
  public title: WritableSignal<string | null> = signal(null);
  public content: WritableSignal<TemplateRef<unknown> | null> = signal(null);
  public actionLabel: WritableSignal<string | null> = signal(null);
  public actionDisabled: WritableSignal<Observable<boolean>> = signal(of(false));
  public closeOnClickOut: WritableSignal<boolean> = signal(false);

  private _actionEvent$: Subject<ICadrartInspectorActionEvent> = new Subject<ICadrartInspectorActionEvent>();

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((e: Event | RouterEvent): e is RouterEvent => e instanceof NavigationStart))
      .subscribe(() => {
        this.closeInspector();
      });
  }

  get actionEvent$(): Observable<ICadrartInspectorActionEvent> {
    return this._actionEvent$.asObservable();
  }

  showInspector(config: ICadrartInspectorConfig) {
    this.toggled.set(true);
    this.title.set(config.title);
    this.content.set(config.content);
    this.actionLabel.set(config.actionLabel ?? null);
    this.actionDisabled.set(config.actionDisabled ?? of(false));

    setTimeout(() => {
      this.closeOnClickOut.set(config.closeOnClickOut ?? false);
    }, 300);
  }

  closeInspector(): void {
    this.toggled.set(false);

    setTimeout(() => {
      this.title.set(null);
      this.content.set(null);
      this.actionLabel.set(null);
      this.actionDisabled.set(of(false));
      this.closeOnClickOut.set(false);
    }, 350);
  }

  emitSubmitAction(): void {
    this._actionEvent$.next('submit');
  }

  emitCloseAction(): void {
    this._actionEvent$.next('close');
  }
}
