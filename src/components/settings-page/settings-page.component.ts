import { transition, trigger, useAnimation } from '@angular/animations';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription, map, startWith, take } from 'rxjs';
import { ICadrartApiEntity } from '@manuszep/cadrart2025-common';
import { EsfsFormGroup } from '@manuszep/es-form-system';

import { CadrartApiService } from '../../services/api.service';
import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { cadrartAnimationFlipInX, cadrartAnimationFlipOutX } from '../../utils/animation';
import { CadrartHeaderService } from '../header/header.service';
import { CadrartInspectorService } from '../inspector/inspector.service';

@Component({
  selector: 'cadrart-settings-page-component',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  animations: [
    trigger('existanceAnimation', [
      transition(':enter', useAnimation(cadrartAnimationFlipInX())),
      transition(':leave', useAnimation(cadrartAnimationFlipOutX()))
    ])
  ]
})
export abstract class CadrartSettingsPageComponent<
  TEntity extends ICadrartApiEntity,
  TFormGroup extends EsfsFormGroup<TEntity> | EsfsFormGroup<TEntity>
> {
  protected inspectorSubscription?: Subscription;

  public entityFormGroup?: TFormGroup;

  public data$: Observable<TEntity[]>;
  public getItemName;

  @ViewChild('formTemplate', { static: true }) formTemplate?: TemplateRef<unknown>;

  constructor(
    protected readonly dataConnectorService: CadrartDataConnectorService<TEntity>,
    protected readonly headerService: CadrartHeaderService,
    protected readonly inspectorService: CadrartInspectorService,
    protected readonly service: CadrartApiService<TEntity>
  ) {
    this.getItemName = this.service.getName;

    this.headerService.actionEvent$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.handleNewClick();
    });

    this.data$ = this.dataConnectorService
      .connect({
        requestor: (page: number, count: number, needle?: string) => this.service.getEntities(page, count, needle),
        accessors: {
          // TODO: Implement accessors
        }
      })
      .pipe(takeUntilDestroyed());
  }

  identify(_index: number, item: TEntity): number {
    return item.id ?? 0;
  }

  saveForm(newEntity = false): void {
    if (newEntity && this.entityFormGroup && this.entityFormGroup.valid) {
      this.service.addEntity(this.entityFormGroup.getRawValue() as TEntity).subscribe(() => {
        this.inspectorService.closeInspector();
        if (this.inspectorSubscription) {
          this.inspectorSubscription.unsubscribe();
        }
      });
    }

    if (!newEntity && this.entityFormGroup && this.entityFormGroup.get('id')?.value && this.entityFormGroup.valid) {
      this.service
        .updateEntity(this.entityFormGroup.get('id')?.value, this.entityFormGroup.getRawValue() as TEntity)
        .subscribe(() => {
          this.inspectorService.closeInspector();
          if (this.inspectorSubscription) {
            this.inspectorSubscription.unsubscribe();
          }
        });
    }
  }

  public handleNewClick(): void {
    this.entityFormGroup = this.getNewForm();

    if (!this.formTemplate) {
      return;
    }

    this.inspectorService.showInspector({
      title: `${this.service.endpointName.toUpperCase()}.NEW.TITLE`,
      content: this.formTemplate,
      actionLabel: `${this.service.endpointName.toUpperCase()}.NEW.SAVE`,
      actionDisabled: this.entityFormGroup.statusChanges.pipe(
        startWith(this.entityFormGroup.status !== 'VALID'),
        map((status) => status !== 'VALID')
      )
    });

    this.inspectorSubscription = this.inspectorService.actionEvent$.subscribe((action: string | null) => {
      if (action !== 'submit') {
        this.inspectorSubscription?.unsubscribe();

        return;
      }

      this.saveForm(true);
    });
  }

  public handleEditClick(entity: TEntity): void {
    if (!this.formTemplate) {
      return;
    }

    this.entityFormGroup = this.getNewForm(entity);

    this.inspectorService.showInspector({
      title: `${this.service.endpointName.toUpperCase()}.EDIT.TITLE`,
      content: this.formTemplate,
      actionLabel: `${this.service.endpointName.toUpperCase()}.EDIT.SAVE`
    });

    this.inspectorSubscription = this.inspectorService.actionEvent$.subscribe((action: string | null) => {
      if (action !== 'submit') {
        this.inspectorSubscription?.unsubscribe();

        return;
      }

      this.saveForm();
    });
  }

  public handleDeleteClick(entity: TEntity): void {
    if (!entity.id) {
      return;
    }

    this.service.deleteEntity(entity.id).pipe(take(1)).subscribe();
  }

  protected abstract getNewForm(entity?: TEntity): TFormGroup;
}
