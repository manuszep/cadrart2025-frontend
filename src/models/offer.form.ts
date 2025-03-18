import {
  ECadrartOfferStatus,
  ICadrartClient,
  ICadrartJob,
  ICadrartOffer,
  ICadrartTask,
  ICadrartTeamMember
} from '@manuszep/cadrart2025-common';
import { Observable, Subject } from 'rxjs';
import {
  EsfsFormArray,
  EsfsFormControl,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormGroup,
  IEsfsDropdownOption,
  IEsfsFormGroupConfig,
  IEsfsFormGroupOptions
} from '@manuszep/es-form-system';

import { CadrartClientService } from '../services/client.service';
import { CadrartTeamMemberService } from '../services/team-member.service';
import { CadrartLocationService } from '../services/location.service';
import { CadrartArticleService } from '../services/article.service';
import { numberRound2, PartialDeep } from '../utils';

import { CadrartJobForm } from './job.form';

function getFormConfig(
  clientService: CadrartClientService,
  teamMemberService: CadrartTeamMemberService
): IEsfsFormGroupConfig {
  return {
    id: new EsfsFormControl<number | undefined>(undefined),
    number: new EsfsFormControl<string | undefined>(undefined),
    client: new EsfsFormControlDropdown<ICadrartClient | undefined>(undefined, {
      required: true,
      searchable: true,
      options: clientService.getEntitiesAsOptions(),
      compareOptionsToValue: (
        option: IEsfsDropdownOption<ICadrartClient | undefined>,
        value: ICadrartClient | undefined
      ): boolean => (option.value as ICadrartClient).id === value?.id
    }),
    assignedTo: new EsfsFormControlDropdown<ICadrartTeamMember | undefined>(undefined, {
      required: true,
      searchable: true,
      options: teamMemberService.getEntitiesAsOptions(),
      compareOptionsToValue: (
        option: IEsfsDropdownOption<ICadrartTeamMember | undefined>,
        value: ICadrartClient | undefined
      ): boolean => (option.value as ICadrartTeamMember).id === value?.id
    }),
    status: new EsfsFormControlDropdown<ECadrartOfferStatus>(ECadrartOfferStatus.STATUS_CREATED, {
      required: true,
      options: [
        { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_CREATED}`, value: ECadrartOfferStatus.STATUS_CREATED },
        { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_DONE}`, value: ECadrartOfferStatus.STATUS_DONE },
        { label: `OFFER.STATUS.${ECadrartOfferStatus.STATUS_STARTED}`, value: ECadrartOfferStatus.STATUS_STARTED }
      ]
    }),
    adjustedReduction: new EsfsFormControlNumber(null, { required: false, min: 0, max: 100 }),
    adjustedVat: new EsfsFormControlNumber(null, { required: false, min: 0, max: 100 }),
    jobs: new EsfsFormArray<CadrartJobForm>([]),
    total: new EsfsFormControl<number>(0),
    totalBeforeReduction: new EsfsFormControl<number>(0),
    totalWithVat: new EsfsFormControl<number>(0)
  };
}

export class CadrartOfferForm extends EsfsFormGroup<ICadrartOffer> {
  private $updateEvents: Subject<PartialDeep<ICadrartOffer>> = new Subject();

  constructor(
    private readonly clientService: CadrartClientService,
    private readonly teamMemberService: CadrartTeamMemberService,
    private readonly locationService: CadrartLocationService,
    private readonly articleService: CadrartArticleService,
    entity?: ICadrartOffer,
    options: IEsfsFormGroupOptions = { updateOn: 'change' }
  ) {
    super(getFormConfig(clientService, teamMemberService), options, 'FIELD', false, entity ?? {});

    if (entity && entity.jobs) {
      for (const job of entity.jobs) {
        this.addJob(job);
      }
    }
  }

  getUpdateEvents(): Observable<PartialDeep<ICadrartOffer>> {
    return this.$updateEvents.asObservable();
  }

  getNumber(): EsfsFormControl<string | undefined> {
    return this.get('number') as EsfsFormControl<string | undefined>;
  }

  getClient(): EsfsFormControl<ICadrartClient | undefined> {
    return this.get('client') as EsfsFormControl<ICadrartClient | undefined>;
  }

  getAssignedTo(): EsfsFormControl<ICadrartTeamMember | undefined> {
    return this.get('assignedTo') as EsfsFormControl<ICadrartTeamMember | undefined>;
  }

  getStatus(): EsfsFormControl<ECadrartOfferStatus> {
    return this.get('status') as EsfsFormControl<ECadrartOfferStatus>;
  }

  getAdjustedReduction(): EsfsFormControl<number | undefined> {
    return this.get('adjustedReduction') as EsfsFormControl<number | undefined>;
  }

  getAdjustedVat(): EsfsFormControl<number | undefined> {
    return this.get('adjustedVat') as EsfsFormControl<number | undefined>;
  }

  getJobs(): EsfsFormArray<CadrartJobForm> {
    return this.get('jobs') as EsfsFormArray<CadrartJobForm>;
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
