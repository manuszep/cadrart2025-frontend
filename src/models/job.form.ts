import { Observable, Subject } from 'rxjs';
import {
  ECadrartJobMeasureType,
  ECadrartJobOrientation,
  ICadrartJob,
  ICadrartLocation,
  ICadrartTask
} from '@manuszep/cadrart2025-common';
import {
  EsfsFormArray,
  EsfsFormControl,
  EsfsFormControlCheckbox,
  EsfsFormControlDate,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { CadrartLocationService } from '../services/location.service';
import { CadrartArticleService } from '../services/article.service';
import { numberRound2, PartialDeep } from '../utils';
import { cadrartGetJobMeasureLabel } from '../pipes/job-measure.pipe';
import { CadrartFormControlOrientation } from '../components/form-control-orientation/form-control-orientation.component';
import { CadrartFormControlImage } from '../components/form-control-image/form-control-image.component';

import { CadrartTaskForm } from './task.form';
import { CadrartTask } from './task.model';

function getFormConfig(locationService: CadrartLocationService): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    count: new EsfsFormControlNumber(1, { required: true, min: 0, label: false, placeholder: false }),
    orientation: new CadrartFormControlOrientation(ECadrartJobOrientation.VERTICAL, {
      required: true
    }),
    measure: new EsfsFormControlDropdown(ECadrartJobMeasureType.MEASURE_OPENING, {
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
    }),
    location: new EsfsFormControlDropdown<ICadrartLocation | undefined>(undefined, {
      options: locationService.getEntitiesAsOptions(),
      required: false
    }),
    dueDate: new EsfsFormControlDate('', { required: false, future: true }),
    startDate: new EsfsFormControlDate('', { required: false }),
    openingWidth: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    openingHeight: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    marginWidth: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    marginHeight: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    glassWidth: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    glassHeight: new EsfsFormControlNumber(0, {
      required: true,
      label: false,
      placeholder: false,
      min: 0,
      textAfter: true,
      updateOn: 'change'
    }),
    tasks: new EsfsFormArray<CadrartTaskForm>([]),
    description: new EsfsFormControlText('', { required: false, maxLength: 255 }),
    image: new CadrartFormControlImage('', { required: false, folder: 'job' }),
    autoMargin: new EsfsFormControlCheckbox(false, { label: false, tabIndex: 1, required: false }),
    autoOpening: new EsfsFormControlCheckbox(false, { label: false, tabIndex: 1, required: false }),
    autoGlass: new EsfsFormControlCheckbox(true, { label: false, tabIndex: 1, required: false }),
    total: new EsfsFormControl<number>(0),
    totalBeforeReduction: new EsfsFormControl<number>(0),
    totalWithVat: new EsfsFormControl<number>(0)
  };
}

export class CadrartJobForm extends EsfsFormGroup<ICadrartJob> {
  private $updateEvents: Subject<PartialDeep<ICadrartJob>> = new Subject();

  constructor(
    locationService: CadrartLocationService,
    private readonly articleService: CadrartArticleService,
    entity?: ICadrartJob,
    options: IEsfsFormGroupOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(locationService), options, 'FIELD', false, entity ?? {});

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

  getCount(): EsfsFormControl<number> {
    return this.get('count') as EsfsFormControl<number>;
  }

  getOrientation(): EsfsFormControl<ECadrartJobOrientation> {
    return this.get('orientation') as EsfsFormControl<ECadrartJobOrientation>;
  }

  getMeasure(): EsfsFormControl<ECadrartJobMeasureType> {
    return this.get('measure') as EsfsFormControl<ECadrartJobMeasureType>;
  }

  getLocation(): EsfsFormControl<ICadrartLocation | undefined> {
    return this.get('location') as EsfsFormControl<ICadrartLocation | undefined>;
  }

  getDueDate(): EsfsFormControl<string> {
    return this.get('dueDate') as EsfsFormControl<string>;
  }

  getStartDate(): EsfsFormControl<string> {
    return this.get('startDate') as EsfsFormControl<string>;
  }

  getOpeningWidth(): EsfsFormControl<number> {
    return this.get('openingWidth') as EsfsFormControl<number>;
  }

  getOpeningHeight(): EsfsFormControl<number> {
    return this.get('openingHeight') as EsfsFormControl<number>;
  }

  getMarginWidth(): EsfsFormControl<number> {
    return this.get('marginWidth') as EsfsFormControl<number>;
  }

  getMarginHeight(): EsfsFormControl<number> {
    return this.get('marginHeight') as EsfsFormControl<number>;
  }

  getGlassWidth(): EsfsFormControl<number> {
    return this.get('glassWidth') as EsfsFormControl<number>;
  }

  getGlassHeight(): EsfsFormControl<number> {
    return this.get('glassHeight') as EsfsFormControl<number>;
  }

  getTasks(): EsfsFormArray<CadrartTaskForm> {
    return this.get('tasks') as EsfsFormArray<CadrartTaskForm>;
  }

  getDescription(): EsfsFormControl<string> {
    return this.get('description') as EsfsFormControl<string>;
  }

  getImage(): EsfsFormControl<string> {
    return this.get('image') as EsfsFormControl<string>;
  }

  getAutoMargin(): EsfsFormControl<boolean> {
    return this.get('autoMargin') as EsfsFormControl<boolean>;
  }

  getAutoOpening(): EsfsFormControl<boolean> {
    return this.get('autoOpening') as EsfsFormControl<boolean>;
  }

  getAutoGlass(): EsfsFormControl<boolean> {
    return this.get('autoGlass') as EsfsFormControl<boolean>;
  }

  getTotal(): EsfsFormControl<number> {
    return this.get('total') as EsfsFormControl<number>;
  }

  getTotalBeforeReduction(): EsfsFormControl<number> {
    return this.get('totalBeforeReduction') as EsfsFormControl<number>;
  }

  getTotalWithVat(): EsfsFormControl<number> {
    return this.get('totalWithVat') as EsfsFormControl<number>;
  }

  public addTask(task?: ICadrartTask): void {
    (this.get('tasks') as EsfsFormArray<CadrartTaskForm>).push(new CadrartTaskForm(this.articleService, task), {
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
