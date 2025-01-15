import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export interface ICadrartFieldAddressValue {
  street?: string;
  number?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface ICadrartFieldAddressConfig extends ICadrartFieldConfig {
  label?: boolean;
}

export class CadrartFieldAddress extends CadrartField<ICadrartFieldAddressConfig> {
  public label?: boolean;
  public override componentType: ICadrartFieldComponentType = 'address';

  constructor(protected override _config: ICadrartFieldAddressConfig) {
    super(_config);

    this.label = _config.label ?? true;
  }
}
