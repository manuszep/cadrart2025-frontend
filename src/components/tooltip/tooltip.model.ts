import { EventEmitter, TemplateRef, Type } from '@angular/core';

export type ICadrartTooltipConfig<T = unknown> = {
  target: HTMLElement;
  content: TemplateRef<T> | Type<any> | string | null;
  contentInputs?: Record<string, unknown> | null;
  contentOutputs?: Record<string, EventEmitter<any>> | null;
};
