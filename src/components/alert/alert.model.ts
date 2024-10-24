import { ICadrartColor } from '../../styles/styles.model';
import { ICadrartIcon } from '../icon/icon.model';

export interface ICadrartAlert {
  id: number;
  ttl?: number;
  icon?: ICadrartIcon;
  message: string;
  type: ICadrartColor;
}
