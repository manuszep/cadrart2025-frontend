import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  EsfsFieldComponent,
  EsfsFormControlCheckbox,
  EsfsFormControlDate,
  EsfsFormControlDropdown,
  EsfsFormControlNumber,
  EsfsFormControlText,
  EsfsFormGroup,
  EsfsFormGroupDirective,
  IEsfsFormGroupConfig
} from '@manuszep/es-form-system';

import { ICadrartFilterConfig } from './model';

@Component({
  selector: 'cadrart-filtering',
  templateUrl: './filtering.html',
  styleUrls: ['./filtering.scss'],
  imports: [EsfsFieldComponent, EsfsFormGroupDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CadrartFilteringComponent implements OnInit {
  @Input({ required: true }) public config!: ICadrartFilterConfig;

  public form: EsfsFormGroup | undefined;

  ngOnInit(): void {
    this.form = this.generateConfig(this.config);
  }

  generateConfig(config: ICadrartFilterConfig): EsfsFormGroup {
    const fieldsConfig: IEsfsFormGroupConfig = {};

    for (const field of config.fields) {
      switch (field.type) {
        case 'toggle':
          fieldsConfig[field.key] = new EsfsFormControlCheckbox(false, { required: false, label: field.label });
          break;
        case 'text':
          fieldsConfig[field.key] = new EsfsFormControlText('', {
            required: false,
            minLength: 2,
            maxLength: 100,
            label: field.label
          });
          break;
        case 'select':
          fieldsConfig[field.key] = new EsfsFormControlDropdown(undefined, {
            required: false,
            options: field.values?.map((value) => ({ label: value.label, value: value.value })),
            label: field.label
          });
          break;
        case 'date':
          fieldsConfig[field.key] = new EsfsFormControlDate('', { required: false, label: field.label });
          break;
        case 'number':
          fieldsConfig[field.key] = new EsfsFormControlNumber(0, {
            required: false,
            min: 0,
            max: 99999,
            label: field.label
          });
          break;
      }
    }

    return new EsfsFormGroup(fieldsConfig, { updateOn: 'change' });
  }
}
