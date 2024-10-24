import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadrartNavigationService {
  enabled: WritableSignal<boolean> = signal<boolean>(false);
}
