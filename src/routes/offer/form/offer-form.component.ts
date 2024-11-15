import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
  signal
} from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, debounceTime, map, of, startWith, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ECadrartOfferStatus, ICadrartClient, ICadrartJob, ICadrartOffer } from '@manuszep/cadrart2025-common';

import { CadrartButtonComponent } from '../../../components/button/button.component';
import { CadrartCardComponent } from '../../../components/card/card.component';
import { CadrartIconComponent } from '../../../components/icon/icon.component';
import { CadrartPricePipe } from '../../../pipes/price.pipe';
import { CadrartFieldComponent } from '../../../form-system/field/field.component';
import { CadrartOfferService } from '../../../services/offer.service';
import { CadrartInspectorService } from '../../../components/inspector/inspector.service';
import { CadrartClientFormComponent } from '../../../forms/client/client-form.component';
import { CadrartClientService } from '../../../services/client.service';
import { ICadrartInspectorActionEvent } from '../../../components/inspector/inspector.model';
import { CadrartClient } from '../../../models/client.model';
import { CadrartJobFormComponent } from '../../../forms/job/job-form.component';
import { CadrartFooterService } from '../../../components/footer/footer.service';
import { CadrartHeaderService } from '../../../components/header/header.service';
import { CadrartAlertService } from '../../../components/alert/alert.service';
import { CadrartOfferForm } from '../../../models/offer.form';
import { CadrartClientForm } from '../../../models/client.form';
import { CadrartJobForm } from '../../../models/job.form';
import { CadrartTagService } from '../../../services/tag.service';
import { CadrartLocationService } from '../../../services/location.service';
import { CadrartTeamMemberService } from '../../../services/team-member.service';
import { CadrartArticleService } from '../../../services/article.service';
import { CadrartOfferHistoryComponent } from '../../../components/offer-history/offer-history.component';
import { PartialDeep } from '../../../utils';

