import { EventEmitter, Injectable, TemplateRef, Type, WritableSignal, signal } from '@angular/core';
import { Subject, Observable, of, isObservable } from 'rxjs';

import { CadrartImageComponent } from '../image/image.component';
import { ICadrartImageFolder } from '../image/image.model';

import { ICadrartModalAction, ICadrartModalConfig } from './modal.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartModalService {
  public open: WritableSignal<boolean> = signal(false);
  public title: WritableSignal<string | null> = signal(null);
  public content: WritableSignal<TemplateRef<unknown> | Type<any> | string | null> = signal(null);
  public contentInputs: WritableSignal<Record<string, unknown>> = signal({});
  public contentOutputs: WritableSignal<Record<string, EventEmitter<any>>> = signal({});
  public actionLabel: WritableSignal<string | null> = signal(null);
  public actionDisabled: WritableSignal<Observable<boolean>> = signal(of(false));
  public actionSecondaryLabel: WritableSignal<string | null> = signal(null);
  public actionSecondaryDisabled: WritableSignal<Observable<boolean>> = signal(of(false));
  public fullScreen: WritableSignal<boolean> = signal(false);

  private _actionEvent$: Subject<ICadrartModalAction> = new Subject<ICadrartModalAction>();

  get actionEvent$(): Observable<ICadrartModalAction> {
    return this._actionEvent$.asObservable();
  }

  showModal(config: ICadrartModalConfig): Observable<ICadrartModalAction> {
    this.open.set(true);
    this.title.set(config.title ?? null);
    this.content.set(config.content);
    this.contentInputs.set(config.contentInputs ?? {});
    this.contentOutputs.set(config.contentOutputs ?? {});
    this.actionLabel.set(config.actionLabel ?? null);
    this.actionDisabled.set(isObservable(config.actionDisabled) ? config.actionDisabled : of(!!config.actionDisabled));
    this.actionSecondaryLabel.set(config.actionSecondaryLabel ?? null);
    this.actionSecondaryDisabled.set(
      isObservable(config.actionSecondaryDisabled)
        ? config.actionSecondaryDisabled
        : of(!!config.actionSecondaryDisabled)
    );
    this.fullScreen.set(!!config.fullScreen);

    return this._actionEvent$.asObservable();
  }

  closeModal(): void {
    this.open.set(false);

    setTimeout(() => {
      this.title.set(null);
      this.content.set(null);
      this.contentInputs.set({});
      this.contentOutputs.set({});
      this.actionLabel.set(null);
      this.actionDisabled.set(of(false));
      this.actionSecondaryLabel.set(null);
      this.actionSecondaryDisabled.set(of(false));
      this.fullScreen.set(false);
    }, 350);
  }

  openImage(name: string, folder: ICadrartImageFolder): void {
    this.showModal({
      content: CadrartImageComponent,
      fullScreen: true,
      contentInputs: {
        name,
        folder,
        size: 'o'
      }
    });
  }

  emitAction(): void {
    this._actionEvent$.next('primary');
  }

  emitSecondaryAction(): void {
    this._actionEvent$.next('secondary');
  }

  emitClose(): void {
    this._actionEvent$.next('close');
  }
}
