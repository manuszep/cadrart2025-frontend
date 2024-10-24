import { Observable } from 'rxjs';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

import { ICadrartIcon } from '../../components/icon/icon.model';
import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export type CadrartFieldTextOption = { value: unknown; label: string };

export type CadrartFieldTextOptions = CadrartFieldTextOption[];

export type CadrartFieldTextOptionsObservable = Observable<CadrartFieldTextOptions>;

export interface ICadrartFieldTextConfig extends ICadrartFieldConfig {
  autocomplete?: boolean;
  compareOptionsToValue?: (option: CadrartFieldTextOption, value: any) => boolean;
  pattern?: string;
  label?: boolean;
  placeholder?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  iconBefore?: ICadrartIcon;
  iconAfter?: ICadrartIcon;
  textAfter?: string;
  options?: CadrartFieldTextOptions | CadrartFieldTextOptionsObservable;
}

export class CadrartFieldText extends CadrartField<ICadrartFieldTextConfig> {
  public autocomplete?: boolean;
  public compareOptionsToValue: (option: CadrartFieldTextOption, value: unknown) => boolean;
  public pattern?: string;
  public label?: boolean;
  public placeholder?: boolean;
  public minLength?: number;
  public maxLength?: number;
  public type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  public iconBefore?: ICadrartIcon;
  public iconAfter?: ICadrartIcon;
  public textAfter?: string;
  public options?: CadrartFieldTextOptionsObservable;
  public override componentType: ICadrartFieldComponentType = 'text';

  constructor(protected override _config: ICadrartFieldTextConfig) {
    super(_config);

    if (_config.options instanceof Observable) {
      this.options = _config.options;
    } else if (Array.isArray(_config.options)) {
      this.options = new Observable((subscriber) => {
        subscriber.next(_config.options as CadrartFieldTextOptions);
      });
    }

    this.autocomplete = _config.autocomplete ?? false;
    this.compareOptionsToValue =
      _config.compareOptionsToValue ??
      ((option: CadrartFieldTextOption, value: unknown) => JSON.stringify(option.value) === JSON.stringify(value));
    this.pattern = _config.pattern ?? '';
    this.label = _config.label ?? true;
    this.placeholder = _config.placeholder ?? true;
    this.minLength = _config.minLength;
    this.maxLength = _config.maxLength;
    this.type = _config.type ?? 'text';
    this.iconBefore = _config.iconBefore;
    this.iconAfter = _config.iconAfter;
    this.textAfter = _config.textAfter;
  }

  protected override extractValidatorsFromConfig(): void {
    super.extractValidatorsFromConfig();

    this.validation = this.validation ?? [];
    this.asyncValidation = this.asyncValidation ?? [];

    if (this._config.minLength) {
      this.validation.push(Validators.minLength(this._config.minLength));
    }

    if (this._config.maxLength) {
      this.validation.push(Validators.maxLength(this._config.maxLength));
    }

    if (this._config.pattern) {
      this.validation.push(Validators.pattern(this._config.pattern));
    }

    if (this._config.type === 'email') {
      this.validation.push(Validators.email);
    }

    if (this._config.type === 'password') {
      this.validation.push((control: AbstractControl): ValidationErrors | null => {
        const error = Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)(control);

        if (error) {
          return {
            password: {
              ...error,
              minLength: 8,
              maxLength: 255
            }
          };
        }

        return null;
      });
      this.validation.push(Validators.minLength(8));
      this.validation.push(Validators.maxLength(255));
    }
  }
}
