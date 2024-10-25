import { EventEmitter, Injectable, signal, TemplateRef, Type, WritableSignal } from '@angular/core';

import { throttle } from '../../utils';

import { ICadrartTooltipConfig } from './tooltip.model';

@Injectable({
  providedIn: 'root'
})
export class CadrartTooltipService {
  public open: WritableSignal<boolean> = signal(false);
  public content: WritableSignal<TemplateRef<unknown> | Type<any> | string | null> = signal(null);
  public contentInputs: WritableSignal<Record<string, unknown>> = signal({});
  public contentOutputs: WritableSignal<Record<string, EventEmitter<any>>> = signal({});
  public x: WritableSignal<number> = signal(0);
  public y: WritableSignal<number> = signal(0);

  private scrollHandler?: () => void;

  getElementPosition(element: HTMLElement): { x: number; y: number } {
    const rect = element.getBoundingClientRect();

    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  show(config: ICadrartTooltipConfig): void {
    setTimeout(() => {
      this.open.set(true);
    }, 200);
    this.content.set(config.content);
    this.contentInputs.set(config.contentInputs ?? {});
    this.contentOutputs.set(config.contentOutputs ?? {});

    const pos = this.getElementPosition(config.target);

    this.x.set(pos.x);
    this.y.set(pos.y);

    // Use scroll event to track target position changes
    this.scrollHandler = () => {
      const pos = this.getElementPosition(config.target);

      this.x.set(pos.x);
      this.y.set(pos.y);
    };

    // throttle handler
    window.addEventListener('scroll', throttle(this.scrollHandler, 100, { trailing: true }), true);
  }

  close(): void {
    this.open.set(false);

    setTimeout(() => {
      this.content.set(null);
      this.contentInputs.set({});
      this.contentOutputs.set({});
    }, 350);

    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler, true);
    }
  }

  isOpen(): boolean {
    return this.open();
  }
}
