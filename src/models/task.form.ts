import { AbstractControl, AbstractControlOptions, FormArray, ValidationErrors } from '@angular/forms';
import { ECadrartArticlePriceMethod, ICadrartArticle, ICadrartTask } from '@manuszep/cadrart2025-common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldText, CadrartFieldTextOption } from '../form-system/text/text.config';
import { CadrartArticleService } from '../services/article.service';
import { CadrartFieldImage } from '../form-system/image/image.config';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFormGroup } from '../form-system/form-group';
import { applyReduction, numberRound2, PartialDeep } from '../utils';

import { CadrartFormula } from './formula.model';

function getFormConfig(articleService: CadrartArticleService, isChild = false) {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    article: new CadrartFormControl<ICadrartArticle | undefined>(
      undefined,
      new CadrartFieldText({
        required: false,
        label: false,
        options: isChild ? articleService.getCombinableAsOptions() : articleService.getEntitiesAsOptions(),
        compareOptionsToValue: (option: CadrartFieldTextOption, value: ICadrartArticle) => value.name === option.label
      })
    ),
    comment: new CadrartFormControl('', new CadrartFieldText({ required: false, label: false })),
    image: new CadrartFormControl('', new CadrartFieldImage({ required: false, folder: 'task' })),
    doneCount: new CadrartFormControl(0, new CadrartFieldNumber({ required: true })),
    parent: new CadrartFormControl<ICadrartTask | undefined>(undefined),
    children: new FormArray<CadrartTaskForm>([]),
    isChild: new CadrartFormControl<boolean>(isChild),
    total: new CadrartFormControl<number>(0),
    totalBeforeReduction: new CadrartFormControl<number>(0),
    totalWithVat: new CadrartFormControl<number>(0)
  };
}

export class CadrartTaskForm extends CadrartFormGroup<ICadrartTask> {
  private _subTasksTotal = 0;
  private _subTasksTotalBeforeReduction = 0;
  private _subTasksTotalWithVat = 0;
  private _updatePriceSubject: Subject<void> = new Subject<void>();

  public validationChanges: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  private $updateEvents: Subject<PartialDeep<ICadrartTask>> = new Subject();

  constructor(
    private readonly articleService: CadrartArticleService,
    entity?: ICadrartTask,
    isChild = false,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(articleService, isChild), entity ?? {}, options);

    this.setValidators((control: AbstractControl<any, any>): ValidationErrors | null => {
      const article = control.get('article')?.value as ICadrartArticle | undefined;
      const job = control.parent?.parent;

      const maxLength = Number(article?.maxLength) || null;
      const maxWidth = Number(article?.maxWidth) || null;
      const getPriceMethod = article?.getPriceMethod || ECadrartArticlePriceMethod.BY_LENGTH;

      const jobWidth = Number(job?.get('glassWidth')?.value || null);
      const jobLength = Number(job?.get('glassHeight')?.value || null);

      if (!job || (!maxLength && !maxWidth) || (jobWidth === null && jobLength === null)) {
        this.validationChanges.next();

        return null;
      }

      if (getPriceMethod === ECadrartArticlePriceMethod.BY_AREA) {
        const biggerSize = Math.max(jobWidth, jobLength);
        const biggerLimit = maxWidth && maxLength ? Math.max(maxWidth, maxLength) : maxWidth || maxLength;
        const smallerSize = Math.min(jobWidth, jobLength);
        const smallerLimit = maxWidth && maxLength ? Math.min(maxWidth, maxLength) : maxWidth || maxLength;

        /*console.trace({
          biggerSize, biggerLimit, smallerSize, smallerLimit
        })*/

        if (biggerSize > (biggerLimit as number)) {
          this.validationChanges.next();

          return { taskMax: biggerLimit };
        }

        if (smallerSize > (smallerLimit as number)) {
          this.validationChanges.next();

          return { taskMax: smallerLimit };
        }
      } else if (maxLength !== null && (jobLength > maxLength || jobWidth > maxLength)) {
        this.validationChanges.next();

        return { taskMax: maxLength };
      }

      this.validationChanges.next();

      return null;
    });

