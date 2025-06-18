import { ICadrartColor } from '../../styles/styles.model';
import { ICadrartIcon } from '../icon/icon.model';

export interface IActionsGroupAction<TEntry> {
  icon: ICadrartIcon;
  color: ICadrartColor;
  outline?: boolean;
  disabled?: boolean;
  tooltip?: string;
  action: (task: TEntry) => void;
}
