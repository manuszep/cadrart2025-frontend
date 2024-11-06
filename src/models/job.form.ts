import { AbstractControlOptions, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {
  ECadrartJobMeasureType,
  ECadrartJobOrientation,
  ICadrartJob,
  ICadrartLocation,
  ICadrartTask
} from '@manuszep/cadrart2025-common';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFieldOrientation } from '../form-system/orientation/orientation.config';
import { CadrartFieldSelect } from '../form-system/select/select.config';
import { CadrartLocationService } from '../services/location.service';
import { CadrartFieldText } from '../form-system/text/text.config';
import { CadrartFieldImage } from '../form-system/image/image.config';
import { CadrartFieldCheckbox } from '../form-system/checkbox/checkbox.config';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartArticleService } from '../services/article.service';
import { numberRound2, PartialDeep } from '../utils';
import { cadrartGetJobMeasureLabel } from '../pipes/job-measure.pipe';
import { CadrartFieldDate } from '../form-system/date/date.config';

import { CadrartTaskForm } from './task.form';
import { CadrartTask } from './task.model';

function getFormConfig(locationService: CadrartLocationService): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    count: new CadrartFormControl(
      1,
      new CadrartFieldNumber({ required: true, min: 0, label: false, placeholder: false })
    ),
    orientation: new CadrartFormControl(
      ECadrartJobOrientation.VERTICAL,
      new CadrartFieldOrientation({
        required: true
      })
    ),
    measure: new CadrartFormControl(
      ECadrartJobMeasureType.MEASURE_OPENING,
      new CadrartFieldSelect({
        required: true,
        placeholder: false,
        options: [
          {
            label: cadrartGetJobMeasureLabel(ECadrartJobMeasureType.MEASURE_APPROX),
            value: ECadrartJobMeasureType.MEASURE_APPROX
          },
          {
            label: cadrartGetJobMeasureLabel(ECadrartJobMeasureType.MEASURE_EXTERIOR),
            value: ECadrartJobMeasureType.MEASURE_EXTERIOR
          },
          {
            label: cadrartGetJobMeasureLabel(ECadrartJobMeasureType.MEASURE_GLASS),
            value: ECadrartJobMeasureType.MEASURE_GLASS
          },
          {
            label: cadrartGetJobMeasureLabel(ECadrartJobMeasureType.MEASURE_OPENING),
            value: ECadrartJobMeasureType.MEASURE_OPENING
          }
        ]
      })
    ),
    location: new CadrartFormControl<ICadrartLocation | undefined>(
      undefined,
      new CadrartFieldSelect({
        options: locationService.getEntitiesAsOptions()
      })
    ),
    dueDate: new CadrartFormControl('', new CadrartFieldDate({ required: false, future: true })),
    startDate: new CadrartFormControl('', new CadrartFieldDate({ required: false })),
    openingWidth: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    openingHeight: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    marginWidth: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    marginHeight: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    glassWidth: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    glassHeight: new CadrartFormControl(
      0,
      new CadrartFieldNumber({
        required: true,
        label: false,
        placeholder: false,
        min: 0,
        textAfter: 'cm',
        updateOn: 'change'
      })
    ),
    tasks: new FormArray<CadrartTaskForm>([]),
    description: new CadrartFormControl('', new CadrartFieldText({ required: false, maxLength: 255 })),
    image: new CadrartFormControl('', new CadrartFieldImage({ required: false, folder: 'job' })),
    autoMargin: new CadrartFormControl(false, new CadrartFieldCheckbox({ label: false, tabIndex: 1 })),
    autoOpening: new CadrartFormControl(false, new CadrartFieldCheckbox({ label: false, tabIndex: 1 })),
    autoGlass: new CadrartFormControl(true, new CadrartFieldCheckbox({ label: false, tabIndex: 1 })),
    total: new CadrartFormControl<number>(0),
    totalBeforeReduction: new CadrartFormControl<number>(0),
    totalWithVat: new CadrartFormControl<number>(0)
  };
}

export class CadrartJobForm extends CadrartFormGroup<ICadrartJob> {
  private $updateEvents: Subject<PartialDeep<ICadrartJob>> = new Subject();

  constructor(
    locationService: CadrartLocationService,
    private readonly articleService: CadrartArticleService,
    entity?: ICadrartJob,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(locationService), entity ?? {}, options);

    if (entity && entity.tasks) {
      for (const task of entity.tasks) {
        this.addTask(task);
      }
    }

