import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export type ICadrartInspectorConfig<T = unknown> = {
  title: string;
  content: TemplateRef<T>;
  actionLabel?: string;
  actionDisabled?: Observable<boolean>;
  closeOnClickOut?: boolean;
};

export type ICadrartInspectorActionEvent = 'close' | 'submit';
