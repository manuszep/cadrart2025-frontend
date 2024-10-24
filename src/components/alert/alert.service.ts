import { Injectable, WritableSignal, signal } from '@angular/core';

import { ICadrartAlert } from './alert.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartAlertService {
  public alerts: WritableSignal<ICadrartAlert[]> = signal([]);

  add(alert: Omit<ICadrartAlert, 'id'>): number {
    const id = Date.now();
    const ttl = alert.ttl ?? 2000;

    this.alerts.update((values: ICadrartAlert[]): ICadrartAlert[] => [...values, { ...alert, id } as ICadrartAlert]);

    setTimeout(() => {
      this.remove(id);
    }, ttl);

    return id;
  }

  remove(id: number): void {
    this.alerts.set(this.alerts().filter((alert) => alert.id !== id));
  }
}
