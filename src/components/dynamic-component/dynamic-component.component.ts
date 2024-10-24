import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CadrartDynamicComponentComponent implements AfterViewInit, OnDestroy {
  private _inputs: Record<string, unknown> = {};

  @Input() component!: Type<unknown>;
  @Input() set inputs(inputs: Record<string, unknown> | undefined) {
    this._inputs = inputs || {};
    this.updateComponent();
  }
  @Input() outputs?: Record<string, EventEmitter<any>> = {};

  @ViewChild('dynamic', { read: ViewContainerRef }) private viewRef!: ViewContainerRef;

  private subscriptions: Subscription[] = [];

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (!this.viewRef) {
      return;
    }

    this.viewRef.clear();

    const componentRef = this.viewRef.createComponent<unknown>(this.component);

    for (const [key, value] of Object.entries(this._inputs || {})) {
      (componentRef.instance as any)[key] = value;
    }

    for (const [key, value] of Object.entries(this.outputs || {})) {
      if ((componentRef.instance as any)[key] && (componentRef.instance as any)[key].subscribe) {
        this.subscriptions.push((componentRef.instance as any)[key].subscribe((e: unknown) => value.emit(e)));
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
