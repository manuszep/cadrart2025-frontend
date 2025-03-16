import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { EsfsFieldComponent, EsfsFormArray, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartActionsGroupComponent } from '../../components/actions-group/actions-group.component';
import { CadrartIconComponent } from '../../components/icon/icon.component';
import { CadrartButtonComponent } from '../../components/button/button.component';
import { CadrartPricePipe } from '../../pipes/price.pipe';
import { CadrartFormErrorPipe } from '../../pipes/error.pipe';
import { CadrartTaskForm } from '../../models/task.form';

@Component({
  selector: 'cadrart-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  imports: [
    TranslateModule,
    CadrartIconComponent,
    CadrartButtonComponent,
    CadrartPricePipe,
    EsfsFieldComponent,
    CadrartFormErrorPipe,
    CadrartActionsGroupComponent,
    EsfsFormGroupDirective
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CadrartTaskFormComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public taskForm?: CadrartTaskForm;
  @Input({ required: true }) public canDelete?: boolean;
  @Input() public isChild = false;

  @Output() public cadrartChange: EventEmitter<void> = new EventEmitter();
  @Output() public cadrartAddSubTask: EventEmitter<void> = new EventEmitter();
  @Output() public cadrartDelete: EventEmitter<void> = new EventEmitter();

  public total: WritableSignal<number> = signal<number>(0);
  public totalWithVat: WritableSignal<number> = signal<number>(0);

  private unsubscribeSubject$ = new Subject<void>();

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.taskForm?.onUpdatePrice.pipe(takeUntil(this.unsubscribeSubject$)).subscribe(() => {
      this.total.set(this.taskForm?.getTotal().value ?? 0);
      this.totalWithVat.set(this.taskForm?.getTotalWithVat().value ?? 0);
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribeSubject$.next();
    this.unsubscribeSubject$.complete();
  }

  public getSubTasksControl(): EsfsFormArray<CadrartTaskForm> {
    return this.taskForm?.get('children') as EsfsFormArray<CadrartTaskForm>;
  }

  public handleChange(): void {
    this.cadrartChange.emit();
  }

  public handleAddSubTask(): void {
    this.cadrartAddSubTask.emit();
  }

  handleDelete(): void {
    this.cadrartDelete.emit();
  }
}