    if (entity && entity.children) {
      for (const task of entity.children) {
        this.addSubTask(task);
      }
    }
  }

  getUpdateEvents(): Observable<PartialDeep<ICadrartTask>> {
    return this.$updateEvents.asObservable();
  }

  get onUpdatePrice(): Observable<void> {
    return this._updatePriceSubject.asObservable();
  }

  getArticle(): CadrartFormControl<ICadrartArticle | undefined> {
    return this.get('article') as CadrartFormControl<ICadrartArticle | undefined>;
  }

  getComment(): CadrartFormControl<string> {
    return this.get('comment') as CadrartFormControl<string>;
  }

  getImage(): CadrartFormControl<string> {
    return this.get('image') as CadrartFormControl<string>;
  }

  getDoneCount(): CadrartFormControl<number> {
    return this.get('doneCount') as CadrartFormControl<number>;
  }

  getParent(): CadrartFormControl<ICadrartTask | undefined> {
    return this.get('parent') as CadrartFormControl<ICadrartTask | undefined>;
  }

  getChildren(): FormArray<CadrartTaskForm> {
    return this.get('children') as FormArray<CadrartTaskForm>;
  }

  getIsChild(): CadrartFormControl<boolean> {
    return this.get('isChild') as CadrartFormControl<boolean>;
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

  getSubTasksTotal(): number {
    return this._subTasksTotal;
  }

  getSubTasksTotalBeforeReduction(): number {
    return this._subTasksTotalBeforeReduction;
  }

  getSubTasksTotalWithVat(): number {
    return this._subTasksTotalWithVat;
  }

  public addSubTask(task?: ICadrartTask): void {
    (this.get('children') as FormArray<CadrartTaskForm>).push(new CadrartTaskForm(this.articleService, task, true));
  }

  updatePrice(length: number, area: number, reduction = 0, vat = 21): void {
    const article = this.getArticle().value;

    if (!article) {
      return;
    }

    this._subTasksTotal = 0;
    this._subTasksTotalBeforeReduction = 0;
    this._subTasksTotalWithVat = 0;

    const method = article.getPriceMethod ?? ECadrartArticlePriceMethod.BY_LENGTH;
    const formula = new CadrartFormula(article.formula ?? {});
    const children = this.getChildren().controls ?? [];
    const maxReduction = article.maxReduction !== null ? Number(article.maxReduction) : 100;
    const finalReduction = reduction < maxReduction ? reduction : maxReduction;
    const multiplier =
      method === ECadrartArticlePriceMethod.BY_LENGTH
        ? length
        : method === ECadrartArticlePriceMethod.BY_AREA
        ? area
        : 1;
    const sellPrice = article.sellPrice ?? 0;
    const finalPrice = formula ? formula.apply(sellPrice, multiplier) : sellPrice * multiplier;

    for (const subTask of children) {
      subTask.updatePrice(length, area, reduction, vat);

      this._subTasksTotal += numberRound2(subTask.getTotal().value ?? 0);
      this._subTasksTotalBeforeReduction += numberRound2(subTask.getTotalBeforeReduction().value ?? 0);
      this._subTasksTotalWithVat += numberRound2(subTask.getTotalWithVat().value ?? 0);
    }

    const total = numberRound2(applyReduction(finalPrice, finalReduction));

    this.getTotal().setValue(total, { emitEvent: false });
    this.getTotalBeforeReduction().setValue(numberRound2(finalPrice), { emitEvent: false });
    this.getTotalWithVat().setValue(numberRound2(total * (1 + vat / 100)), { emitEvent: false });

    this._updatePriceSubject.next();
  }

  sendUpdates() {
    const tasks = this.getChildren();

    for (const task of tasks.controls) {
      task.sendUpdates();
    }

    this.$updateEvents.next(this.getRawValue());
  }
}
