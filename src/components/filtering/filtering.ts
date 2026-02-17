import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EsfsFieldComponent,
  EsfsFormControlDate,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  EsfsFormGroupDirective,
  IEsfsFormGroupConfig
} from '@manuszep/es-form-system';

import { CadrartDataConnectorService } from '../../services/data-connector.service';
import { CadrartButtonToggleComponent } from '../button-toggle/button-toggle.component';

import { ICadrartFilterConfig, ICadrartFilterConfigField } from './model';

@Component({
  selector: 'cadrart-filtering',
  templateUrl: './filtering.html',
  styleUrls: ['./filtering.scss'],
  imports: [EsfsFieldComponent, EsfsFormGroupDirective, CadrartButtonToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFilteringComponent implements OnInit {
  @Input({ required: true }) public config!: ICadrartFilterConfig;

  private readonly dataConnectorService = inject(CadrartDataConnectorService);
  public form?: EsfsFormGroup;

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.form = this.generateForm(this.config);

    // Initial sync
    this.dataConnectorService.setExtraParams(this.form.value, false);

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      this.dataConnectorService.setExtraParams(values);
    });
  }

  private generateForm(config: ICadrartFilterConfig): EsfsFormGroup {
    const fieldsConfig: IEsfsFormGroupConfig = {};

    for (const field of config.fields) {
      fieldsConfig[field.key] = this.createControl(field);
    }

    return new EsfsFormGroup(fieldsConfig, { updateOn: 'change' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createControl(field: ICadrartFilterConfigField): any {
    switch (field.type) {
      case 'toggle':
        return new EsfsFormControlText((field.values?.[0]?.value as string) ?? '', { label: field.label });
      case 'text':
        return new EsfsFormControlText('', { label: field.label });
      case 'select':
        return new EsfsFormControlDropdown(undefined, {
          options: field.values?.map((v) => ({ label: v.label, value: v.value })),
          label: field.label
        });
      case 'date':
        return new EsfsFormControlDate('', { label: field.label });
      case 'number':
        return new EsfsFormControlNumber(0, { label: field.label });
      default:
        return new EsfsFormControlText('', { label: field.label });
    }
  }
}
