import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';

export type ICadrartFieldComponentType =
  | 'checkbox'
  | 'image'
  | 'number'
  | 'orientation'
  | 'select'
  | 'text'
  | 'date'
  | 'address';

export interface ICadrartFieldConfig {
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  tabIndex?: number;
  nonNullable?: boolean;
  updateOn?: 'change' | 'blur' | 'submit';
  validation?: ValidatorFn[];
  asyncValidation?: AsyncValidatorFn[];
}

export abstract class CadrartField<TConfig extends ICadrartFieldConfig> {
  public required = false;
  public disabled = false;
  public readonly = false;
  public autofocus = false;
  public tabIndex = 0;
  public nonNullable = false;
  public updateOn?: 'change' | 'blur' | 'submit' = 'change';
  public validation: ValidatorFn[] = [];
  public asyncValidation: AsyncValidatorFn[] = [];
  public abstract componentType: ICadrartFieldComponentType;

  constructor(protected _config: TConfig) {
    this.required = _config.required ?? false;
    this.disabled = _config.disabled ?? false;
    this.readonly = _config.readonly ?? false;
    this.autofocus = _config.autofocus ?? false;
    this.tabIndex = _config.tabIndex ?? 0;
    this.nonNullable = _config.nonNullable ?? false;
    this.updateOn = _config.updateOn ?? 'change';
    this.validation = _config.validation ?? [];
    this.asyncValidation = _config.asyncValidation ?? [];

    this.extractValidatorsFromConfig();
  }

  protected extractValidatorsFromConfig(): void {
    if (this.required) {
      this.validation.push(Validators.required);
    }
  }
}
