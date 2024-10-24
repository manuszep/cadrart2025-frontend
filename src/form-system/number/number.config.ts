import { Validators } from '@angular/forms';

import { ICadrartIcon } from '../../components/icon/icon.model';
import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export interface ICadrartFieldNumberConfig extends ICadrartFieldConfig {
  label?: boolean;
  placeholder?: boolean;
  min?: number;
  max?: number;
  iconBefore?: ICadrartIcon;
  iconAfter?: ICadrartIcon;
  textAfter?: string;
}

export class CadrartFieldNumber extends CadrartField<ICadrartFieldNumberConfig> {
  public label?: boolean;
  public placeholder?: boolean;
  public min?: number;
  public max?: number;
  public iconBefore?: ICadrartIcon;
  public iconAfter?: ICadrartIcon;
  public textAfter?: string;
  public override componentType: ICadrartFieldComponentType = 'number';

  constructor(protected override _config: ICadrartFieldNumberConfig) {
    super(_config);

    this.label = _config.label ?? true;
    this.placeholder = _config.placeholder ?? true;
    this.min = _config.min;
    this.max = _config.max;
    this.iconBefore = _config.iconBefore;
    this.iconAfter = _config.iconAfter;
    this.textAfter = _config.textAfter;
  }

  protected override extractValidatorsFromConfig(): void {
    super.extractValidatorsFromConfig();

    this.validation = this.validation ?? [];
    this.asyncValidation = this.asyncValidation ?? [];

    if (this._config.min) {
      this.validation.push(Validators.min(this._config.min));
    }

    if (this._config.max) {
      this.validation.push(Validators.max(this._config.max));
    }
  }
}
