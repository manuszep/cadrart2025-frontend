import { ICadrartImageFolder } from '../../components/image/image.model';
import { CadrartField, ICadrartFieldComponentType, ICadrartFieldConfig } from '../field-config.model';

export interface ICadrartFieldImageConfig extends ICadrartFieldConfig {
  label?: boolean;
  folder: ICadrartImageFolder;
}

export class CadrartFieldImage extends CadrartField<ICadrartFieldImageConfig> {
  public label?: boolean;
  public folder?: ICadrartImageFolder;
  public override componentType: ICadrartFieldComponentType = 'image';

  constructor(protected override _config: ICadrartFieldImageConfig) {
    super(_config);

    this.folder = _config.folder ?? 'default';
  }
}
