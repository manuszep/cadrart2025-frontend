import { EventEmitter, TemplateRef, Type } from '@angular/core';
import { Observable } from 'rxjs';

export type ICadrartModalConfig<T = unknown> = {
  open?: boolean;
  title?: string | null;
  content: TemplateRef<T> | Type<any> | string | null;
  contentInputs?: Record<string, unknown> | null;
  contentOutputs?: Record<string, EventEmitter<any>> | null;
  actionLabel?: string;
  actionDisabled?: boolean | Observable<boolean>;
  actionSecondaryLabel?: string;
  actionSecondaryDisabled?: boolean | Observable<boolean>;
  fullScreen?: boolean;
};

export type ICadrartModalAction = 'primary' | 'secondary' | 'close' | null;