    if (!this.get('tasks')?.value.length) {
      this.addTask();
    }
  }

  getUpdateEvents(): Observable<PartialDeep<ICadrartJob>> {
    return this.$updateEvents.asObservable();
  }

  getCount(): CadrartFormControl<number> {
    return this.get('count') as CadrartFormControl<number>;
  }

  getOrientation(): CadrartFormControl<ECadrartJobOrientation> {
    return this.get('orientation') as CadrartFormControl<ECadrartJobOrientation>;
  }

  getMeasure(): CadrartFormControl<ECadrartJobMeasureType> {
    return this.get('measure') as CadrartFormControl<ECadrartJobMeasureType>;
  }

  getLocation(): CadrartFormControl<ICadrartLocation | undefined> {
    return this.get('location') as CadrartFormControl<ICadrartLocation | undefined>;
  }

  getDueDate(): CadrartFormControl<string> {
    return this.get('dueDate') as CadrartFormControl<string>;
  }

  getStartDate(): CadrartFormControl<string> {
    return this.get('startDate') as CadrartFormControl<string>;
  }

  getOpeningWidth(): CadrartFormControl<number> {
    return this.get('openingWidth') as CadrartFormControl<number>;
  }

  getOpeningHeight(): CadrartFormControl<number> {
    return this.get('openingHeight') as CadrartFormControl<number>;
  }

  getMarginWidth(): CadrartFormControl<number> {
    return this.get('marginWidth') as CadrartFormControl<number>;
  }

  getMarginHeight(): CadrartFormControl<number> {
    return this.get('marginHeight') as CadrartFormControl<number>;
  }

  getGlassWidth(): CadrartFormControl<number> {
    return this.get('glassWidth') as CadrartFormControl<number>;
  }

  getGlassHeight(): CadrartFormControl<number> {
    return this.get('glassHeight') as CadrartFormControl<number>;
  }

  getTasks(): FormArray<CadrartTaskForm> {
    return this.get('tasks') as FormArray<CadrartTaskForm>;
  }

  getDescription(): CadrartFormControl<string> {
    return this.get('description') as CadrartFormControl<string>;
  }

  getImage(): CadrartFormControl<string> {
    return this.get('image') as CadrartFormControl<string>;
  }

  getAutoMargin(): CadrartFormControl<boolean> {
    return this.get('autoMargin') as CadrartFormControl<boolean>;
  }

  getAutoOpening(): CadrartFormControl<boolean> {
    return this.get('autoOpening') as CadrartFormControl<boolean>;
  }

  getAutoGlass(): CadrartFormControl<boolean> {
    return this.get('autoGlass') as CadrartFormControl<boolean>;
  }

  getTotal(): CadrartFormControl<number> {
    return this.get('total') as CadrartFormControl<number>;
  }

  getTotalBeforeReduction(): CadrartFormControl<number> {
    return this.get('totalBeforeReduction') as CadrartFormControl<number>;
  }

  getTotalWithVat(): CadrartFormControl<number> {
    return this.get('totalWithVat') as CadrartFormControl<number>;
  }

  public addTask(task?: ICadrartTask): void {
    (this.get('tasks') as FormArray<CadrartTaskForm>).push(new CadrartTaskForm(this.articleService, task), {
      emitEvent: false
    });
  }

  public syncSizes(): void {
    const value = {
      glassWidth: 0,
      glassHeight: 0,
      marginWidth: 0,
      marginHeight: 0,
      openingWidth: 0,
      openingHeight: 0,
      ...this.getRawValue()
    };

    if (this.value.autoOpening) {
      this.get('openingWidth')?.setValue(value.glassWidth - this.value.marginWidth, { emitEvent: false });
      this.get('openingHeight')?.setValue(this.value.glassHeight - this.value.marginHeight, { emitEvent: false });
    }

    if (this.value.autoMargin) {
      this.get('marginWidth')?.setValue(this.value.glassWidth - this.value.openingWidth, { emitEvent: false });
      this.get('marginHeight')?.setValue(this.value.glassHeight - this.value.openingHeight, { emitEvent: false });
    }

    if (this.value.autoGlass) {
      this.get('glassWidth')?.setValue(this.value.marginWidth + this.value.openingWidth, { emitEvent: false });
      this.get('glassHeight')?.setValue(this.value.marginHeight + this.value.openingHeight, { emitEvent: false });
    }
  }

  updateTasks(): void {
    const tasks = this.getTasks();
    const latestTask = tasks.controls[tasks.controls.length - 1];

    if (latestTask && latestTask.getRawValue().article) {
      this.addTask();
    }
  }

  updatePrice(reduction: number, vat: number): void {
    const tasks = this.getTasks();
    const width = (this.getGlassWidth().value ?? 0) / 100;
    const height = (this.getGlassHeight().value ?? 0) / 100;
    const lengthSize = (width + height) * 2;
    const areaSize = width * height;
    const count = this.getCount().value ?? 1;
    let total = 0;
    let totalBeforeReduction = 0;
    let totalWithVat = 0;

    for (const task of tasks.controls || []) {
      task.updatePrice(lengthSize, areaSize, reduction, vat);

      total += numberRound2(task.getTotal().value ?? 0);
      total += numberRound2(task.getSubTasksTotal() ?? 0);
      totalBeforeReduction += numberRound2(task.getTotalBeforeReduction().value ?? 0);
      totalBeforeReduction += numberRound2(task.getSubTasksTotalBeforeReduction() ?? 0);
      totalWithVat += numberRound2(task.getTotalWithVat().value ?? 0);
      totalWithVat += numberRound2(task.getSubTasksTotalWithVat() ?? 0);
    }

    this.getTotal().setValue(numberRound2(total * count), { emitEvent: false });
    this.getTotalBeforeReduction().setValue(numberRound2(totalBeforeReduction * count), { emitEvent: false });
    this.getTotalWithVat().setValue(numberRound2(totalWithVat * count), { emitEvent: false });
  }

  sendUpdates(): void {
    const tasks = this.getTasks();

    for (const task of tasks.controls) {
      task.sendUpdates();
    }

    this.$updateEvents.next(this.getRawValue());
  }

  public override getRawValue(): PartialDeep<ICadrartJob> {
    const value = super.getRawValue();
    const tasks = this.getTasks().value.filter((task: CadrartTask) => task.article !== null);

    return {
      ...value,
      startDate: value.startDate || undefined,
      tasks: tasks
    };
  }
}
