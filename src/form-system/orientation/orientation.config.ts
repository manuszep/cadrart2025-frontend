import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export type ICadrartFieldOrientationConfig = ICadrartFieldConfig;

export class CadrartFieldOrientation extends CadrartField<ICadrartFieldOrientationConfig> {
  public override componentType: ICadrartFieldComponentType = 'orientation';

  constructor(protected override _config: ICadrartFieldOrientationConfig) {
    super(_config);
  }
}
