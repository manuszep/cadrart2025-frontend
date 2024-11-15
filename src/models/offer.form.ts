import {
  ECadrartOfferStatus,
  ICadrartClient,
  ICadrartJob,
  ICadrartOffer,
  ICadrartTask,
  ICadrartTeamMember
} from '@manuszep/cadrart2025-common';
import { Observable, Subject } from 'rxjs';
import { AbstractControlOptions, FormArray } from '@angular/forms';

import { CadrartFormControl } from '../form-system/form-control';
import { CadrartFieldText, CadrartFieldTextOption } from '../form-system/text/text.config';
import { CadrartClientService } from '../services/client.service';
import { CadrartFieldSelect } from '../form-system/select/select.config';
import { CadrartTeamMemberService } from '../services/team-member.service';
import { CadrartFieldNumber } from '../form-system/number/number.config';
import { CadrartFormGroup, FormConfig } from '../form-system/form-group';
import { CadrartLocationService } from '../services/location.service';
import { CadrartArticleService } from '../services/article.service';
import { numberRound2, PartialDeep } from '../utils';

import { CadrartJobForm } from './job.form';

function getFormConfig(clientService: CadrartClientService, teamMemberService: CadrartTeamMemberService): FormConfig {
  return {
    id: new CadrartFormControl<number | undefined>(undefined),
    number: new CadrartFormControl<string | undefined>(undefined),
    client: new CadrartFormControl<ICadrartClient | undefined>(
      undefined,
      new CadrartFieldText({
        required: true,
        options: clientService.getEntitiesAsOptions(),
        compareOptionsToValue: (option: CadrartFieldTextOption, value: ICadrartClient): boolean =>
          (option.value as ICadrartClient).id === value.id
      })
    ),
    assignedTo: new CadrartFormControl<ICadrartTeamMember | undefined>(
      undefined,
      new CadrartFieldSelect({ required: true, options: teamMemberService.getEntitiesAsOptions() })
    ),
    status: new CadrartFormControl<ECadrartOfferStatus>(
      ECadrartOfferStatus.STATUS_CREATED,
      new CadrartFieldSelect({
        required: true,
        options: [
          { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_CREATED}`, value: ECadrartOfferStatus.STATUS_CREATED },
          { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_DONE}`, value: ECadrartOfferStatus.STATUS_DONE },
          { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_STARTED}`, value: ECadrartOfferStatus.STATUS_STARTED }
        ]
      })
    ),
    adjustedReduction: new CadrartFormControl<number | undefined>(
      undefined,
      new CadrartFieldNumber({ required: false, min: 0, max: 100 })
    ),
    adjustedVat: new CadrartFormControl<number | undefined>(
      undefined,
      new CadrartFieldNumber({ required: false, min: 0, max: 100 })
    ),
    jobs: new FormArray<CadrartJobForm>([]),
    total: new CadrartFormControl<number>(0),
    totalBeforeReduction: new CadrartFormControl<number>(0),
    totalWithVat: new CadrartFormControl<number>(0)
  };
}

export class CadrartOfferForm extends CadrartFormGroup<ICadrartOffer> {
  private $updateEvents: Subject<PartialDeep<ICadrartOffer>> = new Subject();

  constructor(
    private readonly clientService: CadrartClientService,
    private readonly teamMemberService: CadrartTeamMemberService,
    private readonly locationService: CadrartLocationService,
    private readonly articleService: CadrartArticleService,
    entity?: ICadrartOffer,
    options: AbstractControlOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(clientService, teamMemberService), entity ?? {}, options);

    if (entity && entity.jobs) {
      for (const job of entity.jobs) {
        this.addJob(job);
      }
    }
  }

  getUpdateEvents(): Observable<PartialDeep<ICadrartOffer>> {
    return this.$updateEvents.asObservable();
  }

  getNumber(): CadrartFormControl<string | undefined> {
    return this.get('number') as CadrartFormControl<string | undefined>;
  }

  getClient(): CadrartFormControl<ICadrartClient | undefined> {
    return this.get('client') as CadrartFormControl<ICadrartClient | undefined>;
  }

  getAssignedTo(): CadrartFormControl<ICadrartTeamMember | undefined> {
    return this.get('assignedTo') as CadrartFormControl<ICadrartTeamMember | undefined>;
  }

  getStatus(): CadrartFormControl<ECadrartOfferStatus> {
    return this.get('status') as CadrartFormControl<ECadrartOfferStatus>;
  }

  getAdjustedReduction(): CadrartFormControl<number | undefined> {
    return this.get('adjustedReduction') as CadrartFormControl<number | undefined>;
  }

  getAdjustedVat(): CadrartFormControl<number | undefined> {
    return this.get('adjustedVat') as CadrartFormControl<number | undefined>;
  }

  getJobs(): FormArray<CadrartJobForm> {
    return this.get('jobs') as FormArray<CadrartJobForm>;
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

  addJob(job?: ICadrartJob): void {
    this.getJobs().push(new CadrartJobForm(this.locationService, this.articleService, job));
  }

  duplicateJob(index: number): void {
    const jobs = this.getJobs();

    jobs.push(
      new CadrartJobForm(this.locationService, this.articleService, {
        ...jobs.value[index],
        id: undefined,
        tasks: jobs.value[index].tasks.map((task: ICadrartTask) => ({ ...task, id: undefined }))
      })
    );
  }

  getVat(): number {
    const client = this.getClient().value;
    const adjustedVat = this.getAdjustedVat().value;
    const clientVat = client && !isNaN(Number(client.vat)) ? Number(client.vat) : 21;
    const offerVat = adjustedVat && !isNaN(Number(adjustedVat)) ? Number(adjustedVat) : undefined;

    return offerVat ?? clientVat;
  }

  getReduction(): number {
    const client = this.getClient().value;
    const adjustedReduction = this.getAdjustedReduction().value;
    const clientReduction = client && !isNaN(Number(client.reduction)) ? Number(client.reduction) : null;
    const offerReduction = adjustedReduction && !isNaN(Number(adjustedReduction)) ? Number(adjustedReduction) : null;

    return offerReduction ?? clientReduction ?? 0;
  }

  updateJobSizes(): void {
    const jobs = this.getJobs();

    for (const job of jobs.controls) {
      job.syncSizes();
    }
  }

  updateTasks(): void {
    const jobs = this.getJobs();

    for (const job of jobs.controls) {
      job.updateTasks();
    }
  }

  updatePrice(): void {
    const reduction = this.getReduction();
    const vat = this.getVat();
    const jobs = this.getJobs();

    let total = 0;
    let totalBeforeReduction = 0;
    let totalWithVat = 0;

    for (const job of jobs.controls) {
      job.updatePrice(reduction, vat);

      total += job.getTotal().value ?? 0;
      totalBeforeReduction += job.getTotalBeforeReduction().value ?? 0;
      totalWithVat += job.getTotalWithVat().value ?? 0;
    }

    this.getTotal().setValue(numberRound2(total), { emitEvent: false });
    this.getTotalBeforeReduction().setValue(numberRound2(totalBeforeReduction), { emitEvent: false });
    this.getTotalWithVat().setValue(numberRound2(totalWithVat), { emitEvent: false });
  }

  sendUpdates(): void {
    const jobs = this.getJobs();

    for (const job of jobs.controls) {
      job.sendUpdates();
    }

    this.$updateEvents.next(this.getRawValue());
  }

  updateAll(): void {
    this.updateJobSizes();
    this.updateTasks();
    this.updatePrice();
    this.updateValueAndValidity({ emitEvent: false });
    this.sendUpdates();
  }
}