@Component({
  selector: 'cadrart-route-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CadrartCardComponent,
    CadrartIconComponent,
    CadrartButtonComponent,
    CadrartPricePipe,
    CadrartFieldComponent,
    CadrartClientFormComponent,
    CadrartJobFormComponent,
    CadrartOfferHistoryComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class CadrartRouteOfferFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public extendedJob = 0;
  public clientOffers: WritableSignal<ICadrartOffer[]> = signal([]);
  public offerForm?: CadrartOfferForm;
  public clientForm?: CadrartClientForm;
  public offerId: number | null = null;
  public total: WritableSignal<number> = signal<number>(0);
  public totalWithVat: WritableSignal<number> = signal<number>(0);

  private unsubscribeSubject$ = new Subject<void>();
  private clientInspectorSubscription?: Subscription;

  @ViewChild('clientFormTemplate', { static: true }) clientFormTemplate?: TemplateRef<unknown>;
  @ViewChild('clientHistoryTemplate', { static: true }) clientHistoryTemplate?: TemplateRef<unknown>;
  @ViewChild('footerTemplate', { static: false }) footerTemplate!: TemplateRef<unknown>;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly service: CadrartOfferService,
    private readonly clientService: CadrartClientService,
    private readonly offerService: CadrartOfferService,
    private readonly inspectorService: CadrartInspectorService,
    private readonly footerService: CadrartFooterService,
    private readonly headerService: CadrartHeaderService,
    private readonly alertService: CadrartAlertService,
    private readonly tagService: CadrartTagService,
    private readonly locationService: CadrartLocationService,
    private readonly teamMemberService: CadrartTeamMemberService,
    private readonly articleService: CadrartArticleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');

          if (id) {
            return this.offerService.getEntity(id).pipe(
              map((offer: ICadrartOffer) => {
                this.offerId = offer.id;

                return new CadrartOfferForm(
                  this.clientService,
                  this.teamMemberService,
                  this.locationService,
                  this.articleService,
                  offer
                );
              })
            );
          }

          return of(null);
        }),
        take(1)
      )
      .subscribe((offer: CadrartOfferForm | null) => {
        if (offer === null) {
          this.offerForm = new CadrartOfferForm(
            this.clientService,
            this.teamMemberService,
            this.locationService,
            this.articleService
          );
          this.addJob();
        } else {
          this.offerForm = offer;
        }

        this.offerForm
          .getUpdateEvents()
          .pipe(takeUntil(this.unsubscribeSubject$))
          .subscribe((data: PartialDeep<ICadrartOffer>) => {
            this.total.set(data.total ?? 0);
            this.totalWithVat.set(data.totalWithVat ?? 0);
          });

        this.offerForm.valueChanges.pipe(takeUntil(this.unsubscribeSubject$), debounceTime(300)).subscribe(() => {
          this.handleModelChange();
        });

        setTimeout(() => {
          this.handleModelChange();
        });

        this.cdRef.markForCheck();
      });

    this.headerService.setNavigation([]);
    this.headerService.setAction({
      label: 'ADD_JOB',
      icon: 'add_card',
      tag: 'Alt + J',
      hotkey: 'alt.j'
    });

    this.headerService.actionEvent$.pipe(takeUntil(this.unsubscribeSubject$)).subscribe(() => {
      this.addJob();
    });
  }

  ngAfterViewInit(): void {
    this.footerService.showFooter(this.footerTemplate);
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next();
    this.unsubscribeSubject$.complete();
    this.footerService.closeFooter();
    this.headerService.clearNavigation();
  }

  getjobsControl(): FormArray<CadrartJobForm> {
    return this.offerForm?.get('jobs') as FormArray<CadrartJobForm>;
  }

  addJob(job?: ICadrartJob): void {
    this.offerForm?.addJob(job);
    this.extendedJob = this.getjobsControl().length - 1;
    this.cdRef.markForCheck();
  }

  saveClientForm(): void {
    this.clientService
      .addEntity(this.clientForm?.getRawValue() as ICadrartClient)
      .subscribe((client: ICadrartClient) => {
        this.inspectorService.closeInspector();
        if (this.clientInspectorSubscription) {
          this.clientInspectorSubscription.unsubscribe();
        }

        this.offerForm?.get('client')?.setValue(client);

        this.alertService.add({
          message: 'CLIENT.NEW.SUCCESS',
          type: 'success',
          icon: 'check_circle'
        });

        this.clientForm = undefined;
      });
  }

  save(): void {
    const offer = this.offerForm?.getRawValue() as ICadrartOffer;

    const action = offer.id ? this.service.updateEntity(offer.id, offer) : this.service.addEntity(offer);

    action.subscribe((savedOffer: ICadrartOffer) => {
      this.alertService.add({
        message: 'OFFER.SAVE.SUCCESS',
        type: 'success',
        icon: 'check_circle'
      });

      if (!this.offerId) {
        this.router.navigate(['/offer', savedOffer.id]);
      }
    });
  }

  handleAddClient(): void {
    if (!this.clientFormTemplate) {
      return;
    }

    this.clientForm = new CadrartClientForm(this.tagService);

    this.inspectorService.showInspector({
      title: 'CLIENT.NEW.TITLE',
      content: this.clientFormTemplate,
      actionLabel: 'CLIENT.NEW.SAVE',
      actionDisabled: this.clientForm.statusChanges.pipe(
        startWith(this.clientForm.status !== 'VALID'),
        map((status) => status !== 'VALID')
      )
    });

    this.clientInspectorSubscription = this.inspectorService.actionEvent$
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((e: ICadrartInspectorActionEvent) => {
        if (e === 'submit') {
          this.saveClientForm();
        }

        if (e === 'close') {
          this.clientInspectorSubscription?.unsubscribe();
        }
      });
  }

  handleModelChange(): void {
    this.offerForm?.updateAll();
  }

  handleJobDuplicate(i: number): void {
    this.offerForm?.duplicateJob(i);
    this.extendedJob = this.getjobsControl().length - 1;
  }

  handleJobDelete(i: number): void {
    this.getjobsControl().removeAt(i);
    this.extendedJob = this.getjobsControl().length - 1;
  }

  handleJobToggle(index: number): void {
    this.extendedJob = this.extendedJob === index ? -1 : index;
  }

  handleClientHistoryClick(): void {
    const client = this.offerForm?.getClient().value as CadrartClient | null;

    if (!this.clientHistoryTemplate || !client || !client.id) {
      return;
    }

    this.offerService
      .getEntitiesForClient(client.id)
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((offers: ICadrartOffer[]) => {
        this.clientOffers.set(offers);
      });

    this.inspectorService.showInspector({
      title: client.name,
      content: this.clientHistoryTemplate,
      closeOnClickOut: true
    });
  }

  handleSaveAndPlay(): void {
    this.offerForm?.getStatus().setValue(ECadrartOfferStatus.STATUS_STARTED);
    this.save();
  }

  handleSave(): void {
    this.offerForm?.getStatus().setValue(ECadrartOfferStatus.STATUS_CREATED);
    this.save();
  }

  handleOfferHistoryClick(job: ICadrartJob): void {
    this.addJob(job);
  }
}
