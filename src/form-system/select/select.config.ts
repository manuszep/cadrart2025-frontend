import { Observable } from 'rxjs';

import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export interface ICadrartFieldSelectConfig extends ICadrartFieldConfig {
  label?: boolean;
  placeholder?: boolean;
  options: { value: unknown; label: string }[] | Observable<{ value: unknown; label: string }[]>;
}

export class CadrartFieldSelect extends CadrartField<ICadrartFieldSelectConfig> {
  public label?: boolean;
  public placeholder?: boolean;
  public options?: Observable<{ value: unknown; label: string }[]>;
  public override componentType: ICadrartFieldComponentType = 'select';

  constructor(protected override _config: ICadrartFieldSelectConfig) {
    super(_config);

    this.label = _config.label ?? true;
    this.placeholder = _config.placeholder ?? true;

    if (_config.options instanceof Observable) {
      this.options = _config.options;
    } else if (Array.isArray(_config.options)) {
      this.options = new Observable((subscriber) => {
        subscriber.next(_config.options as { value: unknown; label: string }[]);
      });
    } else {
      throw new Error(`Invalid options type for select field`);
    }
  }
}
