import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewEncapsulation,
  WritableSignal
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ICadrartJob } from '@manuszep/cadrart2025-common';
import { TranslateModule } from '@ngx-translate/core';
import { EsfsFieldComponent, EsfsFormArray, EsfsFormGroupDirective } from '@manuszep/es-form-system';

import { CadrartCardComponent } from '../../components/card/card.component';
import { CadrartIconComponent } from '../../components/icon/icon.component';
import { CadrartPricePipe } from '../../pipes/price.pipe';
import { CadrartTaskFormComponent } from '../task/task-form.component';
import { CadrartJobForm } from '../../models/job.form';
import { CadrartTaskForm } from '../../models/task.form';
import { PartialDeep } from '../../utils';

@Component({
  selector: 'cadrart-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  imports: [
    TranslateModule,
    CadrartCardComponent,
    CadrartIconComponent,
    CadrartPricePipe,
    EsfsFieldComponent,
    CadrartTaskFormComponent,
    EsfsFormGroupDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartJobFormComponent implements OnInit, OnDestroy {
  @Input() public deletable = false;
  @Input() public extended = false;
  @Input({ required: true }) public jobForm?: CadrartJobForm;

  @Output() public cadrartDuplicate: EventEmitter<void> = new EventEmitter();
  @Output() public cadrartToggle: EventEmitter<void> = new EventEmitter();
  @Output() public cadrartDelete: EventEmitter<void> = new EventEmitter();
  @Output() public modelChange: EventEmitter<void> = new EventEmitter();

  private unsubscribeSubject$ = new Subject<void>();

  public total: WritableSignal<number> = signal<number>(0);
  public autoValue: WritableSignal<'glass' | 'margin' | 'opening'> = signal<'glass' | 'margin' | 'opening'>('glass');

  ngOnInit(): void {
    this.jobForm
      ?.getUpdateEvents()
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((value: PartialDeep<ICadrartJob>) => {
        this.total.set(value?.totalWithVat ?? 0);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next(void 0);
    this.unsubscribeSubject$.complete();
  }

  getTasksControl(): EsfsFormArray<CadrartTaskForm> {
    return this.jobForm?.get('tasks') as EsfsFormArray<CadrartTaskForm>;
  }

  handleDuplicateClick(): void {
    this.cadrartDuplicate.emit();
  }

  handleToggleClick(): void {
    this.cadrartToggle.emit();
  }

  handleDeleteClick(): void {
    this.cadrartDelete.emit();
  }

  handleAddSubTask(index: number): void {
    const task = this.getTasksControl().at(index);

    task.addSubTask();
  }

  handleDeleteTask(index: number): void {
    this.getTasksControl().removeAt(index);
  }

  handleAutoOpeningChange(): void {
    this.autoValue.set('opening');

    this.jobForm?.get('autoMargin')?.setValue(false, { emitEvent: false });
    this.jobForm?.get('autoGlass')?.setValue(false, { emitEvent: false });
  }

  handleAutoMarginChange(): void {
    this.autoValue.set('margin');

    this.jobForm?.get('autoOpening')?.setValue(false, { emitEvent: false });
    this.jobForm?.get('autoGlass')?.setValue(false, { emitEvent: false });
  }

  handleAutoGlassChange(): void {
    this.autoValue.set('glass');

    this.jobForm?.get('autoOpening')?.setValue(false, { emitEvent: false });
    this.jobForm?.get('autoMargin')?.setValue(false, { emitEvent: false });
  }
}
