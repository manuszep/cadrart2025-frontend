import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cadrart-dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CadrartDynamicComponentComponent<T extends Record<string, unknown> = Record<string, unknown>>
  implements AfterViewInit, OnDestroy
{
  private _inputs: Partial<T> = {};

  @Input() component!: Type<T>;
  @Input() set inputs(inputs: Partial<T> | undefined) {
    this._inputs = inputs || {};
    this.updateComponent();
  }
  @Input() outputs?: Record<string, EventEmitter<unknown>> = {};

  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef!: ViewContainerRef;

  private subscriptions: Subscription[] = [];

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.viewRef) {
      return;
    }

    this.viewRef.clear();

    const componentRef = this.viewRef.createComponent<T>(this.component);

    for (const [key, value] of Object.entries(this._inputs || {})) {
      componentRef.instance[key as keyof T] = value as T[keyof T];
    }

    for (const [key, value] of Object.entries(this.outputs || {})) {
      const instance = componentRef.instance;
      const prop = instance[key as keyof T];
      if (prop && typeof prop === 'object' && 'subscribe' in prop) {
        this.subscriptions.push(
          (prop as { subscribe: (callback: (event: unknown) => void) => Subscription }).subscribe((e: unknown) =>
            value.emit(e)
          )
        );
      }
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateComponent(): void {
    this.ngAfterViewInit();
  }
}
